
import threading

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from django.db import IntegrityError
from django.core.exceptions import ValidationError 
from django.db.models.signals import pre_delete, post_delete, pre_save, post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _

from board import base_models

from board.helpers import choices_integirty
from board.helpers import question_validator
from board.helpers import CheckLevel
from board.helpers import notify_reviewers
from board.helpers import announce_new_active_anime
from board.helpers import deactivate_anime
from board.helpers import notify_user_of_contribution_state


class User(base_models.User):

    def save(self, *args, **kwargs):      
        self.level = CheckLevel(self)
        super(User, self).save(*args, **kwargs)
    
    def __str__(self):
        return self.username


class Anime(base_models.Anime):
    
    @property
    def total_interactions(self):
        return self.anime_interactions.all().count()        

    @property
    def total_questions(self):
        return self.anime_questions.all().count()

    @property
    def active_questions(self):
        return self.anime_questions.filter(active=True).count()

    @property
    def pending_questions(self):
        return self.anime_questions.filter(contribution__approved__isnull=True).count()

    @property
    def rejected_questions(self):
        return self.anime_questions.filter(contribution__approved=False).count()

    def save(self, *args, **kwargs):
        existing = self.id
        super(Anime, self).save(*args, **kwargs)
        if not existing:
            from board.views import animes_dict
            animes_dict[self.id] = self

    def __str__(self): return f"{self.anime_name}"


@receiver(pre_delete, sender=Anime)
def deleted_chached_anime(sender, instance, **kwargs):
    from board.views import animes_dict
    if animes_dict:
        del animes_dict[instance.id]


class Question(base_models.Question):
    
    def clean(self, *args, **kwargs):
        #if self.pk == None:
            #question_validator(self.question)
            #choices_integirty([self.right_answer,self.choice1,self.choice2,self.choice3])
        super(Question, self).clean(*args, **kwargs)
        
 
    def __str__(self):
        if len(self.question) > 55:
            return f"{self.question[:55]}..."
        return f"{self.question}"


@receiver(pre_delete, sender=Question)
def protect_active_questions(sender, instance, **kwargs):

    if instance.active == True:
        raise ValidationError(
                _('production questions can not be deleted')
        )


# automatically or manually actiavte an anime ? 
@receiver(post_save, sender=Question)
def after_question_is_saved(sender, instance, **kwargs):
    if instance.active and instance.anime.active == False :
        async_anime_announcment = threading.Thread(
                target=announce_new_active_anime,
                args=(instance,)
            )
        async_anime_announcment.start()


# @receiver(post_delete, sender = Question)
# def post_question_deletion(sender, instance, **kwargs):
#     if instance.anime.active == True:
#         check_anime_active_state = threading.Thread(
#                 target=deactivate_anime,
#                 args=(instance.anime,)
#             )
#         check_anime_active_state.start()


class Contribution(base_models.Contribution):
    
    @property
    def date_created(self):
        return self.question.date_created


@receiver(pre_save, sender=Contribution)
def contribution_reviewed(sender, instance, **kwargs):
    if instance.pk != None and instance.approved != None and instance.date_reviewed == None:   
        notify_user_of_contribution_state(instance)
        
    if instance.pk !=None and instance.approved==None:
        raise IntegrityError(
            "approved = None, reviewed questions can't return back to be unreviewed"
        )
        

@receiver(post_save, sender=Contribution)
def post_contribution_creation(sender, instance, created, **kwargs):
    if created and instance.contributor != instance.reviewer:

        async_notification = threading.Thread(
            target=notify_reviewers,
            args=(instance.question.anime,)
        )
        async_notification.start()
  

class QuestionInteraction(base_models.QuestionInteraction):

    def __str__(self) -> str:
        return f" {self.user} interacted with a question on {self.question.anime.anime_name}"


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

    def __str__(self):
        return f"{self.notification}"
