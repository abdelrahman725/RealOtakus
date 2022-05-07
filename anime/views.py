from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.contrib import messages
from django.urls import reverse
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse


from board.models import *
from board.helpers import login_required, ValidatePassword



def MainRequest(request):
  if request.user.is_authenticated:
    return redirect("/home")
  return render(request, "board/home.html")


def Register(request):
  if request.method == "POST":

    username = request.POST["registerusername"]
    password= request.POST["registerpassword"]
    confirmed_password= request.POST["confirmpassword"]
    if password != confirmed_password:
      messages.warning(request, 'must match')
      return HttpResponseRedirect(reverse("welcome"))

    else:
      try:
        user = User.objects.create_user(username=username,password=password)
        user.save()
        login(request, user)
      except IntegrityError:
        messages.warning(request, 'username already exists')

  return HttpResponseRedirect(reverse("welcome"))



def Login(request):
  if  request.method == "POST":
    username = request.POST["username"]
    password= request.POST["password"]
    user = authenticate(request,username=username,password=password)
    if user is not None:
      login(request,user)
      return redirect("/home")
    else:
      messages.error(request, 'wrong username or password')
 
  return HttpResponseRedirect(reverse("welcome"))
    
  


def Logout(request):
  logout(request)
  list(messages.get_messages(request))
  return HttpResponseRedirect(reverse("welcome"))