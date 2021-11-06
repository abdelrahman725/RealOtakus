from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.contrib import messages
from django.urls import reverse
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, generics

import json
import re
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
def TopAnimes(request):
  #user's top 3 animes based on his score in each of them
  query =  list(AnimeScore.objects.filter(user=request.user).order_by('-score')[:3].values_list('anime',flat=True))
  UserTopAnimesNames = Anime.objects.filter(id__in=query)
  # serialized_data = AnimeScoreSerializer(UserTopAnimes,many=True)
  serialized_data = AnimeSerializer(UserTopAnimesNames,many=True)

  return Response(serialized_data.data)



@login_required
@api_view(["GET"])
def GetAllAnimes(request):
  AllAnimes=  Anime.objects.all()
  serialized_data = AnimeSerializer(AllAnimes,many=True)
  return Response(serialized_data.data)


# @login_required
# @api_view(["GET"])
# def GetTest(request,anime_ids):
#   SelectedAnimes = map(int,re.split(",", anime_ids))
#   AllQuestions = list()
#   slicing = 0
#   for Id in SelectedAnimes:
#     try:
#       potential_used_anime = AnimeScore.objects.get(anime=Id)
#       if potential_used_anime:
#         if potential_used_anime.TestsCount<=3:
#           slicing = (potential_used_anime.TestsCount) *4
#     except:
#       pass
#     EachAnime_4_Questions = Question.objects.filter(anime=Id)[slicing:slicing+4]
#     AllQuestions.append(EachAnime_4_Questions)
#   data = list(chain(*AllQuestions))
#   serialized_data = QuestionSerializer(data,many=True)
#   return Response(serialized_data.data)


@login_required
@api_view(["GET"])
def GetTest(request,anime_ids):
  SelectedAnimes = map(int,re.split(",", anime_ids))
  AllQuestions = list()
  for Id in SelectedAnimes:
    EachAnime_4_Questions = Question.objects.filter(anime=Id)[:4]
    AllQuestions.append(EachAnime_4_Questions)
  data = list(chain(*AllQuestions))
  serialized_data = QuestionSerializer(data,many=True)
  return Response(serialized_data.data)


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


@login_required
@api_view(["POST"])
def UpdateAnimesScores(request):
  current_user = request.user
  animes = request.data["AnimesResults"]

  for anime in animes:
    current_anime = Anime.objects.get(pk=anime["id"])
    try:
      potential_anime = AnimeScore.objects.get(user=current_user.id,anime=anime["id"])
      potential_anime.score+= int(anime["score"])
      potential_anime.TestsCount+=1
      potential_anime.save()
    except:
      new_anime_score = AnimeScore(user = current_user,anime=current_anime,score=int(anime["score"]))
      new_anime_score.TestsCount=1
      new_anime_score.save()

    current_anime.total_score+=int(anime["score"])
    current_anime.save()

  return JsonResponse({"message": "animes scores are updated"}, status=201)

@api_view(["POST"])
def Register(request):
  registration_data = request.data["registerdata"]
  username= registration_data["registername"]
  country = registration_data["country"]
  password = registration_data["pass1"]
  confirmation = registration_data["pass2"]

  if password != confirmation:
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
