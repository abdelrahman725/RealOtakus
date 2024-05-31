from rest_framework import serializers

from notifications.models import Notification


class NotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "notification", "kind", "time", "seen")
