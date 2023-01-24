import threading

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.db.models.signals import pre_delete, pre_save, post_save, m2m_changed
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _

from board import base_models

from board.helpers import CreateNotification
from board.helpers import get_user_new_level
from board.helpers import notify_reviewers_of_a_new_contribution
from board.helpers import notify_users_of_a_new_anime
from board.helpers import contribution_reviewed


class User(base_models.User):
    def __str__(self):
        return self.username


# on user signup send an email (if user has a valid email) welcoming the user
@receiver(post_save, sender=User)
def new_user_signed_up(sender, instance, created, **kwargs):
    if created and instance.email:
        send_mail(
            subject=f"{instance.username}, Welcome to RealOtakus!",
            message="message to send here",
            from_email=None,
            recipient_list=[instance.email],
            fail_silently=False,
        )


@receiver(pre_save, sender=User)
def update_user_points_and_level(sender, instance, **kwargs):
    new_level = get_user_new_level(instance)
    if new_level and new_level != instance.level:
        instance.level = new_level
        CreateNotification(
            receiver=instance,
            notification=f"Congratulations! level up to {new_level}"
        )


@receiver(m2m_changed, sender=User.animes_to_review.through)
def on_animes_to_review_change(sender, instance, **kwargs):
    from board.views import get_or_query_anime
    action = kwargs.pop('action', None)

    if action == "post_remove":
        removed_animes = ", ".join([get_or_query_anime(anime_id).anime_name for anime_id in kwargs.pop('pk_set', None)])
        CreateNotification(
            receiver=instance,
            notification=f"Sorry you are no longer a reviewer of ({removed_animes}) as you didn't comply with our review guidelines"
        )

    if action == "post_add":
        for anime_id in kwargs.pop('pk_set', None):
            CreateNotification(
                receiver=instance,
                notification=get_or_query_anime(anime_id).anime_name,
                kind="N"
            )


class Anime(base_models.Anime):

    @property
    def total_contributions(self):
        return self.anime_questions.filter(contribution__isnull=False).count()

    @property
    def total_questions(self):
        return self.anime_questions.all().count()

    @property
    def active_questions(self):
        return self.anime_questions.filter(active=True).count()

    @property
    def approved_contributions(self):
        return self.anime_questions.filter(contribution__isnull=False, contribution__approved=True).count()

    @property
    def pending_contributions(self):
        return self.anime_questions.filter(contribution__isnull=False, contribution__approved__isnull=True).count()

    @property
    def rejected_contributions(self):
        return self.anime_questions.filter(contribution__isnull=False, contribution__approved=False).count()

    def __str__(self): return f"{self.anime_name}"

    previously_active = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.previously_active = self.active

    def save(self, *args, **kwargs):
        if self.active == True and self.previously_active == False:
            async_notification = threading.Thread(
                target=notify_users_of_a_new_anime,
                args=(self.anime_name,)
            )
            async_notification.start()
        super(Anime, self).save(*args, **kwargs)


@receiver(post_save, sender=Anime)
def chache_new_created_anime(sender, instance, created, **kwargs):
    if created:
        from board.views import animes_dict
        animes_dict[instance.id] = instance


@receiver(pre_delete, sender=Anime)
def delete_chached_anime(sender, instance, **kwargs):
    from board.views import animes_dict
    try:
        del animes_dict[instance.id]
    except KeyError:
        pass


class Question(base_models.Question):
    def __str__(self):
        if len(self.question) > 55:
            return f"{self.question[:55]}..."
        return f"{self.question}"


@receiver(pre_delete, sender=Question)
def protect_active_questions(sender, instance, **kwargs):
    if instance.active == True:
        raise ValidationError(
            _('active questions can not be deleted')
        )


class Contribution(base_models.Contribution):
    def __str__(self) -> str:
        return f"{self.contributor if self.contributor else 'deleted user'} made a contribution for {self.question.anime if self.question else 'a deleted question'}"


@receiver(pre_save, sender=Contribution)
def pre_contribution_review(sender, instance, **kwargs):
    if instance.pk != None:

        if instance.approved == None:
            raise IntegrityError(
                "approved = None, reviewed questions can't return back to be unreviewed"
            )

        if  instance.approved != None:
            contribution_reviewed(instance)



@receiver(post_save, sender=Contribution)
def post_contribution_creation(sender, instance, created, **kwargs):
    if created:
        async_notification = threading.Thread(
            target=notify_reviewers_of_a_new_contribution,
            args=(instance.question.anime, instance.contributor)
        )
        async_notification.start()


class QuestionInteraction(base_models.QuestionInteraction):
    pass


class Notification(base_models.Notification):
    def save(self, *args, **kwargs):
        super(Notification, self).save(*args, **kwargs)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notifications_group_{self.owner.id}', {
                'type': 'send_notifications',
                'value': self
            }
        )

    def __str__(self): return f"{self.kind} {self.notification}"
