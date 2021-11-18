from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.contrib import messages
from django.urls import reverse
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, generics

import json,math,re

from itertools import chain

from .models import *
from .serializers import *
from .helpers import login_required, ValidatePassword

@login_required
@api_view(["GET"])
def GetUserData(request):
  serialized_data = UserSerializer(request.user,many=False)
  return Response(serialized_data.data)

class GetUsers(generics.ListAPIView):
  queryset = User.objects.exclude(pk=1).exclude(points=0).order_by('-points')[:10]
  serializer_class = UserSerializer


@login_required
@api_view(["GET"])
def GetAvailableAnimes(request):
  AnimesWithQuestions = Anime.objects.filter(anime_question__isnull=False).distinct()
  serialized_data = AnimeSimpleSerializer(AnimesWithQuestions,many=True)
  return Response(serialized_data.data)


@login_required
@api_view(["GET"])
def GetAnimeOrdered(request):
  sorted_animes = (Anime.objects.filter(anime_question__isnull=False).distinct()).order_by('-total_score')
  serialized_data = AnimeSerializer(sorted_animes,many=True)
  return Response(serialized_data.data)




@login_required
@api_view(["POST"])
def GetTest(request):
  selected_animes=request.data["selectedanimes"]
  questions=[]
  for anime in selected_animes:
    EachAnime_4_Questions=Question.objects.filter(anime=anime["id"])[:4]
    questions.append(EachAnime_4_Questions)
  final_questions = list(chain(*questions))
  
  serialized_data = QuestionSerializer(final_questions,many=True)
  return Response(serialized_data.data)


@login_required
@api_view(["POST"])
def CheckTest(request):
  answers = request.data["results"]
  questions_length = request.data["questionslength"]
  test_score = 0
  for Id, user_answer in answers.items():
    question = Question.objects.get(pk=Id) 
    if question.right_answer == user_answer:
      test_score+=1
      anime = Anime.objects.get(pk=question.anime.id)
      anime.total_score+=1
      anime.save()


  current_user = request.user
  current_user.TestsCount+=1
  passed = False
  if test_score >= math.ceil(questions_length/2):
    passed=True
    current_user.points += test_score
  

  
  if current_user.points >=200:
    current_user.level = "real otaku"

  elif current_user.points >=100:
    current_user.level = "intermediate"

  current_user.save()

  return JsonResponse({"message": "test answers have been received","passed":passed,"testscore":test_score}, status=201)






@login_required
@api_view(["PUT"])
def UpdatePoints(request):
  current_user= request.user
  if current_user:
    new_points = int(request.data["points"])

    current_user.TestsCount+=1
    current_user.points = new_points
    
    if new_points > 1000:
      current_user.level = "advanced"
    elif new_points > 200:
      current_user.level = "intermediate" 

    current_user.save()

    return JsonResponse({"message": "user points updated successfully"}, status=201)
    print()
    print(f"{request.user.username} has submitted the test")
    print()

  return JsonResponse({"message": "error"}, status=201)

@api_view(["POST"])
def Register(request):
  registration_data = request.data["registerdata"]
  username= registration_data["registername"]
  country = registration_data["country"]
  password = registration_data["pass1"]
  confirmation = registration_data["pass2"]

  if password != confirmation or not ValidatePassword(password):
    return JsonResponse({"msg":"passwords must be matching"},status=401)
   # Attempt to create new user
  try:
      user = User.objects.create_user(username=username,password=password,country=country)
      user.save()
      login(request, user)
  except IntegrityError:
      return JsonResponse({"msg": "Username already taken"},status=401)

  
  return JsonResponse({"msg": "registered","info":1}, status=201)


@api_view(["POST"])
def Login(request):
  logindata = request.data["logindata"]
  username = logindata["name"]
  password = logindata["pass"]
  user = authenticate(request,username=username,password=password)
  if user is not None:
    login(request,user)
    return Response({"msg": "success"}, status=status.HTTP_200_OK)

  return Response({"msg": "wrong password or username"}, status=401)

@api_view(["GET"])
def Logout(request):
  logout(request)
  return JsonResponse({"msg": "Loged Out!"}, status=200)
