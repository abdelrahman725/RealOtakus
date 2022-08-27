import threading
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from board import base_models

from .helpers import CreateNotification, CheckLevel,question_validator,choices_integirty


def NotifyReviewrs(anime,contributor):
    msg = f"new question for {anime.anime_name} and needs review, check your profile"
    for reviewer in anime.reviewers.all():
        if reviewer != contributor:
            CreateNotification(reviewer, msg)

class Anime(base_models.Anime):

    @property
    def approved_questions(self):
        return self.anime_questions.filter(approved=True).count()

    @property
    def pending_questions(self):
        return self.anime_questions.filter(approved=False).count()

    @property
    def total_questions(self):
        return self.anime_questions.all().count()

    def save(self, *args, **kwargs):
        new = False
        if not self.id:
            new = True
        super(Anime, self).save(*args, **kwargs)
        if new:
            from .views import animes_dict
            animes_dict[self.id] = self

    def delete(self, *args, **kwargs):
        from .views import animes_dict
        del animes_dict[self.id]
        super(Anime, self).delete(*args, **kwargs)

    def __str__(self): return f"{self.anime_name}"


class User(base_models.User):
    def __str__(self):
        return self.username


class Question(base_models.Question):
    """
    NOT DONE yet :
    2. Calling delete() on QuerySet instance: question.objects.all().delete() 

    if this question's contributor is admin and it's approved (default)
    """

    def clean(self, *args, **kwargs):
        question_validator(self.question)
        choices_integirty([self.right_answer,self.choice1,self.choice2,self.choice3])
        super(Question, self).clean(*args, **kwargs)

    previous_status = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.previous_status = self.approved


    def save(self, *args, **kwargs):
   
        self.clean()
 
        user = self.contributor
 
        if user and not user.is_superuser:
         # check if it wasn't approved (which is the default) and now it's approved
            if self.previous_status == False and self.approved == True:

                msg = f"congratulations your question for {self.anime} ({self.question[:30]}) got approved, another contribution added to your profile"
                CreateNotification(user, msg)
                
                # check if it's his first approved contribution
                if user.contributor == False:
                    user.contributor = True
                    msg = f"you are now a contributor!"
                    CreateNotification(user, msg)

                CurrentGame, created = Game.objects.get_or_create(
                    game_owner=user, anime=self.anime)
                CurrentGame.contributions += 1

            # if the number of approved user contributions for that specific anime reaches 5 contributions
            # then the user is qualified to be a reviewer for that anime
                if CurrentGame.contributions == 5:
                    if self.anime not in user.animes_to_review.all():
                        user.animes_to_review.add(self.anime)
                        CreateNotification(
                            user, f"now you can review {self.anime} questions!")

                CurrentGame.save()
                user.contributions_count += 1
                user.points += 10
                CheckLevel(user)
                user.save()

            if self.pk == None and self.approved== False :
                async_notification = threading.Thread(
                    target=NotifyReviewrs,
                    args=(self.anime,user)
                )
                async_notification.start()
 
        super(Question, self).save(*args, **kwargs)
 
    def delete(self, *args, **kwargs):
        if self.contributor:
            if self.contributor.is_superuser and self.approved==True:
                print("\n approved questions created by superuser can't be deleted \n")        
                return
        super(Question, self).delete(*args, **kwargs)

    def __str__(self):
        if len(self.question) > 55:
            return f"{self.question[:55]}..."
        return f"{self.question}"


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
            })
