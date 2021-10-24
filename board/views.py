from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.contrib import messages
from django.urls import reverse
import re
import json
from itertools import chain
# from django.views.decorators.csrf import requires_csrf_token, csrf_exempt
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from .models import *
from .models import AnimeScore
from .serializers import *
from .helpers import login_required



#rendering django template
def LoginRegister(request):
  if request.user.is_authenticated:
    return redirect("mainreact")
    
  return render(request,"board/intro.html")

#rendering react page
@login_required
def React(request):
  return render(request,"index.html")

class GetUsers(generics.ListAPIView):
  queryset = User.objects.exclude(pk=1).order_by('-points')[:10]
  serializer_class = UserSerializer

@login_required
@api_view(["GET"])
def UserData(request):
  userdata = request.user
  serialized_data = UserSerializer(userdata,many=False)

  return Response(serialized_data.data)


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
    try:
      potential_anime = AnimeScore.objects.get(user=current_user.id,anime=anime["id"])
      potential_anime.score+= int(anime["score"])
      #potential_anime.TestsCount+=1
      potential_anime.save()
    except:
      new_anime_score = AnimeScore(user = current_user,anime=Anime.objects.get(pk=
      anime["id"]),score=int(anime["score"]))
      #new_anime_score.TestsCount=1

      new_anime_score.save()

  return JsonResponse({"message": "animes scores are updated"}, status=201)


def Register(request):
  if request.method == "POST":
      username = request.POST["registerusername"]
      # Ensure password matches confirmation
      password = request.POST["registerpassword"]
      confirmation = request.POST["registerconfirmpassword"]
      if password == confirmation:
      # Attempt to create new user
        try:
          user = User.objects.create_user(username,"",password)
          user.save()
          login(request, user)
          return redirect("mainreact")
        except IntegrityError:
          messages.warning(request, "exists")
          return redirect("LoginRegister")
      else:
        return redirect("LoginRegister")
        messages.warning(request, 'passwords are not matching ')


def Login(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["loginusername"]
        password = request.POST["loginpassword"]
        user = authenticate(request, username=username, password=password)
        # messages.success(request,user)

        # Check if authentication successful
        if user:
            login(request, user)
            messages.success(request, 'logged in.')    
            return redirect("mainreact")
        else:
            # messages.info(request, 'wrong password or username')
            return redirect("LoginRegister")
       
      
@login_required
def Logout(request):
    logout(request)
    return HttpResponseRedirect(reverse("LoginRegister"))
