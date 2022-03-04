from django.shortcuts import render, redirect
from django.http import  JsonResponse
from django.core.exceptions import ObjectDoesNotExist

from rest_framework.decorators import api_view
from rest_framework.response import Response

import json
import random
from datetime import datetime

from .models import *
from .serializers import *
from .helpers import login_required 

def DevelopmentUser(): return User.objects.get(pk=28)

def Random():
  return random.randint(1, 4)



# # render react build page
@login_required
def ReactApp(request):
  #return redirect("http://localhost:3000/home")
  return render(request, "index.html")


@api_view(["GET"])
def GetUserData(request):
  serialized_data = UserSerializer(request.user,many=False)
  return Response(serialized_data.data)

  

@api_view(["GET"])
def GetAvailableAnimes(request):
  AnimesWithQuestions = Anime.objects.filter(anime_questions__isnull=False).distinct()
  serialized_data = AnimeSerializer(AnimesWithQuestions,many=True)
  return Response(serialized_data.data)


@api_view(["GET"])
def AllCompetitors(request):
  otakus = User.objects.exclude(pk=1).exclude(points=0).order_by('-points')
  serialized_data = UserSerializer(otakus,many=True)
  return Response(serialized_data.data)



@api_view(["POST"])
def TestPost(request):
  return JsonResponse({"message": "successfull post request with its csrf token and this is the response"})

# ----------------------Test Handling functions  ----------------------
TestAnime = None
CurrentGame = None

@login_required
@api_view(["GET"])
def GetTest(request):
  current_user = request.user
  current_user.tests_started+=1
  current_user.save()
  TestAnime= Anime.objects.get(anime_name=request.data["selectedanime"])

  index=0
  try:
    CurrentGame = Game.objects.get(game_owner=current_user,anime=TestAnime)
    index = CurrentGame.gamesnumber
    
  except ObjectDoesNotExist:
    CurrentGame=Game.objects.create(game_owner=current_user,anime=TestAnime)
  
  CurrentGame.gamesnumber+=1
  CurrentGame.save()
    
  questions=TestAnime.anime_questions.filter(approved=True).exclude(contributor=current_user)[5*index:(5*index)+5]
  
  serialized_data = QuestionSerializer(questions,many=True)
  return Response(serialized_data.data)



@login_required
@api_view(["POST"])
def SubmitTest(request):
  user = request.user
  test_score = 0
  test_results = request.data["answers"]
  review = request.date["review"]

  for q in test_results:
    question=Question.objects.get(pk=int(q))
    if test_results[q] == question.right_answer:
      question.correct_answers+=1
      user.points+=1
      test_score+=1
    else:
      question.wrong_answers+=1
    question.save()
  
  user.tests_completed+=1
  CurrentGame.score += test_score
  if review:
    CurrentGame.review = review

  CurrentGame.save()
  user.save()
  return JsonResponse({"message": "test submitted successfully","test_score":test_score})


  # ----------------------------------------------------------------




@login_required
@api_view(["POST"])
def MakeContribution(request):
  anime=request.data["anime"]
  question=request.data["question"]
  right_answer=request.data["correct"]
  
  c1=request.data["choice_1"]
  c2=request.data["choice_2"]
  c3=request.data["choice_3"]
  c4=right_answer

  random_number = Random()

  if random_number == 1:
    c1=request.data["choice_3"]
    c2=request.data["choice_2"]
    c3=right_answer
    c4=request.data["choice_1"]

  if random_number == 2:
    c1=request.data["choice_1"]
    c2=right_answer
    c3=request.data["choice_3"]
    c4=request.data["choice_2"]

  if random_number == 3:
    c1=right_answer
    c2=request.data["choice_2"]
    c3=request.data["choice_3"]
    c4=request.data["choice_1"]

  new_question = Question(anime=anime,contributor=request.user,approved=False,
  
  question=question,right_answer=right_answer,choice1=c1,choice2=c2,choice3=c3,choice4=c4)
  new_question.save()
  return JsonResponse({"message": "new question has been added by a contributor and waits approval"})


@login_required
@api_view(["GET"])
def UserContributions(request):
  user_questions = Question.objects.filter(contributor=request.user)
  serialized_data = QuestionSerializer(user_questions,many=True)
  return Response(serialized_data.data)


@login_required
@api_view(["GET"])
def GetUserProfiel(request,user):
  requested_user = User.objects.get(pk=user)
  serialized_data = UserSerializer(requested_user)
  return Response(serialized_data.data)



@login_required
@api_view(["POST"])
def SharePost(request):
  post_content = request.data["post"]
  Post.objects.create(owner=request.user,post=post_content,time=datetime.now())
  return JsonResponse({"message": "you have shared a post successfully"})
