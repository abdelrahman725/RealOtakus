from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.contrib import messages
from django.urls import reverse
import re
import json
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from .models import *
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
  return render(request,"index.html",
  {
    "LogedUser":User.objects.get(pk= request.user.id)
  } )

class GetUsers(generics.ListAPIView):
  queryset = User.objects.exclude(pk=1).order_by('-points')[:10]
  serializer_class = UserSerializer


# def UserData(request):
#   #user's top 3 animes based on his score in each of them

#   AnimeScore.objects.filter(user=request.user).order_by('-score')[:3]
  

class GetAllAnimes(generics.ListAPIView):
  queryset = Anime.objects.all()
  serializer_class = AnimeSerializer

@api_view(["GET"])
def GetTest(request,anime_ids):
  SelectedAnimes = map(int,re.split(",", anime_ids))
  selected_questions= Question.objects.filter(anime__id__in=SelectedAnimes)
  serialized_data = QuestionSerializer(selected_questions,many=True)
  return Response(serialized_data.data)




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
