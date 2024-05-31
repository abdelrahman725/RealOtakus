from rest_framework import serializers

from core.models import Otaku
from core.models import Anime
from core.models import Question
from core.models import QuestionInteraction


class OtakuProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Otaku
        fields = (
            "username",
            "email",
            "date_joined",
            "score",
            "level",
            "tests_started",
            "tests_completed",
            "country",
        )


class LeaderBoradSerializer(serializers.ModelSerializer):
    n_contributions = serializers.IntegerField()

    class Meta:
        model = Otaku
        fields = ("id", "username", "score", "level", "n_contributions", "country")


class AnimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anime
        fields = ("id", "name")


class ContributionSerializer(serializers.ModelSerializer):
    anime = AnimeSerializer()

    class Meta:
        model = Question
        fields = (
            "anime",
            "id",
            "question",
            "choice1",
            "choice2",
            "choice3",
            "right_answer",
            "state",
            "date_created",
            "feedback",
        )


class AnswersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ("id", "right_answer")


class QuizAnimeSerializer(serializers.ModelSerializer):
    n_user_interactions = serializers.IntegerField()
    n_active_questions = serializers.IntegerField()

    class Meta:
        model = Anime
        fields = (
            "id",
            "name",
            "n_user_interactions",
            "n_active_questions",
        )


class QuestionInteractionsSerializer(serializers.ModelSerializer):
    anime = AnimeSerializer()

    class Meta:
        model = QuestionInteraction
        fields = ("anime", "correct_answer")
