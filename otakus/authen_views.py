from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect, csrf_exempt

from rest_framework import status
from rest_framework.decorators import api_view,  permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from otakus.models import User


@ensure_csrf_cookie
@api_view(["GET"])
@permission_classes([AllowAny])
def send_csrf_token_to_client(request):
  return Response({"info" : "csrf token is set"})


@api_view(["POST"])
@permission_classes([AllowAny])
def user_register(request):
  if request.user.is_authenticated:
    return Response({"info":f"already logged in as {request.user.username}"})

  username = request.data["username"].strip()
  email = request.data["email"].strip()
  user_country = request.data["country"]
  user_password = request.data["password"]

  try:
    new_otaku_user = User.objects.create_user(
      username=username,
      email=email,
      password=user_password,
      country=user_country
    )

    new_otaku_user.save()
    login(request, new_otaku_user)

    return Response({"info":"registered successfully"},status=status.HTTP_201_CREATED)
  
  except IntegrityError:
    return Response({"info":"username already exists"},status=status.HTTP_403_FORBIDDEN)
      

@api_view(["POST"])
@permission_classes([AllowAny])
def user_login(request):

  if request.user.is_authenticated:
    return Response({"info":f"already logged in as {request.user.username}"})

  username = request.data["username"]
  password= request.data["password"]
  user = authenticate(request, username=username, password=password)
  
  if user is not None:
    login(request,user)
    return Response({"info":"successfull login"})

  return Response({"info":"wrong username or password"}, status=status.HTTP_403_FORBIDDEN) 


@api_view(["DELETE"])
def user_logout(request):
  logout(request)
  return Response({"info":"logged out successfully"})
