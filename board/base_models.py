from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

from board.constants import *


class Anime(models.Model):
    anime_name = models.CharField(max_length=50, unique=True)
    active = models.BooleanField(default=False)
    url = models.CharField(max_length=300, default="/", blank=True)
    #url= models.URLField()

    class Meta:
        abstract = True


class User(AbstractUser):
    country = models.CharField(max_length=10, blank=True, null=True)
    points = models.PositiveIntegerField(default=0)
    tests_completed = models.PositiveIntegerField(default=0)
    tests_started = models.PositiveIntegerField(default=0)
    animes_to_review = models.ManyToManyField(Anime, related_name="reviewers", blank=True)

    level = models.CharField(
        choices=LEVELS_CHOICES,
        max_length=MAX_LEVEL_LENGTH,
        default=LEVELS_CHOICES[0][0]
    )

    class Meta:
        ordering = ["-points"]
        abstract = True


class Question(models.Model):
    anime = models.ForeignKey(Anime, on_delete=models.PROTECT, related_name="anime_questions")
    
    question = models.TextField(max_length=350)
    right_answer = models.CharField(max_length=150)
    choice1 = models.CharField(max_length=150)
    choice2 = models.CharField(max_length=150)
    choice3 = models.CharField(max_length=150)
    
    active = models.BooleanField(default=False)

    correct_answers = models.PositiveIntegerField(default=0)
    wrong_answers = models.PositiveIntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['anime', 'question'], name='unique question for each anime')
            ]
        ordering = ["-id"]
        abstract = True


class Contribution(models.Model):
    question = models.OneToOneField(Question, on_delete=models.SET_NULL,null=True, related_name="contribution")
    contributor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,related_name="contributions")
    approved = models.BooleanField(null=True, default=None)
    reviewer =  models.ForeignKey(User, on_delete=models.SET_NULL, null=True,blank=True, related_name="contributions_reviewed")    
    reviewer_feedback = models.CharField(max_length=100,null=True, blank=True)
    date_created = models.DateTimeField(default=timezone.now)
    date_reviewed = models.DateTimeField(null=True,blank=True) 
    
    class Meta:
        abstract = True


class QuestionInteraction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="questions_interacted_with")
    question = models.ForeignKey(Question,on_delete=models.CASCADE, related_name="question_interactions")
    anime = models.ForeignKey(Anime,on_delete=models.PROTECT,related_name="anime_interactions")

    # None means no answer (always the case initially when recording the interaction)
    # but when calculating score we will count not answering as wrong
    correct_answer = models.BooleanField(null=True, default=None)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'question'], name='user interacts with each question just once')
            ]
        abstract = True


class Notification(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="getnotifications")
    notification = models.CharField(max_length=250)
    time = models.DateTimeField(default=timezone.now)
    seen = models.BooleanField(default=False)

    kind = models.CharField(
        choices=(
            ("N","new anime"),
            ("R","review needed"),
            ("A","question approved"),
            ("F","question rejected"),
        ),
        max_length=1,
        null=True,
        blank=True
    )
    
    class Meta:
        ordering = ["-id"]
        abstract = True
