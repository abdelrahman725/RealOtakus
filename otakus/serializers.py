from otakus.models import User
from otakus.models import Anime
from otakus.models import Contribution
from otakus.models import Question
from otakus.models import QuestionInteraction
from otakus.models import Notification

from rest_framework import serializers


class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'points',
            'level',
            'tests_started',
            'tests_completed',
            'country'
        )


class LeaderBoradSerializer(serializers.ModelSerializer):
    n_contributions = serializers.IntegerField()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'points',
            'level',
            'n_contributions',
            'country'
        )


class AnimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anime
        fields = (
            "id",
            "anime_name"
        )


class AnimeReviewedContributionsSerializer(serializers.ModelSerializer):
    reviewed_contributions = serializers.IntegerField()

    class Meta:
        model = Anime
        fields = (
            "id",
            "anime_name",
            "reviewed_contributions"
        )


class QuestionSerializer(serializers.ModelSerializer):
    anime = AnimeSerializer()

    class Meta:
        model = Question
        fields = (
            "anime",
            "question",
            "choice1",
            "choice2",
            "choice3",
            "right_answer",
            "id",
        )


class ContributionSerializer(serializers.ModelSerializer):
    question = QuestionSerializer()

    class Meta:
        model = Contribution
        fields = (
            "id",
            "approved",
            "date_created",
            "feedback",
            "question"
        )


class AnswersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = (
            "id",
            "right_answer"
        )


class AnimeInteractionsSerializer(serializers.ModelSerializer):
    n_user_interactions = serializers.IntegerField()
    n_active_questions = serializers.IntegerField()

    class Meta:
        model = Anime
        fields = (
            "id",
            "anime_name",
            "n_user_interactions",
            "n_active_questions",
        )


class QuestionInteractionsSerializer(serializers.ModelSerializer):
    anime = AnimeSerializer()

    class Meta:
        model = QuestionInteraction
        fields = (
            "anime",
            "correct_answer"
        )


class NotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = (
            "id",
            "notification",
            "kind",
            "time",
            "seen",
            "broad"
        )
