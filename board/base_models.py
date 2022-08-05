from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from .constants import *

class Anime(models.Model):
    anime_name = models.CharField(max_length=50, unique=True)
    url = models.CharField(max_length=300, default="/", blank=True)

    class Meta:
        abstract = True


class User(AbstractUser):
    country = models.CharField(max_length=10, blank=True,null=True)
    points = models.IntegerField(default=0)
    tests_completed = models.PositiveIntegerField(default=0)
    tests_started = models.PositiveIntegerField(default=0)
    contributor = models.BooleanField(default=False)
    contributions_count = models.PositiveIntegerField(default=0)
    animes_to_review = models.ManyToManyField(Anime, related_name="reviewers", blank=True)

    level = models.CharField(
        choices=LEVELS_CHOICES,
        max_length=MAX_LEVEL_LENGTH,
        default=LEVELS_CHOICES[0][0])

    class Meta:
        ordering = ["-points"]
        abstract = True


class Question(models.Model):
    anime = models.ForeignKey(Anime, on_delete=models.PROTECT, related_name="anime_questions")
    contributor = models.ForeignKey(User, on_delete=models.SET_NULL,related_name="contributions", null=True, blank=True, default=1)

    question = models.TextField(max_length=350)
    right_answer = models.CharField(max_length=150)
    
    choice1 = models.CharField(max_length=150)
    choice2 = models.CharField(max_length=150)
    choice3 = models.CharField(max_length=150)

    approved = models.BooleanField(default=True)

    correct_answers = models.PositiveIntegerField(default=0)
    wrong_answers = models.PositiveIntegerField(default=0)
    advanced = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['anime', 'question'], name='unique question for each anime'),
            ]
        ordering = ["-id"]
        abstract = True


class Game(models.Model):
    game_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="get_games")
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE, related_name="anime_games")
    score = models.PositiveIntegerField(default=0)
    gamesnumber = models.PositiveIntegerField(default=0)
    contributions = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-id"]
        abstract = True


class Notification(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="getnotifications")
    notification = models.CharField(max_length=250)
    time = models.DateTimeField(default=timezone.now)
    seen = models.BooleanField(default=False)

    class Meta:
        abstract = True
