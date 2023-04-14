from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

from otakus.constants import COUNTRY_CHOICES
from otakus.constants import LEVEL_CHOICES
from otakus.constants import BEGINNER


class Anime(models.Model):
    anime_name = models.CharField(max_length=50, unique=True)
    active = models.BooleanField(default=False)

    class Meta:
        abstract = True


class User(AbstractUser):
    points = models.PositiveIntegerField(default=0)
    tests_started = models.PositiveSmallIntegerField(default=0)
    tests_completed = models.PositiveSmallIntegerField(default=0)
    animes_to_review = models.ManyToManyField(Anime, related_name="reviewers", blank=True)

    country = models.CharField(
        choices=COUNTRY_CHOICES,
        max_length=10,
        blank=True,
        null=True
    )

    level = models.CharField(
        choices=LEVEL_CHOICES,
        max_length=15,
        default=BEGINNER
    )

    class Meta:
        abstract = True


class Question(models.Model):
    anime = models.ForeignKey(Anime, on_delete=models.PROTECT, related_name="anime_questions")
    question = models.TextField(max_length=350)
    choice1 = models.TextField(max_length=150)
    choice2 = models.TextField(max_length=150)
    choice3 = models.TextField(max_length=150)
    right_answer = models.TextField(max_length=150)
    active = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['anime', 'question'], name='unique question for each anime')
        ]
        ordering = ["-id"]
        abstract = True


class Contribution(models.Model):
    question = models.OneToOneField(Question, on_delete=models.SET_NULL,null=True, related_name="contribution")
    contributor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="contributions")
    approved = models.BooleanField(null=True, default=None)
    reviewer =  models.ForeignKey(User, on_delete=models.SET_NULL, null=True,blank=True, related_name="contributions_reviewed")    
    date_created = models.DateTimeField(default=timezone.now)
    date_reviewed = models.DateTimeField(null=True,blank=True) 
    
    feedback = models.CharField(
        choices=(
            ("irr","not relevant"),
            ("dup","duplicate"),
            ("eas","too easy"),
            ("bad","bad choices"),
            ("inv","invalid/wrong information")
        ),
        max_length=5,
        null=True,
        blank=True
    )
    
    class Meta:
        abstract = True


class QuestionInteraction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="questions_interacted_with")
    question = models.ForeignKey(Question,on_delete=models.CASCADE, related_name="question_interactions")
    anime = models.ForeignKey(Anime,on_delete=models.PROTECT,related_name="anime_interactions")
    # None means no answer (always the case initially when recording the interaction)
    # but when calculating score None should be treated as wrong answer
    correct_answer = models.BooleanField(null=True, default=None)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'question'], name='user interacts with each question just once')
        ]
        abstract = True


class Notification(models.Model):
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="notifications")
    notification = models.CharField(max_length=250)
    time = models.DateTimeField(default=timezone.now)
    seen = models.BooleanField(default=False)
    broad = models.BooleanField(default=False)
    kind = models.CharField(
        choices=(
            ("NA","new available anime in quizes"),
            ("N","new anime to review"),
            ("R","review needed"),
            ("A","question approved"),
            ("F","question rejected")
        ),
        max_length=2,
        null=True,
        blank=True
    )
    
    class Meta:
        ordering = ["-id"]
        abstract = True
