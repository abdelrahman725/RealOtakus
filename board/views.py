from django.shortcuts import render, redirect
from django.http import  JsonResponse
from django.db import connection
from django.db.models import Count,Q

from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import random
from datetime import datetime

from .models import *
from .serializers import *
from .helpers import login_required 

animes_dict = {}


game = {}
game_questions = {}



for anime in Anime.objects.all():
  animes_dict[anime.pk] = anime


def DevelopmentUser(): return User.objects.get(pk=28)

def Random():
  return random.randint(1, 4)


@login_required
def ReactApp(request):
  return redirect("http://localhost:3000/home")
  #return render(request, "index.html")

#@login_required
@api_view(["GET"])
def GetUserData(request):
  serialized_basic_data = BasicUserSerializer(DevelopmentUser(),many=False)
  serialized_notifications= NotificationsSerializer(Notification.objects.filter(owner=DevelopmentUser()) ,many=True)
  return Response({
     "user_data": serialized_basic_data.data,
     "notifications": serialized_notifications.data,
    })



#@login_required
@api_view(["GET"])
def AllCompetitors(request):
  otakus = User.objects.exclude(pk=1).order_by('-points')
  serialized_data = DashBoardSerializer(otakus,many=True)
  return Response(serialized_data.data)


# -------------------------------------- Test Handling functions ----------------------------------------
  
@api_view(["GET"])
def GetAvailableAnimes(request):
  AnimesWithQuestions = Anime.objects.annotate(num_questions=Count("anime_questions")).filter(num_questions__gte=4)
  serialized_data = AnimeSerializer(AnimesWithQuestions,many=True)
  return Response(serialized_data.data)


#@login_required
@api_view(["GET"])
def GetTest(request,game_anime):
  current_user =  DevelopmentUser()
  selected_anime = animes_dict[game_anime]
  current_user.tests_started+=1
  current_user.save()

  questions=selected_anime.anime_questions.filter(approved=True).exclude(contributor=current_user)[:5]
  
  #  number of approved question for the selected anime : 
  if questions.count() <5:
    return JsonResponse({"msg":"sorry not enough questions"})
  
  CurrentGame, created = Game.objects.get_or_create(game_owner=current_user,anime=selected_anime)

  index = CurrentGame.gamesnumber

  CurrentGame.gamesnumber+=1
  game[current_user.id] = CurrentGame
  CurrentGame.save() 
  
  game_questions[current_user.id] ={}

  for q in questions:
    game_questions[current_user.id][q.id] = q

  print(game_questions[current_user.id])
  serialized_data = QuestionSerializer(questions,many=True)
  return Response(serialized_data.data)




#@login_required
@api_view(["POST"])
def SubmitTest(request):
  user =  DevelopmentUser()
  test_score = 0
  test_results = request.data["results"]
  
  #review = request.data["review"]

  questions =game_questions[user.id]
  answers = AnswersSerializer(questions.values(),many=True).data

  for q in test_results:
    Q=questions[int(q)]
    
    if test_results[q] == Q.right_answer:
      Q.correct_answers+=1
      user.points+=1
      test_score+=1

    else:
      Q.wrong_answers+=1
    Q.save()
  

  previous_level = user.level

  if user.points >=3000:
    user.level = "realOtaku" 

  elif user.points >= 1000:
    user.level  = "advanced"
  elif user.points >= 200:
    user.level = "intermediate"

  # level up the user by pushing a notfication 
  if previous_level != user.level :
    Notification.objects.create(owner=DevelopmentUser(),notification=f"Level up to {user.level}! good work")



  user.tests_completed+=1
  CurrentGame= game[user.id]
  CurrentGame.score += test_score
  #in order for a user to be responsible for reviewing an anime he must first have at least one contribution for that anime 

  if  CurrentGame.score >= 10 and CurrentGame.anime not in DevelopmentUser().animes_to_review.all():
      if CurrentGame.anime.anime_questions.filter(contributor=DevelopmentUser()):
          user.animes_to_review.add(CurrentGame.anime)



  CurrentGame.save()
  user.save()

  # deleteing used cache from memory : 
  del game_questions[user.id]
  del game[user.id]


  return JsonResponse({"message": "test submitted successfully","score":test_score,"answers":answers, "level":user.level})


# ------------------------------------------------------------------------------------


@api_view(["GET"])
def GetAllAnimes(request):
  serialized_data = AnimeSerializer(animes_dict.values(),many=True)
  return Response(serialized_data.data)


#@login_required
@api_view(["POST"])
def MakeContribution(request):

  anime = animes_dict[int(request.data["anime"])]
  ContributedQ=request.data["question"]

  right_answer=ContributedQ["rightanswer"]
  actualquestion = ContributedQ["question"]

  c1=ContributedQ["choice1"]
  c2=ContributedQ["choice2"]
  c3=ContributedQ["choice3"]
  c4=right_answer

  random_number = Random()

  if random_number == 1:
    c4=c3
    c3=right_answer
  
  if random_number == 2:
    c4=c2
    c2=right_answer

  if random_number == 3:
    c4=c1
    c1=right_answer

# check if the contributer user is already a reviewer of the anime associated with the question 
  is_anime_reviewr = False
  if anime in DevelopmentUser().animes_to_review.all():
    is_anime_reviewr=True

  Question.objects.create(anime=anime,contributor= DevelopmentUser(),approved=is_anime_reviewr,
  question=actualquestion,right_answer=right_answer,choice1=c1,choice2=c2,choice3=c3,choice4=c4)

  return JsonResponse({"message": f"new question has been added by {DevelopmentUser().username} and waits approval"})




@api_view(["GET"])
def GetMyProfile(request):
  my_data = AllUserInfo_Serializer(DevelopmentUser(),many=False)
  my_pending_contributions = QuestionSerializer(Question.objects.filter(contributor=DevelopmentUser(),approved=False),many=True)
  
  #pending questions for the user to review and approve if any
  pending_reviews = QuestionSerializer(Question.objects.filter(approved=False,anime__in=DevelopmentUser().animes_to_review.all()),many=True)
  

  # animes with contributed questions made by current user : 
  contributed_animes=Anime.objects.filter(anime_questions__contributor=DevelopmentUser(),anime_questions__approved=True).distinct()  
  animes = AnimeSerializer(contributed_animes,many=True)

  return Response({
     "data": my_data.data,
     "pending_contributions": my_pending_contributions.data,
     "pending_reviews":pending_reviews.data,
     "animes":animes.data
    })



# str_repr = repr()
# connection.queries:


#Anime.objects.annotate(approved_questions=Count("anime_questions",filter=Q(anime_questions__approved=True))).filter(approved_questions__gte=4)
