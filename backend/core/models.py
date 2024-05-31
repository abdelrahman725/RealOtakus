from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

from accounts.models import UserAccount
from core.constants import COUNTRY_CHOICES, LEVEL_CHOICES, BEGINNER, QUESTIONS_STATES


class Anime(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self) -> str:
        return self.name


class Otaku(UserAccount):
    score = models.PositiveIntegerField(default=0)
    tests_started = models.PositiveSmallIntegerField(default=0)
    tests_completed = models.PositiveSmallIntegerField(default=0)
    animes_to_review = models.ManyToManyField(
        Anime, related_name="reviewers", blank=True
    )

    country = models.CharField(
        choices=COUNTRY_CHOICES, max_length=10, blank=True, null=True
    )

    level = models.CharField(choices=LEVEL_CHOICES, max_length=15, default=BEGINNER)

    def __str__(self) -> str:
        return self.username


class Question(models.Model):
    anime = models.ForeignKey(
        Anime, on_delete=models.PROTECT, related_name="anime_questions"
    )
    contributor = models.ForeignKey(
        Otaku,
        on_delete=models.SET_NULL,
        null=True,
        related_name="contributions",
    )

    question = models.CharField(max_length=350)
    choice1 = models.CharField(max_length=200)
    choice2 = models.CharField(max_length=200)
    choice3 = models.CharField(max_length=200)
    right_answer = models.CharField(max_length=200)

    state = models.CharField(choices=QUESTIONS_STATES, max_length=20, default="pending")
    reviewer = models.ForeignKey(
        Otaku,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="contributions_reviewed",
    )
    date_created = models.DateTimeField(default=timezone.now)
    date_reviewed = models.DateTimeField(null=True, blank=True)
    is_contribution = models.BooleanField(default=False)

    feedback = models.CharField(
        choices=(
            ("irr", "not relevant"),
            ("eas", "too easy"),
            ("bad", "bad choices"),
            ("inv", "invalid/wrong information"),
        ),
        max_length=5,
        null=True,
        blank=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["anime", "question"], name="unique question for each anime"
            ),
        ]
        ordering = ["-id"]

    def __str__(self):
        if len(self.question) > 55:
            return f"{self.question[:55]}..."
        return self.question

    def clean(self):
        if not self.is_contribution:
            return

        if self.state == "rejected" and self.feedback == None:
            raise ValidationError("feedback needed for rejection")

        if self.state == "approved" and self.feedback != None:
            raise ValidationError("no feedback for approved question")


class QuestionInteraction(models.Model):
    user = models.ForeignKey(
        Otaku, on_delete=models.CASCADE, related_name="questions_interacted_with"
    )

    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="question_interactions"
    )

    anime = models.ForeignKey(
        Anime, on_delete=models.PROTECT, related_name="anime_interactions"
    )
    # None means no answer (always the case initially when recording the interaction)
    # but when calculating score None should be treated as wrong answer
    correct_answer = models.BooleanField(null=True, default=None)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "question"],
                name="user interacts with each question just once",
            )
        ]
