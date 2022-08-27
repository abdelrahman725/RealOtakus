import random
from time import sleep

from django.db import connection, IntegrityError
from django.shortcuts import render, redirect
from django.forms import ValidationError
from django.db.models import Count, Q
from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .helpers import login_required, CheckLevel,CreateNotification
from .models import *
from .serializers import *
from .constants import *

# to see the corresponding sql queries that get executed when the relevant orm queryset gets executed
# for q in connection.queries:
#     print(f"\n\n { q } \n\n")


animes_dict = {}
game = {}
game_questions = {}

for anime in Anime.objects.all():
    animes_dict[anime.pk] = anime

def GetOrFetchAnime(anime):
    try:
        return animes_dict[anime]
    except KeyError:
        fetched_anime = Anime.objects.get(anime)
        animes_dict[anime] = fetched_anime
        return fetched_anime

def GetWantedUser(request):
    #return request.user
    username = "david"
    return User.objects.get(username=username)


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
        return Response({"countrycreated"}, status=status.HTTP_201_CREATED)

    serialized_basic_data = SimpleUserDataSerializer(user, many=False)

    serialized_notifications = NotificationsSerializer(
        user.getnotifications.all(), many=True)

    return Response({
        "user_data": serialized_basic_data.data,
        "notifications": serialized_notifications.data
    })


#@login_required
@api_view(["GET"])
def GetDashBoard(request):
        
    all_users = User.objects.exclude(points=0)
    
    current_highest_points = all_users.values_list("points",flat=True).order_by("-points")[:15]    
    top_users = all_users.filter(points__gte=min(current_highest_points))

    animes_mapper =  {}    

    for question in Question.objects.all():
        anime_name = GetOrFetchAnime(question.anime.id).anime_name
        try:
            anime  = animes_mapper[question.anime.id] 
            animes_mapper[question.anime.id] = {
                "anime_name" : anime_name,
                "total": anime["total"] + 1,
                "approved": anime["approved"] +1 if question.approved else anime["approved"],
                "pending": anime["pending"] +1 if not question.approved else anime["pending"]
            }
        except KeyError:
            animes_mapper[question.anime.id] = {
                "anime_name" : anime_name,
                "total":1,
                "approved": 1 if question.approved else 0,
                "pending": 1 if not question.approved else 0
            }

    LeaderBorad = LeaderBoradSerializer(top_users, many=True)
    
    return Response({
        "leaderboard": LeaderBorad.data,
        "animes": animes_mapper
    })

# -------------------------------------- Quiz related endpoints ----------------------------------------


##@login_required
@api_view(["GET"])
def GetQuizeAnimes(request):

    user = GetWantedUser(request)
    animes_with_questions = Anime.objects.annotate(
        quiz_questions_count=Count("anime_questions",
        filter=(Q(anime_questions__approved=True) &
        ~Q(anime_questions__contributor=user)))
        ).filter(quiz_questions_count__gte=QUESTIONSCOUNT)


    user_games_dict = {}
    for game in Game.objects.filter(game_owner=user).select_related("anime"):
        user_games_dict[game.anime.id] = game.gamesnumber
    

    serialized_animes = QuizAnimesSerializer(animes_with_questions, many=True)

    return Response({
        "animes": serialized_animes.data,
        "games": user_games_dict
    })


#@login_required
@api_view(["GET"])
def GetTest(request, game_anime):
    current_user = GetWantedUser(request)
    selected_anime = animes_dict[game_anime]
    current_user.tests_started += 1
    current_user.save()

    CurrentGame, created = Game.objects.get_or_create(
        game_owner=current_user,
        anime=selected_anime
    )

    index = CurrentGame.gamesnumber * QUESTIONSCOUNT
    # to delete later : 
    index = 0

    # current game questions
    questions = selected_anime.anime_questions.filter(approved=True).exclude(
        contributor=current_user).order_by("id")[index:index+QUESTIONSCOUNT]

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
  
    CurrentGame.gamesnumber += 1
    game[current_user.id] = CurrentGame
    CurrentGame.save()

    return Response(serialized_questions)


#@login_required
@api_view(["POST"])
def SubmitTest(request):
    user = GetWantedUser(request)
    test_score = 0
    test_results = request.data["results"]
    questions = game_questions[user.id]

    # record test results
    for q in test_results:
        Q = questions[int(q)]

        if test_results[q] == Q.right_answer:
            Q.correct_answers += 1
            test_score += 1

        else:
            Q.wrong_answers += 1
        Q.save()


    user.points += test_score
    # after that increase in points now check user level
    CheckLevel(user)
    user.tests_completed += 1
    user.save()

    CurrentGame = game[user.id]
    CurrentGame.score += test_score
    CurrentGame.save()

    answers_dict = {}

    for key in game_questions[user.id]:
        answers_dict[key] = game_questions[user.id][key].right_answer

    # deleteing used cache from memory :
    del game_questions[user.id]
    del game[user.id]

    return JsonResponse({"message": "test submitted successfully", "newscore": test_score, "rightanswers": answers_dict, "level": user.level})



# ------------------------------------------------------------------------------------


#@login_required
@api_view(["GET"])
def GetAllAnimes(request):
    serialized_data = AnimeSerializer(animes_dict.values(), many=True)
    return Response(serialized_data.data)


#@login_required
@api_view(["POST"])
def MakeContribution(request):
    user = GetWantedUser(request)

    try:
        anime = animes_dict[int(request.data["anime"])]
    except:
        return JsonResponse({"anime doesn't exist"})

    QuestionOBject = request.data["question"]

    actualquestion = QuestionOBject["question"]
    c1 = QuestionOBject["choice1"]
    c2 = QuestionOBject["choice2"]
    c3 = QuestionOBject["choice3"]
    right_answer = QuestionOBject["rightanswer"]

# check if the contributer user is already a reviewer of the anime associated with the question

    is_anime_reviewr = False
    if anime in user.animes_to_review.all():
        is_anime_reviewr = True

    try:
        Question.objects.create(
            anime=anime,
            contributor=user,
            approved=is_anime_reviewr,
            question=actualquestion, 
            right_answer=right_answer,
            choice1=c1,
            choice2=c2,
            choice3=c3
        )

        if is_anime_reviewr:
            return JsonResponse({
                "message": f"you have contributed a new question for {anime}! it's approved since you are a reviewer of that anime"
            })

        # sleep(1)
        return Response(
            {"message": f"your question submission for {anime} has been received and waits approval"}, 
            status = status.HTTP_201_CREATED
            )
        #return JsonResponse()

    except IntegrityError as e:
        if 'UNIQUE constraint' in str(e.args):
            return JsonResponse({"message": "sorry this question already exist"})

        return JsonResponse({"message": e.args}) 
    
    except ValidationError as e:

        return JsonResponse({"message": e.args[0]})


#@login_required
@api_view(["POST"])
def ReviewContribution(request):
    state = request.data["state"]
    q_id = int(request.data["question"])

    try:
        question = Question.objects.get(pk=q_id)
  
        if state == "approve":
            question.approved = True
            question.save()
            return Response({"question got approved successfully"}, status=status.HTTP_200_OK)
        
        if state == "decline":

            #feedback = request.data["reviwer_feedback"]
            CreateNotification(
                user=question.contributor,
                content=f"feedback sorry your last question for {GetOrFetchAnime(question.anime.id).anime_name} has been rejected by reviewers"
            )
            question.delete()

            return Response({"question is deleted successfully"}, status=status.HTTP_200_OK)

    except Question.DoesNotExist:
        return Response({"sorry this question doesn't exist anymore"}, status=status.HTTP_404_NOT_FOUND)


#@login_required
@api_view(["GET"])
def GetMyProfile(request):
    user = GetWantedUser(request)

    all_user_data = AllUserDataSerializer(user, many=False)
    
    questions_for_review = []
    if user.animes_to_review.exists():

        questions_for_review = QuestionSerializer(
            Question.objects.filter(
                    ~Q(contributor=user),
                    approved=False, 
                    anime__in=user.animes_to_review.all()
                    ).select_related("anime"),
                many=True)

    user_contributions = QuestionSerializer(
        user.contributions.all().select_related("anime"),
        many=True)

    user_animes_scores = GameSerializer(
        Game.objects.filter(
            game_owner=user,
            gamesnumber__gt=0
        ).select_related("anime"),
        many=True
    )    

    return Response({
        "data": all_user_data.data,
        "questionsForReview": questions_for_review.data if questions_for_review else [], 
        "UserContributions" : user_contributions.data,
        "UserAnimeScores"   : user_animes_scores.data
    })


#@login_required
@api_view(["PUT"])
def UpdateNotificationsState(request):
    user = GetWantedUser(request)
    
    user.getnotifications.filter(pk__in=request.data["notifications"]).update(seen=True)
    
    return Response(
        {f"notifications state of {request.user.username} are updated successfully"},
        status=status.HTTP_201_CREATED
    )

