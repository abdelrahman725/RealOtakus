import random

from django.db import IntegrityError
from django.db.models import Count, Avg, Q
from django.core.exceptions import ValidationError
from django.core.cache import cache
from django.views.decorators.cache import cache_page
from django.conf import settings

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes, throttle_classes

from core.models import Otaku
from core.models import Anime
from core.models import Question
from core.models import QuestionInteraction

from core.serializers import OtakuSerializer
from core.serializers import AnimeSerializer
from core.serializers import LeaderBoradSerializer
from core.serializers import ContributionSerializer
from core.serializers import AnswersSerializer
from core.serializers import QuizAnimeSerializer
from core.serializers import QuestionInteractionsSerializer

from core.throttles import ContributionRateThrottle
from core.helpers import query_or_get_cached_anime
from core.constants import (
    N_QUIZ_QUESTIONS,
    MAX_QUIZ_TIME,
)

from notifications.helpers import create_notification


@cache_page(settings.LEADERBOARD_CACHE_TIME)
@api_view(["GET"])
@permission_classes([AllowAny])
def get_leaderboard(request):
    # Calculate the average score for all existing users.
    avg_score = Otaku.objects.filter(points__gt=0).aggregate(Avg("points"))[
        "points__avg"
    ]

    # Get the top users (limited to 30 users) who have a score greater than the average score.
    top_users = (
        (
            Otaku.objects.select_related("user")
            .annotate(
                n_contributions=Count(
                    "contributions", filter=(Q(contributions__approved=True))
                )
            )
            .filter(points__gt=avg_score)
            .order_by("-points")[:30]
        )
        if avg_score
        else []
    )

    leaderboard = LeaderBoradSerializer(top_users, many=True).data

    return Response(leaderboard)


@api_view(["GET"])
def get_all_animes(request):
    cached_or_quered_animes = cache.get("animes")

    if cached_or_quered_animes == None:
        cached_or_quered_animes = Anime.objects.all()
        cache.set(
            key="animes",
            value={anime.id: anime for anime in cached_or_quered_animes},
            timeout=None,
        )

    else:
        cached_or_quered_animes = cached_or_quered_animes.values()

    all_animes = AnimeSerializer(cached_or_quered_animes, many=True).data

    response = Response(all_animes)
    response["Cache-Control"] = "max-age=%d" % settings.ANIMES_BROWSER_CACHE_TIME

    return response


@api_view(["GET"])
def get_profile(request):
    user = request.user.otaku

    user_interactions = QuestionInteractionsSerializer(
        user.questions_interacted_with.select_related("anime"), many=True
    ).data

    user_profile = OtakuSerializer(
        Otaku.objects.select_related("user").get(id=user.id)
    ).data

    return Response({"interactions": user_interactions, "profile": user_profile})


@api_view(["GET"])
def get_contributions(request):
    user = request.user.otaku

    contributions = ContributionSerializer(
        user.contributions.filter(is_contribution=True)
        .select_related("anime")
        .order_by("-id"),
        many=True,
    ).data

    return Response(contributions)


@api_view(["POST"])
@throttle_classes([ContributionRateThrottle])
def contribute_question(request):
    user = request.user.otaku
    contribution_data = request.data["question"]
    contribution_anime = query_or_get_cached_anime(anime_id=request.data["anime"])

    if contribution_anime == None:
        return Response(status=status.HTTP_410_GONE)

    try:
        new_contribution = Question(
            anime=contribution_anime,
            contributor=user,
            is_contribution=True,
            question=contribution_data["question"],
            right_answer=contribution_data["rightanswer"],
            choice1=contribution_data["choice1"],
            choice2=contribution_data["choice2"],
            choice3=contribution_data["choice3"],
        )
        new_contribution.save()
        new_contribution.clean_fields()

    except IntegrityError:
        return Response(status=status.HTTP_409_CONFLICT)

    except ValidationError:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_201_CREATED)


@api_view(["PUT"])
def review_contribution(request):
    user = request.user.otaku

    try:
        existing_contribution = Question.objects.get(pk=request.data["contribution"])

        try:
            user.animes_to_review.get(id=existing_contribution.anime.id)

        except Anime.DoesNotExist:
            return Response(status=status.HTTP_403_FORBIDDEN)

        if existing_contribution.approved != None:
            return Response(status=status.HTTP_409_CONFLICT)

        review_decision = request.data["state"]
        existing_contribution.reviewer = user
        existing_contribution.feedback = request.data["feedback"]

        # approved
        if review_decision == 1:
            existing_contribution.approved = True
            existing_contribution.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        # rejected
        if review_decision == 0:
            existing_contribution.approved = False
            existing_contribution.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    except Question.DoesNotExist:
        return Response(
            status=status.HTTP_410_GONE,
        )


@api_view(["GET"])
def get_contributions_for_review(request):
    user = request.user.otaku

    animes_to_review = user.animes_to_review.all()

    if request.GET.get("inquiry", False):
        return Response(animes_to_review.exists())

    if not animes_to_review.exists():
        return Response(status=status.HTTP_403_FORBIDDEN)

    animes = AnimeSerializer(animes_to_review, many=True)

    pending_or_reviewd_contributions = ContributionSerializer(
        Question.objects.filter(
            ~Q(contributor=user),
            Q(reviewer=user) | Q(approved=None),
            is_contribution=True,
            anime__in=animes_to_review,
        )
        .select_related("anime")
        .order_by("-id"),
        many=True,
    )

    return Response(
        {"contributions": pending_or_reviewd_contributions.data, "animes": animes.data}
    )


@api_view(["POST"])
def save_country(request):
    user = request.user.otaku
    user.country = request.data["country"]
    user.save()
    return Response(status=status.HTTP_201_CREATED)


# The following 4 API endpoints are Quiz related, called by a single user in order from top to bottom
@api_view(["GET"])
def get_quiz_animes(request):
    user = request.user.otaku

    quiz_animes = QuizAnimeSerializer(
        Anime.objects.all()
        .annotate(
            n_user_interactions=Count(
                "anime_interactions",
                filter=(Q(anime_interactions__user=user)),
                distinct=True,
            )
        )
        .annotate(
            n_active_questions=Count(
                "anime_questions",
                filter=(
                    Q(anime_questions__active=True)
                    & ~Q(anime_questions__contributor=user)
                    & ~Q(anime_questions__reviewer=user)
                ),
                distinct=True,
            )
        ),
        many=True,
    )

    return Response(quiz_animes.data)


@api_view(["GET"])
def get_quiz(request, anime):
    user = request.user.otaku
    quiz_anime = query_or_get_cached_anime(anime_id=anime)

    if quiz_anime == None:
        return Response(status=status.HTTP_410_GONE)

    # current quiz questions for current user
    questions = quiz_anime.anime_questions.filter(
        (~Q(contributor=user) & ~Q(reviewer=user)), active=True
    ).exclude(
        pk__in=user.questions_interacted_with.values_list("question__pk", flat=True)
    )[
        :N_QUIZ_QUESTIONS
    ]

    if questions.count() != N_QUIZ_QUESTIONS:
        # just in case cache wasn't deleted from the previous quiz
        cache.delete(f"quiz_{user.id}")
        cache.delete(f"interactions_{user.id}")
        return Response(status=status.HTTP_404_NOT_FOUND)

    serialized_questions = []

    for question in questions:
        question_choices = [
            question.choice1,
            question.choice2,
            question.choice3,
            question.right_answer,
        ]

        random.shuffle(question_choices)

        serialized_questions.append(
            {
                "id": question.id,
                "question": question.question,
                "choice1": question_choices[0],
                "choice2": question_choices[1],
                "choice3": question_choices[2],
                "choice4": question_choices[3],
            }
        )

    cache.set(
        key=f"quiz_{user.id}",
        value={question.id: question for question in questions},
        timeout=MAX_QUIZ_TIME + 10,
    )

    cache.set(key=f"interactions_{user.id}", value={}, timeout=MAX_QUIZ_TIME + 10)

    user.tests_started += 1
    user.save()

    return Response({"questions": serialized_questions})


@api_view(["POST"])
def record_question_interaction(request):
    user = request.user.otaku
    question_id = request.data["question"]

    try:
        interaction = QuestionInteraction.objects.create(
            user=user,
            question_id=question_id,
            anime=cache.get(f"quiz_{user.id}")[question_id].anime,
        )

        previous_interactions = cache.get(f"interactions_{user.id}")
        previous_interactions[question_id] = interaction

        cache.set(
            key=f"interactions_{user.id}",
            value=previous_interactions,
            timeout=MAX_QUIZ_TIME + 10,
        )

    except IntegrityError:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_201_CREATED)


@api_view(["POST"])
def submit_quiz(request):
    user = request.user.otaku
    user_answers = request.data["answers"]

    quiz_interactions = cache.get(f"interactions_{user.id}")
    quiz_questions = cache.get(f"quiz_{user.id}")

    for question_id in quiz_questions:
        current_qustion = quiz_questions[question_id]
        user_answered_correctly = None

        str_question_id = str(question_id)
        if str_question_id in user_answers:
            user_answered_correctly = (
                user_answers[str_question_id] == current_qustion.right_answer
            )
            if user_answered_correctly == True:
                user.points += 1

        try:
            question_interaction = quiz_interactions[question_id]
            question_interaction.correct_answer = user_answered_correctly
            question_interaction.save()

        except KeyError:
            QuestionInteraction.objects.create(
                user=user,
                question=current_qustion,
                anime=current_qustion.anime,
                correct_answer=user_answered_correctly,
            )

    quiz_answers = AnswersSerializer(quiz_questions.values(), many=True)

    user.tests_completed += 1

    if user.tests_completed % 10 == 0:
        user.points += 20
        create_notification(
            receiver=request,
            notification="new achievement! you have completed 10 quizes, +20 points",
        )

    user.save()

    # clear questions and interactions (for the submitted quiz) from cache
    cache.delete(f"quiz_{user.id}")
    cache.delete(f"interactions_{user.id}")

    return Response({"answers": quiz_answers.data})
