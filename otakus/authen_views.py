from django.contrib.auth import authenticate, login, logout
from django.db.models import Q

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from otakus.serializers import UserDataSerializer
from otakus.serializers import NotificationsSerializer

from otakus.models import User
from otakus.models import Notification


@api_view(["POST"])
@permission_classes([AllowAny])
def user_register(request):
    if request.user.is_authenticated:
        return Response({"info": f"already logged in as {request.user.username}"})

    username = request.data["username"].strip()
    email = request.data["email"].strip()
    user_password = request.data["password"]

    if User.objects.filter(username=username).exists():
        return Response(
            {"info": f"username already exists"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    new_otaku = User.objects.create_user(
        username=username, email=email, password=user_password
    )

    new_otaku_data = UserDataSerializer(new_otaku).data

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

    if user and not user.is_superuser:
        otaku_data = UserDataSerializer(user).data

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
        {"info": "User not found"},
        status=status.HTTP_401_UNAUTHORIZED,
    )


@api_view(["DELETE"])
def user_logout(request):
    logout(request)
    return Response({"info": "logged out successfully"})


@api_view(["DELETE"])
def delete_account(request):
    user = request.user
    # to prevent admin from accidentally calling this endpoint
    if user.is_superuser:
        return Response(
            {"info": "unsupported action"}, status=status.HTTP_403_FORBIDDEN
        )
    user.delete()
    return Response({"info": "account deleted successfully"})
