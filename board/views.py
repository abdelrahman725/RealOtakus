import random
from time import sleep

from django.db import connection, IntegrityError
from django.shortcuts import render
from django.forms import ValidationError
from django.db import models
from django.db.models import Subquery, Count, Avg, OuterRef, Q
from django.http import JsonResponse

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


def GetOrFetchAnime(anime : int):   
    try:
        return animes_dict[anime]
    
    except KeyError:
        fetched_anime = Anime.objects.get(anime)
        animes_dict[anime] = fetched_anime
        return fetched_anime


def GetWantedUser(request):
    return User.objects.get(username="user")
    return request.user


#@login_required
def ReactApp(request):
    return render(request, "index.html")


#@login_required
@api_view(["GET", "POST"])
def GetUserData(request):
    user = GetWantedUser(request)

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
            "country"
        ).get(id=user.id)
    )
    
    serialized_notifications = NotificationsSerializer(
        user.getnotifications.all(),
        many=True
    )

    all_animes = AnimeSerializer(animes_dict.values(), many=True)
    
    return Response({
        "user_data": basic_user_data.data,
        "notifications": serialized_notifications.data,
        "animes":all_animes.data
    })


#@login_required
@api_view(["GET"])
def GetDashBoard(request):

    # users sorted by their scores in non-increasing order where their score is >= avg_score and !=0 
    avg_score = User.objects.exclude(points=0).aggregate(Avg('points'))['points__avg']

    top_competitors = User.objects.annotate(
        n_contributions=Count("contributions",filter=(Q(contributions__approved=True)))
    ).filter(points__gte= avg_score).order_by("-points")

    # top_competitors = User.objects.annotate(
    #     n_contributions=Count("contributions",filter=(Q(contributions__approved=True)))
    # ).exclude(username="admin").order_by("-points")

    LeaderBorad = LeaderBoradSerializer(top_competitors, many=True)
    
    return Response({
        "leaderboard": LeaderBorad.data,
    })


# -------------------------------------- Quiz related endpoints ----------------------------------------
# ------------------------------------------------------------------------------------------------------

#@login_required
@api_view(["GET"])
def GetQuizeAnimes(request):
    user = GetWantedUser(request) 

    game_animes = AnimeInteractionsSerializer(
        Anime.objects.annotate(
            n_user_interactions=Count(
                "anime_interactions",
                filter=(Q(anime_interactions__user=user)),
                distinct=True
            )).annotate(
                n_active_questions= Count(
                    "anime_questions",
                    filter=(
                    #~Q(contribution__contributor=user),
                    #~Q(contribution__reviewer=user),
                    #active=True
                    ),
                    distinct=True
                )
            ),
        many=True
    )
    
    return Response({
        "animes": game_animes.data
    })


#@login_required
@api_view(["GET"])
def GetTest(request, game_anime):
    current_user = GetWantedUser(request)
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
def QuestionEncounter(request, question_id):

    user = GetWantedUser(request)
    
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


#@login_required
@api_view(["POST"])
def SubmitGame(request):
    user = GetWantedUser(request)
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


#@login_required
@api_view(["GET","POST"])
def get_or_make_contribution(request):
    user = GetWantedUser(request)

    if request.method == "GET":
        user_contributions = ContributionSerializer(
            user.contributions.select_related("question"),
            many=True
        )
        return Response(user_contributions.data)

    try:
        anime = GetOrFetchAnime(int(request.data["anime"]))
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


#@login_required
@api_view(["GET","POST"])
def contribution_to_review(request):
    user = GetWantedUser(request)
    
    if request.method == "GET":
    
        animes = user.animes_to_review.all()
    
        questions =  []
        if animes:
            questions = QuestionSerializer(
                Question.objects.filter(
                        ~Q(contribution__contributor=user),
                        anime__in=animes,
                        contribution__isnull=False,
                        contribution__approved__isnull=True,
                ).select_related("anime"),
                many=True
            ).data
        
        animes = AnimeSerializer(animes, many=True)
    
        return Response({
            "questions" :questions,
            "animes" : animes
        })
    

    review_state = request.data["state"]
    q_id = int(request.data["question"])
    feedback = request.data["feedback"]

    try:
        question = Question.objects.get(pk=q_id)
        
        if  question.contribution.approved != None:
            return Response(
                {"question has been reviewed by another reviewer"},
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
                "question is approved successfully"
            })    

        if review_state == 0:
            question.contribution.approved = False
            question.contribution.save()
            
            return Response({
                "question is rejected successfully"
            })
        
    except Question.DoesNotExist:
        return Response(
            {"info" : "this question doesn't exist anymore, probably is deleted"},
            status=status.HTTP_410_GONE
        )


#@login_required
@api_view(["GET"])
def GetMyProfile(request):
    user = GetWantedUser(request)

    profile_data = ProfileDataSerializer(
        User.objects.values(
            "points",
            "level",
            "country",
            "tests_started",
            "tests_completed"
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
            wrong_answers=Count("anime_interactions", filter=(
                    Q(anime_interactions__correct_answer=False, anime_interactions__user=user)       
                ),
                distinct=True
            )
        ).annotate(
            no_answers=Count("anime_interactions", filter=(
                    Q(anime_interactions__correct_answer__isnull=True, anime_interactions__user=user)       
                ),
                distinct=True
            )
        ),
        many=True
    )
    
        
    return Response({
        "user_data": profile_data.data,
        "user_interactions" : user_interactions.data,
    })


#@login_required
@api_view(["PUT"])
def UpdateNotificationsState(request):
    user = GetWantedUser(request)

    user.getnotifications.filter(pk__in=request.data["notifications"]).update(seen=True)
    
    return Response(
        {
          "info":f"notifications state of {request.user.username} are updated successfully"
        },
        status=status.HTTP_201_CREATED
    )


# @api_view(["GET"])
# def animes_questions_api_service(requst, anime_id, n_questions):
    
#     anime = GetOrFetchAnime(anime_id)

#     serialized_questions = QuestionsApiService(
#         anime.anime_questions.filter(active=True)[:n_questions],
#         many=True
#     )
#     return Response({
#         "data": serialized_questions.data,
#     })

