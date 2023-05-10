from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db.models import Q

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from otakus.serializers import UserDataSerializer
from otakus.serializers import NotificationsSerializer

from otakus.models import User
from otakus.models import Notification


@ensure_csrf_cookie
@api_view(["GET"])
@permission_classes([AllowAny])
def send_csrf_token_to_client(request):
    return Response({"info": "csrf token is set"})


@api_view(["POST"])
@permission_classes([AllowAny])
def user_register(request):
    if request.user.is_authenticated:
        return Response({"info": f"already logged in as {request.user.username}"})

    username = request.data["username"].strip()
    email = request.data["email"].strip()
    user_country = request.data["country"]
    user_password = request.data["password"]

    if User.objects.filter(username=username).exists():
        return Response(
            {"info": f"username {username} already exists"},
            status=status.HTTP_403_FORBIDDEN,
        )

    new_otaku = User.objects.create_user(
        username=username, email=email, password=user_password, country=user_country
    )

    new_otaku_data = UserDataSerializer(
        User.otakus.values(
            "id",
            "username",
            "email",
            "points",
            "level",
            "tests_started",
            "tests_completed",
            "level",
            "country",
        ).get(id=new_otaku.id)
    ).data

    new_otaku_data["is_reviewer"] = False

    login(request, new_otaku)

    return Response(
        {
            "info": "registered successfully",
            "user_data": new_otaku_data,
            "notifications": [],
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def user_login(request):
    if request.user.is_authenticated:
        return Response({"info": f"already logged in as {request.user.username}"})

    username = request.data["username"]
    password = request.data["password"]
    user = authenticate(request, username=username, password=password)

    if user is not None:
        otaku_data = UserDataSerializer(
            User.otakus.values(
                "id",
                "username",
                "email",
                "points",
                "level",
                "tests_started",
                "tests_completed",
                "level",
                "country",
            ).get(id=user.id)
        ).data

        otaku_data["is_reviewer"] = user.animes_to_review.exists()

        user_notifications = NotificationsSerializer(
            Notification.non_expired.filter(Q(receiver=user) | Q(broad=True)), many=True
        )

        login(request, user)

        return Response(
            {
                "info": "successfull login",
                "user_data": otaku_data,
                "notifications": user_notifications.data,
            }
        )

    return Response(
        {"info": "wrong username or password"},
        status=status.HTTP_403_FORBIDDEN,
    )


@api_view(["DELETE"])
def user_logout(request):
    logout(request)
    return Response({"info": "logged out successfully"})


@api_view(["DELETE"])
def delete_account(request):
    user = request.user
    user.delete()

    return Response({"info": "account deleted_successfully"})
