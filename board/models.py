from board import base_models

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .helpers import CreateNotification, CheckLevel
from .constants import LEVELS
import threading


def NotifyReviewrs(anime):
    msg = f"new question for {anime.anime_name} and needs review, check your profile"
    for reviewer in anime.reviewers.all():
        CreateNotification(reviewer, msg)


def NewApprovedQuestion(excluded_user, anime, questions_count):
    questions_count += 1
    if questions_count % 5 == 0:

        excludes = [excluded_user.pk, 1]
        users = User.objects.exclude(pk__in=excludes)
        for user in users:
            user_anime_game = Game.objects.filter(game_owner=user, anime=anime)
            if user_anime_game.exists():
                if questions_count == (user_anime_game[0].gamesnumber*5)+5:
                    CreateNotification(user, f"new quiz available for {anime}")


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
    to do : prevent question from getting deleted whether by 
    
    DONE :
    1. Calling delete() on Model instance: question.delete()

    or

    NOT DONE yet :
    2. Calling delete() on QuerySet instance: question.objects.all().delete() 

    if this question's contributor is admin and it's approved (default)
    
    """

    previous_status = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.previous_status = self.approved

    def save(self, *args, **kwargs):
 
        user = self.contributor
        new_approved_question = False
        previous_count = 0

        if user and not self.contributor.is_superuser:
         # check if it wasn't approved (which is the default) and now it's approved
            if self.previous_status == False and self.approved == True:
                new_approved_question = True

                # then it's his first approved contribution
                if user.contributions_count == 0 and user.contributor == False:
                    user.contributor = True
                    msg = f"congratulations your question for {self.anime} ({self.question[:30]}) got  approved,you are an official Otaku contributor now !"
                    CreateNotification(user, msg)

                # subsequent approved contributions
                else:
                    msg = f"congratulations your question for {self.anime} ({self.question[:30]}) got  approved, another contribution added to your profile"
                    CreateNotification(user, msg)

                CurrentGame, created = Game.objects.get_or_create(
                    game_owner=user, anime=self.anime)
                CurrentGame.contributions += 1

            # if the number of approved contributions for that particular user in that specific anime reaches 5 contributions
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

        if self.pk == None:
            if self.approved == True:
                new_approved_question = True
            else:
                async_notification = threading.Thread(
                    target=NotifyReviewrs, args=(self.anime,))
                async_notification.start()

        if new_approved_question:
            previous_count = self.anime.anime_questions.filter(
                approved=True).exclude(contributor=user).count()

        super(Question, self).save(*args, **kwargs)

        if new_approved_question:
            async_thread = threading.Thread(target=NewApprovedQuestion, args=(
                self.contributor, self.anime, previous_count))
            async_thread.start()



    def delete(self, *args, **kwargs):
        if self.contributor.is_superuser and self.approved==True:
            print("\n this question can't be deleted \n")        
            return
        if self.contributor and not self.contributor.is_superuser:
            if not self.approved:
                msg = f"sorry your last question on {self.anime} has been declined as it didn't meet the required criteria"
                CreateNotification(self.contributor, msg)

        super(Question, self).delete(*args, **kwargs)

    def __str__(self):
        if len(self.question) > 50:
            return f"{self.question[:50]}"
        return f"{self.question}"


class Game(base_models.Game):
    def __str__(self):
        return f"{self.game_owner} had {self.gamesnumber} games for {self.anime}"


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
