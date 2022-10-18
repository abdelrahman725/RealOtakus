from django.db import IntegrityError
from django.contrib import messages
from django.urls import reverse
from django.shortcuts import render, redirect
from django.http import  HttpResponseRedirect

from django.contrib.auth import authenticate, login, logout

from board.models import *

def Register(request):

  if request.method == "POST":
    username = request.POST["registerusername"]
    email    = request.POST["email"]
    # to do check email
    password = request.POST["registerpassword"]
    confirmed_password= request.POST["confirmpassword"]
    if password != confirmed_password:
      messages.warning(request, 'must match')

    else:
      try:
        user = User.objects.create_user(
          username=username,
          password=password,
          email=email
        )
        user.save()
        login(request, user)
      except IntegrityError:
        messages.warning(request, 'username already exists')

  return HttpResponseRedirect(reverse("home"))


def Login(request):
  if request.method == "POST":
    username = request.POST["username"]
    password= request.POST["password"]
    user = authenticate(request,username=username,password=password)
    if user is not None:
      login(request,user)
    else:
      messages.error(request, 'wrong username or password')
  return HttpResponseRedirect(reverse("home"))


def Logout(request):
  logout(request)
  list(messages.get_messages(request))
  return HttpResponseRedirect(reverse("home"))
