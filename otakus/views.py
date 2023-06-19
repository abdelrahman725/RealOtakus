import random
from datetime import timedelta

from django.utils import timezone
from django.db import IntegrityError
from django.db.models import Count, Avg, Q
from django.shortcuts import render, redirect
from django.core.cache import cache

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes

from otakus.models import User
from otakus.models import Anime
from otakus.models import Question
from otakus.models import QuestionInteraction
from otakus.models import Notification

from otakus.serializers import UserDataSerializer
from otakus.serializers import LeaderBoradSerializer
from otakus.serializers import AnimeSerializer
from otakus.serializers import ContributionSerializer
from otakus.serializers import AnimeInteractionsSerializer
from otakus.serializers import NotificationsSerializer
from otakus.serializers import AnswersSerializer
from otakus.serializers import QuestionInteractionsSerializer
from otakus.serializers import AnimeReviewedContributionsSerializer

from otakus.helpers import create_notification
from otakus.constants import QUESTIONSCOUNT
from django.conf import settings


def react_app(request):
    if request.user.is_superuser:
        return redirect(f"/{settings.ADMIN_PANEL_PATH}")
    return render(request, "index.html")


@api_view(["GET"])
@permission_classes([AllowAny])
def get_home_data(request):
    cached_or_quered_animes = cache.get("animes")

    if not cached_or_quered_animes:
        cached_or_quered_animes = Anime.objects.all()
        cache.set(
            key="animes",
            value={anime.id: anime for anime in cached_or_quered_animes},
            timeout=None,
        )

    else:
        cached_or_quered_animes = cached_or_quered_animes.values()

    all_animes = AnimeSerializer(cached_or_quered_animes, many=True)

    leaderboard = cache.get("leaderboard")

    if leaderboard == None:
        # Calculate the average score for all of the users.
        avg_score = User.otakus.filter(points__gt=0).aggregate(Avg("points"))[
            "points__avg"
        ]

        if not avg_score:
            top_users = []

        else:
            # Get the top users (limited to 30 users) who have a score greater than the average score.
            top_users = (
                User.otakus.annotate(
                    n_contributions=Count(
                        "contributions", filter=(Q(contributions__approved=True))
                    )
                )
                .filter(points__gt=avg_score)
                .order_by("-points")[:30]
            )

        leaderboard = LeaderBoradSerializer(top_users, many=True).data

        cache.set(key="leaderboard", value=leaderboard, timeout=30)

    if request.user.is_authenticated:
        user = request.user

        user_data = UserDataSerializer(user).data

        user_data["is_reviewer"] = user.animes_to_review.exists()

        user_notifications = NotificationsSerializer(
            Notification.non_expired.filter(
                (Q(receiver=user) | Q(broad=True)) & Q(time__gt=user.date_joined)
            ),
            many=True,
        )

        return Response(
            {
                "user_data": user_data,
                "notifications": user_notifications.data,
                "animes": all_animes.data,
                "leaderboard": leaderboard,
                "is_authenticated": "true",
            }
        )

    return Response(
        {
            "animes": all_animes.data,
            "leaderboard": leaderboard,
            "is_authenticated": "false",
        }
    )


@api_view(["POST"])
def save_user_country(request):
    user = request.user
    user.country = request.data["country"]
    user.save()
    return Response({}, status=status.HTTP_201_CREATED)


# -------------------------------------- 4 Quiz related endpoints ----------------------------------------


@api_view(["GET"])
def get_game_animes(request):
    user = request.user

    game_animes = AnimeInteractionsSerializer(
        Anime.objects.filter(active=True)
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

    return Response({"animes": game_animes.data})


@api_view(["GET"])
def get_game(request, game_anime):
    user = request.user
    selected_anime = cache.get("animes")[game_anime]

    # To catch malicious or non-serious users, for example we can do the following check (not good enough though) :
    if user.tests_started - user.tests_completed > 5:
        # catch here and act upon that
        pass
        # return Response({"info": "you are not consistent enough when taking quiz"}, status=status.HTTP_403_FORBIDDEN)

    # current game questions for current user
    questions = selected_anime.anime_questions.filter(
        (~Q(contributor=user) & ~Q(reviewer=user)), active=True
    ).exclude(
        pk__in=user.questions_interacted_with.values_list("question__pk", flat=True)
    )[
        :QUESTIONSCOUNT
    ]

    if questions.count() != QUESTIONSCOUNT:
        cache.delete(f"game_{user.id}")
        cache.delete(f"interactions_{user.id}")
        return Response({}, status=status.HTTP_404_NOT_FOUND)

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
        key=f"game_{user.id}",
        value={question.id: question for question in questions},
        timeout=530,
    )

    cache.set(key=f"interactions_{user.id}", value={}, timeout=530)

    user.tests_started += 1
    user.save()

    return Response({"game_questions": serialized_questions})


@api_view(["POST"])
def record_question_encounter(request, question_id):
    user = request.user

    try:
        interaction = QuestionInteraction.objects.create(
            user=user,
            question=cache.get(f"game_{user.id}")[question_id],
            anime=cache.get(f"game_{user.id}")[question_id].anime,
        )

        previous_interactions = cache.get(f"interactions_{user.id}")
        previous_interactions[question_id] = interaction

        cache.set(
            key=f"interactions_{user.id}", value=previous_interactions, timeout=530
        )

    except IntegrityError:
        return Response({"info": "interaction already recorded"})

    return Response(
        {
            "info": "1 question interaction recorded",
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
def submit_game(request):
    user = request.user
    user_answers = request.data["answers"]

    user_interactions = cache.get(f"interactions_{user.id}")
    current_game_questions = cache.get(f"game_{user.id}")

    for question_id in current_game_questions:
        current_qustion = current_game_questions[question_id]
        user_answered_correctly = None

        str_question_id = str(question_id)
        if str_question_id in user_answers:
            user_answered_correctly = (
                user_answers[str_question_id] == current_qustion.right_answer
            )
            if user_answered_correctly == True:
                user.points += 1

        try:
            question_interaction = user_interactions[question_id]
            question_interaction.correct_answer = user_answered_correctly
            question_interaction.save()

        except KeyError:
            QuestionInteraction.objects.create(
                user=user,
                question=current_qustion,
                anime=current_qustion.anime,
                correct_answer=user_answered_correctly,
            )

    right_answers = AnswersSerializer(current_game_questions.values(), many=True)

    user.tests_completed += 1

    if user.tests_completed % 10 == 0:
        user.points += 20
        create_notification(
            receiver=user,
            notification="new achievement! you have completed 10 quizes, +20 points",
        )

    user.save()

    # clear current game questions and interactions from cache
    cache.delete(f"game_{user.id}")
    cache.delete(f"interactions_{user.id}")

    return Response({"level": user.level, "right_answers": right_answers.data})


# ------------------------------------------------------------------------------------------------------


@api_view(["GET", "POST"])
def get_or_make_contribution(request):
    user = request.user

    if request.method == "GET":
        user_contributions = ContributionSerializer(
            user.contributions.filter(is_contribution=True)
            .select_related("anime")
            .order_by("-id"),
            many=True,
        )
        return Response(user_contributions.data)

    # limit contributions to 10 within the last 24 hours
    if (
        user.contributions.filter(
            date_created__gte=timezone.now() - timedelta(days=1)
        ).count()
        >= 10
    ):
        return Response({}, status=status.HTTP_403_FORBIDDEN)

    try:
        question_data = request.data["question"]

        new_contribution = Question(
            anime_id=request.data["anime"],
            contributor=user,
            is_contribution=True,
            question=question_data["question"],
            right_answer=question_data["rightanswer"],
            choice1=question_data["choice1"],
            choice2=question_data["choice2"],
            choice3=question_data["choice3"],
        )
        new_contribution.save()

        return Response({}, status=status.HTTP_201_CREATED)

    # question already exists
    except IntegrityError:
        return Response({}, status=status.HTTP_409_CONFLICT)


@api_view(["GET", "PUT"])
def get_or_review_contribution(request):
    user = request.user

    if request.method == "GET":
        if not user.animes_to_review.exists():
            return Response({}, status=status.HTTP_401_UNAUTHORIZED)

        animes_for_user_to_review = user.animes_to_review.annotate(
            reviewed_contributions=Count(
                "anime_questions",
                filter=(
                    Q(anime_questions__approved__isnull=False)
                    & Q(anime_questions__reviewer=user)
                ),
            )
        )

        pending_contributions = ContributionSerializer(
            Question.objects.filter(
                ~Q(contributor=user),
                is_contribution=True,
                anime__in=animes_for_user_to_review,
                approved__isnull=True,
            )
            .select_related("anime")
            .order_by("-id"),
            many=True,
        )

        animes = AnimeReviewedContributionsSerializer(
            animes_for_user_to_review, many=True
        )

        return Response(
            {"questions": pending_contributions.data, "animes": animes.data}
        )

    try:
        new_contribution = Question.objects.get(pk=request.data["contribution"])

        try:
            user.animes_to_review.get(id=new_contribution.anime.id)

        except Anime.DoesNotExist:
            return Response(
                {"info": "not authorized"}, status=status.HTTP_401_UNAUTHORIZED
            )

        if new_contribution.approved != None:
            return Response(
                {"info": "this question got reviewed by another reviewer"},
                status=status.HTTP_409_CONFLICT,
            )

        review_decision = request.data["state"]
        new_contribution.reviewer = user
        new_contribution.feedback = request.data["feedback"]

        # approved
        if review_decision == 1:
            new_contribution.approved = True
            new_contribution.save()
            return Response({"info": "question is approved"})

        # rejected
        if review_decision == 0:
            new_contribution.approved = False
            new_contribution.save()
            return Response({"info": "question is rejected"})

    except Question.DoesNotExist:
        return Response(
            {"info": "this question doesn't exist anymore"},
            status=status.HTTP_404_NOT_FOUND,
        )


@api_view(["GET"])
def get_user_interactions(request):
    user = request.user

    user_interactions = QuestionInteractionsSerializer(
        user.questions_interacted_with.select_related("anime"), many=True
    )

    return Response({"interactions": user_interactions.data})


@api_view(["PUT"])
def mark_notifications_as_read(request):
    user = request.user
    user.notifications.filter(pk__in=request.data["notifications"]).update(seen=True)

    return Response({"info": f"notifications updated successfully"})
