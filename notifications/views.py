from django.db.models import Q

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from notifications.models import Notification
from notifications.serializers import NotificationsSerializer

@api_view(["GET"])
def get_notifications(request):
    user = request.user

    user_notifications = NotificationsSerializer(
        Notification.non_expired.filter(
            (Q(receiver=user) | Q(broad=True)) & Q(time__gt=user.date_joined)
        ),
        many=True,
    )
    return Response(user_notifications.data)


@api_view(["PUT"])
def mark_notifications_as_read(request):
    user = request.user
    user.notifications.filter(pk__in=request.data["notifications"]).update(seen=True)
    return Response(
        {"info": f"notifications updated successfully"},
        status=status.HTTP_204_NO_CONTENT,
    )
