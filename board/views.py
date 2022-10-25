import random
from time import sleep

from django.db import connection, IntegrityError
from django.shortcuts import render
from django.forms import ValidationError
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

#status.HTTP_429_TOO_MANY_REQUESTS

animes_dict = {}

game_questions = {}

game_interactions = {}

for anime in Anime.objects.all(): animes_dict[anime.pk] = anime

def get_current_user(request):
    return request.user
    return User.objects.get(username="pablo")


def get_or_query_anime(anime : int):   
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


@login_required
@api_view(["GET", "POST"])
def get_home_data(request):
    user = get_current_user(request)
    
    if request.method == "POST":
        user.country = request.data["country"]
        user.save()
        return Response({
            "info":"country saved"
            },
            status= status.HTTP_201_CREATED
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

    # users sorted by their scores in non-increasing order where their score is >= avg_score and !=0 
    #avg_score = User.objects.exclude(points=0).aggregate(Avg('points'))['points__avg']

    # top_competitors = User.objects.annotate(
    #     n_contributions=Count("contributions",filter=(Q(contributions__approved=True)))
    # ).filter(points__gte= avg_score).order_by("-points")

    top_competitors = User.objects.annotate(
        n_contributions=Count("contributions",filter=(Q(contributions__approved=True)))
    ).exclude(username="admin").order_by("-points")

    LeaderBorad = LeaderBoradSerializer(top_competitors, many=True)

        
    return Response({
        "user_data": basic_user_data,
        "notifications": serialized_notifications.data,
        "animes":all_animes.data,
        "leaderboard": LeaderBorad.data
    })


# -------------------------------------- Quiz related endpoints ----------------------------------------
# ------------------------------------------------------------------------------------------------------

@login_required
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
                n_active_questions= Count(
                    "anime_questions",
                    filter=(
                     #Q(anime_questions__active=True),
                     #Q(contribution__contributor=user,contribution__reviewer=user)
                    ),
                    distinct=True
                )
            ),
        many=True
    )
    #sleep(1)
    
    return Response({
        "animes": game_animes.data
    })


@login_required
@api_view(["GET"])
def get_game(request, game_anime):
    current_user = get_current_user(request)
    selected_anime = animes_dict[game_anime]
    
    # To Do here: we have to check n_tests_started against n_tests_completed
    # To catch malicious or non-serious users
    # if current_user.tests_started - current_user.tests_completed == "To Do":
        # catch here and act upon that
        # pass
    
    # this game questions
    questions=selected_anime.anime_questions.filter(
            ~Q(contribution__contributor=current_user, contribution__reviewer=current_user),
            #active=True
        ).exclude(
            pk__in=current_user.questions_interacted_with.values_list('question__pk', flat=True)
        )[:QUESTIONSCOUNT]
    

    if questions.count() != QUESTIONSCOUNT:
        return Response({
            "info" : "no enough questions for the quiz",
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
            "question": question.question,
            "choice1" : question_choices[0],
            "choice2" : question_choices[1],
            "choice3" : question_choices[2],
            "choice4" : question_choices[3],
            "id" : question.id
        })

    game_questions[current_user.id] = {}

    for q in questions:
        game_questions[current_user.id][q.id] = q

    current_user.tests_started +=1
    current_user.save()

    return Response({   
        "info" : "ok",
        "game_questions" : serialized_questions
    })


@api_view(["POST"])
def record_question_encounter(request, question_id):

    user = get_current_user(request)
    
    question = game_questions[user.id][question_id]

    if user.id not in game_interactions:
        game_interactions[user.id] = {}

    game_interactions[user.id][question_id] = QuestionInteraction.objects.create(
        user=user,
        question = question,
        anime = question.anime,
    )

    return Response(
        {
          "info" : "1 question interaction recorded",
        },
        status = status.HTTP_201_CREATED
    )


@login_required
@api_view(["POST"])
def submit_game(request):
    user = get_current_user(request)
    user_answers = request.data["answers"]

    game_score = 0

    for question_id,answer in user_answers.items():
        question_id = int(question_id)  
        interaction = game_interactions[user.id][question_id]
        
        if answer ==  game_questions[user.id][question_id].right_answer:
            game_score += 1 
            interaction.correct_answer = True
        
        else :
            interaction.correct_answer = False
        
        interaction.save()

    right_answers = AnswersSerializer(game_questions[user.id].values(), many=True)
    
    user.tests_completed += 1
    user.points += game_score 
    user.save()
    
    # delete used cache from memory :
    del game_questions[user.id]
    del game_interactions[user.id]

    return Response({
        "info": "test submitted successfully",
        "score": game_score, 
        "level": user.level,
        "right_answers" :right_answers.data
    })


# ------------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------------


@login_required
@api_view(["GET","POST"])
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
        return JsonResponse({"anime doesn't exist"})

    QuestionOBject = request.data["question"]

    is_anime_reviewr = anime in user.animes_to_review.all()   

    try:
        new_question = Question.objects.create(
            anime=anime,
            active=is_anime_reviewr,
            question= QuestionOBject["question"], 
            right_answer=QuestionOBject["rightanswer"],
            choice1=QuestionOBject["choice1"],
            choice2=QuestionOBject["choice2"],
            choice3=QuestionOBject["choice3"]
        )

        Contribution.objects.create(
            contributor = user,
            question = new_question,
            reviewer = user if is_anime_reviewr else None,
            approved = True if is_anime_reviewr else None
        )

        if is_anime_reviewr:
            return JsonResponse({
                "info": f"you have contributed a new question for {anime}! it's approved since you are a reviewer of that anime"
            })
                
        # sleep(1)
        return Response(
            {"info": f"your question submission for {anime} has been received and waits approval"}, 
            status = status.HTTP_201_CREATED
        )
        #return JsonResponse()

    except IntegrityError as e:
        if 'UNIQUE constraint' in str(e.args):
            return JsonResponse({"info": "sorry this question already exist"})

        return JsonResponse({"info": e.args}) 
    
    except ValidationError as e:
        return JsonResponse({"info": e.args[0]})


@login_required
@api_view(["GET","PUT"])
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
            "questions" :questions.data,
        })
    
    
    review_state = request.data["state"]
    q_id = int(request.data["question"])
    feedback = request.data["feedback"]

    try:
        question = Question.objects.get(pk=q_id)
        
        if  question.contribution.approved != None:
            return Response(
                {"info":"question has been reviewed by another reviewer"},
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
                "info":"question is approved successfully"
            })    

        if review_state == 0:
            question.contribution.approved = False
            question.contribution.save()
            
            return Response({
                "info":"question is rejected successfully"
            })
        
    except Question.DoesNotExist:
        return Response(
            {"info" : "this question doesn't exist anymore, probably is deleted"},
            status=status.HTTP_410_GONE
        )


@login_required
@api_view(["GET"])
def get_user_profile(request):
    user = get_current_user(request)

    profile_data = ProfileDataSerializer(
        User.objects.values("points","level","tests_started","tests_completed").annotate(
            n_questions_reviewed = Count("contributions_reviewed",distinct=True)
        ).annotate(
            n_approved_contributions = Count("contributions",filter=(Q(contributions__approved=True)),distinct=True)
        ).get(id=user.id)
    )

    # user_interactions = UserInteractionSerializer(
    #     user.questions_interacted_with.select_related("anime"),
    #     many=True
    # )

    user_interactions = UserInteractionSerializer(
        Anime.objects.filter(id__in=user.questions_interacted_with.values("anime")).annotate(
            right_answers=Count("anime_interactions", filter=(
                    Q(anime_interactions__correct_answer=True, anime_interactions__user=user)
                ),
                distinct=True
            )
        ).annotate(
            not_right_answers=Count("anime_interactions", filter=((
                ~Q(anime_interactions__correct_answer=True)) 
                & (Q(anime_interactions__user=user)
                )),
                distinct=True
            )
        ),
        many=True
    )
       
    return Response({
        "user_data": profile_data.data,
        "user_interactions" : user_interactions.data,
    })


@login_required
@api_view(["PUT"])
def update_notifications(request):
    user = get_current_user(request)

    user.getnotifications.filter(pk__in=request.data["notifications"]).update(seen=True)
    
    return Response(
        {
          "info":f"notifications state of {request.user.username} are updated successfully"
        },
        status=status.HTTP_201_CREATED
    )


# @api_view(["GET"])
# def animes_questions_api_service(requst, anime_id, n_questions):
    
#     anime = get_or_query_anime(anime_id)

#     serialized_questions = QuestionsApiService(
#         anime.anime_questions.filter(active=True)[:n_questions],
#         many=True
#     )
#     return Response({
#         "data": serialized_questions.data,
#     })
