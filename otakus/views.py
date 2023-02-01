import random

from django.db import IntegrityError
from django.db.models import Count, Avg, Q
from django.shortcuts import render, redirect 

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes

from otakus.models import User
from otakus.models import Anime
from otakus.models import Contribution
from otakus.models import Question
from otakus.models import QuestionInteraction

from otakus.serializers import UserDataSerializer
from otakus.serializers import LeaderBoradSerializer
from otakus.serializers import AnimeSerializer
from otakus.serializers import ContributionSerializer
from otakus.serializers import AnimeInteractionsSerializer
from otakus.serializers import NotificationsSerializer
from otakus.serializers import AnswersSerializer
from otakus.serializers import QuestionInteractionsSerializer
from otakus.serializers import AnimeReviewedContributionsSerializer

from otakus.helpers import CreateNotification

from otakus.constants import QUESTIONSCOUNT



animes_dict = {}

game_questions = {}

game_interactions = {}


for anime in Anime.objects.all():
    animes_dict[anime.pk] = anime


def get_or_query_anime(anime: int):
    try:
        return animes_dict[anime]
    except KeyError:
        animes_dict[anime] = Anime.objects.get(anime)
        return animes_dict[anime]


def react_app(request):
    if request.user.is_superuser:
        return redirect("/admin/")
    return render(request, "index.html")


@api_view(["GET"])
@permission_classes([AllowAny])
def get_unauthenticated_home_data(request):

    all_animes = AnimeSerializer(animes_dict.values(), many=True)

    # leaderotakus users sorted by their scores in non-increasing order where their score is !=0 and >= avg_score
    avg_score = User.objects.filter(points__gt=0).aggregate(Avg('points'))['points__avg']

    if not avg_score:
        top_competitors = []
    
    else:
        # filter to use : points__gt=avg_score
        top_competitors = User.objects.annotate(
            n_contributions=Count("contributions", filter=(
                Q(contributions__approved=True)))
        ).filter().order_by("-points")

    leader_otakus_users = LeaderBoradSerializer(top_competitors, many=True)
    return Response({
        "is_authenticated" : "true" if request.user.is_authenticated else "false",
        "animes": all_animes.data,
        "leaderboard": leader_otakus_users.data
    })


@api_view(["GET"])
def get_user_authenticated_data(request):
  
    user = request.user

    user_data = UserDataSerializer(
        User.objects.values(
            "id",
            "username",
            "email",
            "points",
            "level",
            "tests_started",
            "tests_completed",
            "level",
            "country",
        ).get(id=user.id)
    ).data

    user_data["is_reviewer"] = user.animes_to_review.exists()

    serialized_notifications = NotificationsSerializer(
        user.getnotifications.all(),
        many=True
    )

    return Response({
        "user_data": user_data,
        "notifications": serialized_notifications.data
    })


@api_view(["POST"])
def save_user_country(request):
    user = request.user

    user.country = request.data["country"]
    user.save()

    return Response({},status=status.HTTP_201_CREATED)


# -------------------------------------- 4 Quiz related endpoints ----------------------------------------


@api_view(["GET"])
def get_game_animes(request):
    user = request.user

    game_animes = AnimeInteractionsSerializer(
        Anime.objects.filter(active=True).annotate(
            n_user_interactions=Count(
                "anime_interactions",
                filter=(Q(anime_interactions__user=user)),
                distinct=True
            )).annotate(
                n_active_questions=Count(
                    "anime_questions",
                    filter=(
                        Q(anime_questions__active=True)
                        &
                        ~Q(anime_questions__contribution__contributor=user)
                        &
                        ~Q(anime_questions__contribution__reviewer=user)
                    ),
                    distinct=True
                )
        ),
        many=True
    )

    return Response({
        "animes": game_animes.data
    })



@api_view(["GET"])
def get_game(request, game_anime):
    user = request.user
    selected_anime = animes_dict[game_anime]

    game_questions[user.id] = {}
    game_interactions[user.id] = {}

    # To catch malicious or non-serious users
    if user.tests_started - user.tests_completed == "To Do":
        # for example we can do the following check (not good enough though)
        if user.tests_started - user.tests_completed > 5:
            pass
        # catch here and act upon that

    # this game questions
    questions = selected_anime.anime_questions.filter(
        (~Q(contribution__contributor=user)
         &
         ~Q(contribution__reviewer=user)
         ),
        active=True
    ).exclude(
        pk__in=user.questions_interacted_with.values_list(
            'question__pk', flat=True)
    )[:QUESTIONSCOUNT]

    if questions.count() != QUESTIONSCOUNT:
        return Response({},status=status.HTTP_404_NOT_FOUND)

    serialized_questions = []

    for question in questions:
        question_choices = [
            question.choice1,
            question.choice2,
            question.choice3,
            question.right_answer
        ]

        random.shuffle(question_choices)

        serialized_questions.append({
            "id": question.id,
            "question": question.question,
            "choice1": question_choices[0],
            "choice2": question_choices[1],
            "choice3": question_choices[2],
            "choice4": question_choices[3]
        })

        game_questions[user.id][question.id] = question

    user.tests_started += 1
    user.save()

    return Response({
        "game_questions": serialized_questions
    })


@api_view(["POST"])
def record_question_encounter(request, question_id):

    user = request.user

    try:
        game_interactions[user.id][question_id] = QuestionInteraction.objects.create(
            user=user,
            question=game_questions[user.id][question_id],
            anime=game_questions[user.id][question_id].anime,
        )

    except (KeyError, IntegrityError):
        return Response({
            "info": "interaction already recorded"
        })

    return Response(
        {
            "info": "1 question interaction recorded",
        },
        status=status.HTTP_201_CREATED
    )



@api_view(["POST"])
def submit_game(request):
    user = request.user
    user_answers = request.data["answers"]

    for question_id in game_questions[user.id]:
        current_qustion = game_questions[user.id][question_id]
        user_answered_correctly = None

        string_question_id = str(question_id)
        if string_question_id in user_answers:
            user_answered_correctly = user_answers[string_question_id] == current_qustion.right_answer
            if user_answered_correctly == True:
                user.points += 1

        if question_id in game_interactions[user.id]:
            if user_answered_correctly != None:
                game_interactions[user.id][question_id].correct_answer = user_answered_correctly
                game_interactions[user.id][question_id].save()

        else:
            QuestionInteraction.objects.create(
                user=user,
                question=current_qustion,
                anime=current_qustion.anime,
                correct_answer=user_answered_correctly
            )

    right_answers = AnswersSerializer(
        game_questions[user.id].values(),
        many=True
    )

    user.tests_completed += 1

    if user.tests_completed % 10 == 0:
        user.points += 20
        CreateNotification(
            receiver=user,
            notification="new achievement! you have completed 10 quizes, +20 points",
        )

    user.save()

# delete current user's game questions from memory
    del game_interactions[user.id]
    del game_questions[user.id]

    return Response({
        "level": user.level,
        "right_answers": right_answers.data
    })

# ------------------------------------------------------------------------------------------------------


@api_view(["GET", "POST"])
def get_or_make_contribution(request):
    user = request.user

    if request.method == "GET":
        user_contributions = ContributionSerializer(
            user.contributions.filter(question__isnull=False).select_related(
                "question").order_by("-id"),
            many=True
        )
        return Response(user_contributions.data)

    anime = get_or_query_anime(request.data["anime"])

    question_object = request.data["question"]

    try:
        contributed_question = Question.objects.create(
            anime=anime,
            question=question_object["question"],
            right_answer=question_object["rightanswer"],
            choice1=question_object["choice1"],
            choice2=question_object["choice2"],
            choice3=question_object["choice3"]
        )

        Contribution.objects.create(
            contributor=user,
            question=contributed_question
        )

        return Response({}, status=status.HTTP_201_CREATED)

    except IntegrityError as e:
        if 'UNIQUE constraint' in str(e.args):
            return Response({}, status=status.HTTP_409_CONFLICT)



@api_view(["GET", "PUT"])
def get_or_review_contribution(request):

    user = request.user
    
    if request.method == "GET":
        
        if not user.animes_to_review.exists():
            return Response({}, status=status.HTTP_401_UNAUTHORIZED)

        animes_for_user_to_review = user.animes_to_review.annotate(
            reviewed_contributions=Count(
                "anime_questions__contribution", filter=(
                    Q(anime_questions__contribution__approved__isnull=False)
                    &
                    Q(anime_questions__contribution__reviewer=user)
                )
            )
        )

        contributed_questions = ContributionSerializer(
            Contribution.objects.filter(
                ~Q(contributor=user),
                question__anime__in=animes_for_user_to_review,
                approved__isnull=True,
            ).select_related("question").select_related("question__anime").order_by("-id"),
            many=True
        )

        animes = AnimeReviewedContributionsSerializer(animes_for_user_to_review, many=True)

        return Response({
            "questions": contributed_questions.data,
            "animes": animes.data
        })


    contribution = Contribution.objects.get(
        pk=request.data["contribution"]
    )

    if contribution.question == None:
        return Response({"info":"this question doesn't exist anymore"}, status=status.HTTP_404_NOT_FOUND)


    if contribution.question.anime not in user.animes_to_review.all():
        return Response({"info":"not authorized"}, status=status.HTTP_401_UNAUTHORIZED)

    if contribution.approved != None:
        return Response({"info":"this question got reviewed by another reviewer"}, status=status.HTTP_409_CONFLICT)

    review_state = request.data["state"]
    contribution.reviewer = user
    contribution.reviewer_feedback = request.data["feedback"]

    if review_state == 1:
        contribution.approved = True
        contribution.save()

        return Response({
            "info": "question is approved successfully"
        })

    if review_state == 0:
        contribution.approved = False
        contribution.save()

        return Response({
            "info": "question is rejected successfully"
        })



@api_view(["GET"])
def get_user_interactions(request):
    user = request.user

    user_interactions = QuestionInteractionsSerializer(
        user.questions_interacted_with.select_related("anime"),
        many=True
    )

    return Response({
        "interactions": user_interactions.data,
    })



@api_view(["PUT"])
def update_notifications(request):
    user = request.user

    user.getnotifications.filter(
        pk__in=request.data["notifications"]
    ).update(seen=True)

    return Response(
        {
            "info": f"notifications state of {user.username} are updated successfully"
        },
        status=status.HTTP_201_CREATED
    )
    