from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, generics

import json

from .models import *
from .serializers import *
from .helpers import login_required 

def DevelopmentUser(): return User.objects.get(pk=28)


# render react build page
@login_required
def ReactApp(request):
  #return redirect("http://localhost:3000/home")
  return render(request, "index.html")


@api_view(["GET"])
def GetUserData(request):
  serialized_data = UserSerializer(DevelopmentUser(),many=False)
  return Response(serialized_data.data)

  

@api_view(["GET"])
def GetAvailableAnimes(request):
  AnimesWithQuestions = Anime.objects.filter(anime_question__isnull=False).distinct()
  
  serialized_data = AnimeSerializer(AnimesWithQuestions,many=True)
  return Response(serialized_data.data)


@api_view(["GET"])
def AllCompetitors(request):
  otakus = User.objects.exclude(pk=1).exclude(points=0).order_by('-points')
  serialized_data = UserSerializer(otakus,many=True)
  return Response(serialized_data.data)



@api_view(["POST"])
def TestPost(request):
  return JsonResponse({"message": "oka ya gamd"})



# @login_required
# @api_view(["GET"])
# def GetAnimeOrdered(request):
#   sorted_animes = (Anime.objects.filter(anime_question__isnull=False).distinct()).order_by('-total_score')
#   serialized_data = AnimeSerializer(sorted_animes,many=True)
#   return Response(serialized_data.data)



@login_required
@api_view(["POST"])
def GetTest(request):
  current_user = request.user
  current_user.tests_started+=1
  current_user.save()
  selected_anime= Anime.objects.get(anime_name=request.data["selectedanime"])
  questions=selected_anime.anime_questions.all()
  serialized_data = QuestionSerializer(questions,many=True)
  return Response(serialized_data.data)

