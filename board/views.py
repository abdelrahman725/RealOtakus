import random
from time import sleep

from django.db import connection, IntegrityError
from django.shortcuts import render
from django.db.models import Count, Avg, Q
from django.http import JsonResponse
from django.shortcuts import redirect

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from board.helpers import login_required
from board.models import *
from board.serializers import *
from board.constants import *

# to see the corresponding sql queries that get executed when the relevant ORM queryset gets executed
# for q in connection.queries : print(f"\n\n { q } \n\n")

# status.HTTP_429_TOO_MANY_REQUESTS

animes_dict = {}

game_questions = {}

game_interactions = {}

for anime in Anime.objects.all():
    animes_dict[anime.pk] = anime


def get_current_user(request):
    return User.objects.get(username="pablo")
    return request.user


def get_or_query_anime(anime: int):
    try:
        return animes_dict[anime]
    except KeyError:
        fetched_anime = Anime.objects.get(anime)
        animes_dict[anime] = fetched_anime
        return fetched_anime


def react_view(request):
    if request.user.is_authenticated:
        return render(request, "index.html")
    return redirect("/")


def react_app(request):
  # react app
    if request.user.is_authenticated:
        return render(request, "index.html")
  # django template
    return render(request, "board/home.html")


#@login_required
@api_view(["GET", "POST"])
def get_home_data(request):
    user = get_current_user(request)

    if request.method == "POST":
        user.country = request.data["country"]
        user.save()
        return Response({
            "info": "country saved"
        },
            status=status.HTTP_201_CREATED
        )

    basic_user_data = SimpleUserDataSerializer(
        User.objects.values(
            "id",
            "username",
            "points",
            "level",
            "country",
        ).get(id=user.id)
    ).data

    basic_user_data["is_reviewer"] = user.animes_to_review.exists()

    serialized_notifications = NotificationsSerializer(
        user.getnotifications.all(),
        many=True
    )

    all_animes = AnimeSerializer(animes_dict.values(), many=True)

    # leaderboard users sorted by their scores in non-increasing order where their score is > avg_score and !=0
    avg_score = User.objects.exclude(points=0).aggregate(Avg('points'))['points__avg']
    
    if not avg_score : avg_score = 0
    
    top_competitors = User.objects.annotate(
        n_contributions=Count("contributions",filter=(Q(contributions__approved=True)))
    ).filter(points__gt=avg_score).order_by("-points")

    LeaderBorad = LeaderBoradSerializer(top_competitors, many=True)

    return Response({
        "user_data": basic_user_data,
        "notifications": serialized_notifications.data,
        "animes": all_animes.data,
        "leaderboard": LeaderBorad.data
    })


# -------------------------------------- 4 Quiz related endpoints ----------------------------------------

#@login_required
@api_view(["GET"])
def get_game_animes(request):
    user = get_current_user(request)

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
    # sleep(1)

    return Response({
        "animes": game_animes.data
    })


#@login_required
@api_view(["GET"])
def get_game(request, game_anime):
    current_user = get_current_user(request)
    selected_anime = animes_dict[game_anime]

    # To catch malicious or non-serious users
    if current_user.tests_started - current_user.tests_completed == "To Do":
        # for example we can do the following check (not perfect though)
        if current_user.tests_started - current_user.tests_completed > 5:
            pass
        # catch here and act upon that

    game_questions[current_user.id] = {}
    game_interactions[current_user.id] = {}
    
    # this game questions
    questions = selected_anime.anime_questions.filter(
        (~Q(contribution__contributor=current_user)
        & 
        ~Q(contribution__reviewer=current_user)
        ),
        active=True
    ).exclude(
        pk__in=current_user.questions_interacted_with.values_list(
            'question__pk', flat=True)
    )[:QUESTIONSCOUNT]

    if questions.count() != QUESTIONSCOUNT:
        return Response({
            "info": "sorry no enough questions for the quiz",
        })

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
            "question":question.question,
            "choice1": question_choices[0],
            "choice2": question_choices[1],
            "choice3": question_choices[2],
            "choice4": question_choices[3],
            "id": question.id
        })

        game_questions[current_user.id][question.id] = question


    current_user.tests_started += 1
    current_user.save()

    return Response({
        "info": "ok",
        "game_questions": serialized_questions
    })


@api_view(["POST"])
def record_question_encounter(request, question_id):

    user = get_current_user(request)

    game_interactions[user.id][question_id] = QuestionInteraction.objects.create(
        user=user,
        question=game_questions[user.id][question_id],
        anime=game_questions[user.id][question_id].anime,
    )  
  
    return Response(
        {
            "info": "1 question interaction recorded",
        },
        status=status.HTTP_201_CREATED
    )


#@login_required
@api_view(["POST"])
def submit_game(request):
    user = get_current_user(request)
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
                correct_answer= user_answered_correctly
            )

    right_answers = AnswersSerializer(
        game_questions[user.id].values(),
        many=True
    )

    user.tests_completed += 1
   
    if user.tests_completed % 10 == 0:
        user.points +=20
        CreateNotification(
            receiver=user,
            notification="new achievement! you have completed 10 quizes, +20 points",
        )
   
    user.save()

    # delete current user related game questions from memory :
    del game_interactions[user.id]
    del game_questions[user.id]

    return Response({
        "info": "test submitted successfully",
        "level": user.level,
        "right_answers": right_answers.data
    })

# ------------------------------------------------------------------------------------------------------



#@login_required
@api_view(["GET", "POST"])
def get_or_make_contribution(request):
    user = get_current_user(request)

    if request.method == "GET":
        user_contributions = ContributionSerializer(
            user.contributions.select_related("question"),
            many=True
        )
        return Response(user_contributions.data)

    try:
        anime = get_or_query_anime(int(request.data["anime"]))
    except:
        return JsonResponse({"info": "anime doesn't exist"})

    QuestionOBject = request.data["question"]

    is_anime_reviewr = anime in user.animes_to_review.all()

    try:
        sleep(1)
        new_question = Question.objects.create(
            anime=anime,
            active=is_anime_reviewr,
            question=QuestionOBject["question"],
            right_answer=QuestionOBject["rightanswer"],
            choice1=QuestionOBject["choice1"],
            choice2=QuestionOBject["choice2"],
            choice3=QuestionOBject["choice3"]
        )

        Contribution.objects.create(
            contributor=user,
            question=new_question,
            reviewer=user if is_anime_reviewr else None,
            approved=True if is_anime_reviewr else None
        )

        if is_anime_reviewr:
            return JsonResponse({
                "info": f"Thanks for you contribution, it's approved since you are a reviewer of that anime"
            })

        return Response(
            {"info": f"Thanks for you contribution, your submission will be reviewed soon"},
            status=status.HTTP_201_CREATED
        )

    except IntegrityError as e:
        if 'UNIQUE constraint' in str(e.args):
            return JsonResponse({"info": "this question already exists", "state": "conflict"})

        return JsonResponse({"info": e.args})


#@login_required
@api_view(["GET", "PUT"])
def get_or_review_contribution(request):
    user = get_current_user(request)

    if request.method == "GET":
        animes = user.animes_to_review.all()

        questions = QuestionSerializer(
            Question.objects.filter(
                ~Q(contribution__contributor=user),
                anime__in=animes,
                contribution__isnull=False,
                contribution__approved__isnull=True,
            ).select_related("anime").order_by("id"),
            many=True
        )

        sleep(0.5)

        return Response({
            "questions": questions.data,
        })

    review_state = request.data["state"]
    q_id = int(request.data["question"])
    feedback = request.data["feedback"]

    try:
        question = Question.objects.get(pk=q_id)

        if question.contribution.approved != None:
            return Response(
                {"info": "question has been reviewed by another reviewer"},
                status=status.HTTP_409_CONFLICT
            )

        if feedback:
            question.contribution.reviewer_feedback = feedback

        question.contribution.reviewer = user

        sleep(1)

        if review_state == 1:
            question.contribution.approved = True
            question.contribution.save()

            return Response({
                "info": "question is approved successfully"
            })

        if review_state == 0:
            question.contribution.approved = False
            question.contribution.save()

            return Response({
                "info": "question is rejected successfully"
            })

    except Question.DoesNotExist:
        return Response(
            {"info": "this question doesn't exist anymore, probably is deleted"},
            status=status.HTTP_410_GONE
        )


#@login_required
@api_view(["GET"])
def get_user_profile(request):
    user = get_current_user(request)

    profile_data = ProfileDataSerializer(
        User.objects.values("points", "level", "tests_completed").annotate(
            n_questions_reviewed=Count("contributions_reviewed", distinct=True)
        ).annotate(
            n_approved_contributions=Count("contributions", filter=(
                Q(contributions__approved=True)), distinct=True)
        ).get(id=user.id)
    )

    user_interactions = InteractionsSerializer(
        user.questions_interacted_with.select_related("anime"),
        many=True
    )

    return Response({
        "user_data": profile_data.data,
        "interactions": user_interactions.data,
    })


#@login_required
@api_view(["PUT"])
def update_notifications(request):
    user = get_current_user(request)

    user.getnotifications.filter(
        pk__in=request.data["notifications"]).update(seen=True)

    return Response(
        {
            "info": f"notifications state of {request.user.username} are updated successfully"
        },
        status=status.HTTP_201_CREATED
    )


# @api_view(["GET"])
# def api_animes_questions(requst, anime_id, n_questions):

#     anime = get_or_query_anime(anime_id)

#     serialized_questions = QuestionsApiService(
#         anime.anime_questions.filter(active=True)[:n_questions],
#         many=True
#     )
#     return Response({
#         "data": serialized_questions.data,
#     })
