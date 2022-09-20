import random
from time import sleep

from django.db import connection, IntegrityError
from django.shortcuts import render, redirect
from django.forms import ValidationError
from django.db.models import Count, Q
from django.http import JsonResponse
from django.utils import timezone

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from board.helpers import login_required,CreateNotification
from board.models import *
from board.serializers import *
from board.constants import *

# to see the corresponding sql queries that get executed when the relevant orm queryset gets executed
# for q in connection.queries:
#     print(f"\n\n { q } \n\n")

animes_dict = {}

game_questions = {}

for anime in Anime.objects.all():
    animes_dict[anime.pk] = anime


def GetOrFetchAnime(anime : int):
    try:
        return animes_dict[anime]
    except KeyError:
        fetched_anime = Anime.objects.get(anime)
        animes_dict[anime] = fetched_anime
        return fetched_anime

def GetWantedUser(request):
    #return request.user
    return User.objects.get(username="david")


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
        return Response(
            {"countrycreated"},
            status=status.HTTP_201_CREATED
        )

    serialized_basic_data = SimpleUserDataSerializer(user, many=False)

    serialized_notifications = NotificationsSerializer(
        user.getnotifications.all(),
        many=True
    )

    return Response({
        "user_data": serialized_basic_data.data,
        "notifications": serialized_notifications.data
    })



#@login_required
@api_view(["GET"])
def GetAllAnimes(request):
    serialized_data = AnimeSerializer(animes_dict.values(), many=True)
    return Response(serialized_data.data)



#@login_required
@api_view(["GET"])
def GetDashBoard(request):

    all_users = User.objects.exclude(points=0).annotate(
        n_contributions=Count("contributions",filter=(Q(contributions__approved=True)))
    )
   
    current_highest_score = all_users.values_list("points",flat=True).order_by("-points")

    top_users = all_users.filter(points__gte=min([0] if not all_users else current_highest_score))
    LeaderBorad = LeaderBoradSerializer(top_users, many=True)
    

    #animes_mapper =  {}    
    # for question in Question.objects.all():
    #     anime_name = GetOrFetchAnime(question.anime.id).anime_name
    #     try:
    #         anime  = animes_mapper[question.anime.id] 
    #         animes_mapper[question.anime.id] = {
    #             "anime_name" : anime_name,
    #             "total": anime["total"] + 1,
    #             "approved": anime["approved"] +1 if question.approved else anime["approved"],
    #             "pending": anime["pending"] +1 if not question.approved else anime["pending"]
    #         }
    #     except KeyError:
    #         animes_mapper[question.anime.id] = {
    #             "anime_name" : anime_name,
    #             "total":1,
    #             "approved": 1 if question.approved else 0,
    #             "pending": 1 if not question.approved else 0
    #         }
    
    return Response({
        "leaderboard": LeaderBorad.data,
        "animes": {}
    })



# -------------------------------------- Quiz related endpoints ----------------------------------------

##@login_required
@api_view(["GET"])
def GetQuizeAnimes(request):

    user = GetWantedUser(request)
 
    game_animes = AnimeSerializer(
        Anime.objects.filter(active=True),
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
    current_user.tests_started += 1
    current_user.save()

    # this game questions
    questions=selected_anime.anime_questions.filter(
            ~Q(contribution__contributor=current_user),
            ~Q(contribution__reviewer=current_user),
            #active=True
        ).exclude(
            pk__in=current_user.questions_interacted_with.values_list('question__pk', flat=True)
        )[:QUESTIONSCOUNT]

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

    return Response(serialized_questions)


#@login_required
@api_view(["POST"])
def SubmitTest(request):
    user = GetWantedUser(request)
    test_score = 0
    test_results = request.data["results"]
    questions = game_questions[user.id]

    # record test results
    Answers = []
    for q in test_results:
        quiz_question = questions[int(q)]
        
        correct_answer = test_results[q] == quiz_question.right_answer
        
        if correct_answer:
            quiz_question.correct_answers += 1
            test_score += 1

        else:
            quiz_question.wrong_answers += 1
        
        quiz_question.save()

        Answers.append(QuestionInteraction(user=user,question = quiz_question, anime=quiz_question.anime, correct = correct_answer))
        

    QuestionInteraction.objects.bulk_create(Answers)

    user.points += test_score
    user.tests_completed += 1
    user.save()

    answers_dict = {}

    for key in game_questions[user.id]:
        answers_dict[key] = game_questions[user.id][key].right_answer

    # deleteing used cache from memory :
    del game_questions[user.id]


    return JsonResponse({"message": "test submitted successfully", "newscore": test_score, "rightanswers": answers_dict, "level": user.level})

# ------------------------------------------------------------------------------------



#@login_required
@api_view(["POST"])
def MakeContribution(request):
    user = GetWantedUser(request)

    try:
        anime = GetOrFetchAnime(int(request.data["anime"]))
    except:
        return JsonResponse({"anime doesn't exist"})

    QuestionOBject = request.data["question"]

    is_anime_reviewr = anime in user.animes_to_review.all()   

    try:
        new_question=Question.objects.create(
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
            approved= True if is_anime_reviewr else None
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


# To Do !
#@login_required
@api_view(["POST"])
def ReviewContribution(request):
    user = GetWantedUser(request)
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

        if feedback: question.contribution.reviewer_feedback = feedback
        
        question.contribution.reviewer = user
        question.contribution.date_reviewed = timezone.now() 
        
        sleep(1)

        if review_state == 1:
            question.contribution.approved = True
            question.contribution.save()

            question.contribution.contributor.points +=10
            question.contribution.contributor.save()

            question.active = True
            question.save()
            CreateNotification(
                receiver=question.contribution.contributor,
                notification=f"Congratulations! your contribution for {question.anime.anime_name} is approvd",
                kind="A"
            )
            
            return Response({
                "question is approved successfully"
            })    

        if review_state == 0:
            question.contribution.approved = False
            question.contribution.save()
            
            CreateNotification(
                receiver=question.contribution.contributor,
                notification=f"Sorry your contribution for {question.anime.anime_name} is rejected",
                kind="F"
            )
            return Response({
                "question is rejected successfully"
            })
        
        
    except Question.DoesNotExist:
        return Response(
            {"this question doesn't exist anymore, probably is deleted"},
            status=status.HTTP_410_GONE
        )


#@login_required
@api_view(["GET"])
def GetMyProfile(request):
    user = GetWantedUser(request)

    all_user_data = AllUserDataSerializer(user, many=False)
    
    questions_for_review = []
    if user.animes_to_review.exists():
        questions_for_review = QuestionSerializer(
            Question.objects.filter(
                    ~Q(contribution__contributor=user),
                    anime__in=user.animes_to_review.all(),
                    contribution__isnull=False,
                    contribution__approved__isnull=True,
            ).select_related("anime"),
        many=True
        )

    user_contributions = QuestionSerializer(
        Question.objects.filter(
            contribution__contributor=user
        ).select_related("anime"),
    many=True
    )
    

    return Response({
        "data": all_user_data.data,
        "questionsForReview": questions_for_review.data if questions_for_review else [], 
        "UserContributions" : user_contributions.data,
     
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
