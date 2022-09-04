
import threading

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


from board import base_models

from .helpers import CreateNotification
from .helpers import choices_integirty
from .helpers import question_validator
from .helpers import CheckLevel

def NotifyReviewrs(anime):
    msg = f"new question for {anime.anime_name} and needs review, check your profile"
    for reviewer in anime.reviewers.all():
        CreateNotification(
            receiver=reviewer,
            notification= msg,
            kind="R"
        )


class Anime(base_models.Anime):

    @property
    def total_questions(self):
        return self.anime_questions.all().count()

    @property
    def approved_questions(self):
        return self.anime_questions.filter(approved=True).count()

    @property
    def pending_questions(self):
        return self.anime_questions.filter(approved=False,contribution__reviewer__isnull=True).count()

    @property
    def rejected_questions(self):
        return self.anime_questions.filter(approved=False,contribution__reviewer__isnull=False).count()

    def save(self, *args, **kwargs):
        existing = self.id
            
        super(Anime, self).save(*args, **kwargs)
        
        if not existing:
            from .views import animes_dict
            animes_dict[self.id] = self

    def delete(self, *args, **kwargs):
        from .views import animes_dict
        del animes_dict[self.id]
        super(Anime, self).delete(*args, **kwargs)

    def __str__(self): return f"{self.anime_name}"


class User(base_models.User):

    def save(self, *args, **kwargs):
        
        self.level = CheckLevel(self)

        super(User, self).save(*args, **kwargs)
    
    def __str__(self):
        return self.username


class Question(base_models.Question):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.previously_approved = self.approved
    
    def clean(self, *args, **kwargs):
        if self.pk == None:
            question_validator(self.question)
            choices_integirty([self.right_answer,self.choice1,self.choice2,self.choice3])
        super(Question, self).clean(*args, **kwargs)

 
    def delete(self, *args, **kwargs):
        if self.active == True:
            raise ValidationError(
                 _('production questions can not be deleted')
            )
        try:
            if self.contribution:
                CreateNotification(
                    receiver=self.contribution.contributor,
                    notification="question got delted as it didn't align with RealOtakus Guidlines",
                    kind="D"
                )
        except Contribution.DoesNotExist:
            pass
        super(Question, self).delete(*args, **kwargs)
        
 
    def __str__(self):
        if len(self.question) > 55:
            return f"{self.question[:55]}..."
        return f"{self.question}"


class Contribution(base_models.Contribution):

    def save(self, *args, **kwargs):

        if self.pk == None and self.contributor != self.reviewer:
            async_notification = threading.Thread(
                target=NotifyReviewrs,
                args=(self.question.anime,)
            )
            async_notification.start()
       
        super(Contribution, self).save(*args, **kwargs)
    
    @property
    def date_created(self):
        return self.question.date_created


    def __str__(self) -> str:
        return f"{self.contributor} contributed a new question for {self.question.anime}"


class Game(base_models.Game):
    def __str__(self):
        return f"{self.game_owner} has {self.gamesnumber} quiz for {self.anime}"


class Notification(base_models.Notification):
    def __str__(self):
        return f"{self.notification}"

    def save(self, *args, **kwargs):
        super(Notification, self).save(*args, **kwargs)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notifications_group_{self.owner.id}', {
                'type': 'send_notifications',
                'value': self
            }
        )
