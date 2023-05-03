import threading

from django.db import models
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.cache import cache
from django.contrib.auth.models import UserManager
from django.db.models.signals import pre_delete, pre_save, post_save, m2m_changed
from django.dispatch import receiver

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from otakus import base_models

from otakus.helpers import create_notification
from otakus.helpers import get_user_new_level
from otakus.helpers import notify_reviewers_of_a_new_contribution
from otakus.helpers import contribution_got_reviewed

# excluding super users (e.g. admin) from all users queryset
class OtakusQuerySetManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().exclude(is_superuser=True)

class User(base_models.User):
    objects = UserManager()
    otakus = OtakusQuerySetManager()

    def __str__(self):
        return self.username


# on user signup send an email (if user has a valid email) welcoming the user
@receiver(post_save, sender=User)
def new_user_signed_up(sender, instance, created, **kwargs):
    if created and instance.email:        
        send_mail(
            subject=f"Welcome to RealOtakus!",
            message=f"Hi {instance.username}, We are excited to have you in our platform!\n\nYou can now start creating your own questions or participate in challenging otaku quizes!\n\n RealOtakus Team.",
            from_email=None,
            recipient_list=[instance.email],
            fail_silently=False,
        )
     

@receiver(pre_save, sender=User)
def update_user_points_and_level(sender, instance, **kwargs):
    new_level = get_user_new_level(instance)
    if new_level and new_level != instance.level:
        instance.level = new_level
        create_notification(
            receiver=instance,
            notification=f"Congratulations! level up to {new_level}"
        )


@receiver(m2m_changed, sender=User.animes_to_review.through)
def on_animes_to_review_change(sender, instance, **kwargs):
    action = kwargs.pop('action', None)

    if action == "post_remove":
        removed_animes = ", ".join([cache.get("animes")[anime_id].anime_name for anime_id in kwargs.pop('pk_set', None)])
        create_notification(
            receiver=instance,
            notification=f"Sorry you are no longer a reviewer of ( {removed_animes} ) as you didn't comply with our review guidelines"
        )

    if action == "post_add":
        for anime_id in kwargs.pop('pk_set', None):
            create_notification(
                receiver=instance,
                notification=cache.get("animes")[anime_id].anime_name,
                kind="N"
            )


class Anime(base_models.Anime):

    @property
    def total_contributions(self):
        return self.anime_questions.filter(is_contribution=True).count()

    @property
    def total_questions(self):
        return self.anime_questions.all().count()

    @property
    def active_questions(self):
        return self.anime_questions.filter(active=True).count()

    @property
    def approved_contributions(self):
        return self.anime_questions.filter(approved=True,is_contribution=True).count()

    @property
    def pending_contributions(self):
        return self.anime_questions.filter(approved__isnull=True,is_contribution=True).count()

    @property
    def rejected_contributions(self):
        return self.anime_questions.filter(approved=False,is_contribution=True).count()

    def __str__(self): return f"{self.anime_name}"

    previously_active = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.previously_active = self.active

    def save(self, *args, **kwargs):
        if self.previously_active == False and self.active == True:
            create_notification(
                notification=self.anime_name,
                broad=True,
                kind="NA"
            )
        super(Anime, self).save(*args, **kwargs)


@receiver(post_save, sender=Anime)
def chache_new_created_anime(sender, instance, created, **kwargs):
    if created:
        previous_animes=cache.get("animes")
        previous_animes[instance.id] = instance
        cache.set(
            key="animes",
            value=previous_animes,
            timeout=None
        )


@receiver(pre_delete, sender=Anime)
def delete_chached_anime(sender, instance, **kwargs):
    previous_animes=cache.get("animes")
    del previous_animes[instance.id]
    cache.set(
        key="animes",
        value=previous_animes,
        timeout=None
    )


class Question(base_models.Question):
    def __str__(self):
        if len(self.question) > 55:
            return f"{self.question[:55]}..."
        return f"{self.question}"
    
    def clean(self):
        if not self.is_contribution: return

        if self.approved == False and self.feedback == None:
            raise ValidationError("feedback needed for rejection")

        if self.approved == True and self.feedback != None:
            raise ValidationError("no feedback for approved question")


@receiver(pre_delete, sender=Question)
def protect_active_questions(sender, instance, **kwargs):
    if instance.active == True:
        raise ValidationError(
            ('active questions can not be deleted')
        )


@receiver(pre_save, sender=Question)
def post_contribution_review(sender, instance, **kwargs):
    if instance.pk == None or instance.date_reviewed or not instance.is_contribution or instance.approved == None:
        return
    contribution_got_reviewed(instance)



@receiver(post_save, sender=Question)
def post_contribution_creation(sender, instance, created, **kwargs):
    if created and instance.is_contribution:
        async_notification = threading.Thread(
            target=notify_reviewers_of_a_new_contribution,
            args=(instance.anime, instance.contributor)
        )
        async_notification.start()


class QuestionInteraction(base_models.QuestionInteraction):
    pass


class Notification(base_models.Notification):
    pass


@receiver(post_save, sender=Notification)
def post_notification_creation(sender, instance, created, **kwargs):

    if created:
        channel_layer = get_channel_layer()

    # notificaion for a specific user
        from otakus.serializers import NotificationsSerializer

        if instance.receiver:
            async_to_sync(channel_layer.group_send)(
                f'group_{instance.receiver.id}', {
                    'type': 'send_notifications',
                    'value': NotificationsSerializer(instance).data
                }
            )
    # notificaion for all users
        if instance.broad:
            async_to_sync(channel_layer.group_send)(
                f'group_all', {
                    'type': 'send_notifications',
                    'value': NotificationsSerializer(instance).data
                }
            )
