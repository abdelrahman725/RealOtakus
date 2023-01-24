from django.db import IntegrityError
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from board.models import User
from board.helpers import login_required


def user_register(request):

  if request.method == "POST":

    username = request.POST["username"].strip()
    email = request.POST["email"].strip()
    user_password = request.POST["password"]
    
    if len(user_password) < 6:
      messages.error(request, 'password is too short, min length is 6')
      return redirect("/")
  
    try:
      new_user = User.objects.create_user(
        username=username,
        email=email,
        password=user_password
      )

      new_user.save()
      login(request, new_user)
    
    except IntegrityError:
      messages.error(request, 'username already exists !')
    
  return redirect("/")


def user_login(request):
  if request.method == "POST":
    username = request.POST["username"]
    password= request.POST["password"]
    user = authenticate(request, username=username, password=password)
   
    if user is not None:
      login(request,user)
   
    else:
      messages.error(request, 'wrong username or password')
  
  return redirect("/")


@login_required
@api_view(["DELETE"])
def user_logout(request):
  logout(request)
  return Response({})
