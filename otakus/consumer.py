import json

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from otakus.serializers import NotificationsSerializer


class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        current_user = self.scope["user"]
        self.room_name = "notifications"
        self.room_group_name = f"group_{current_user.id}"

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        
        async_to_sync(self.channel_layer.group_add)(
            "group_all",
            self.channel_name
        )

        self.accept()
        self.send(text_data=json.dumps({"status": "connection_established"}))

    def disconnect(self, *args, **kwargs):
        print("disconnected from the server")

    def send_notifications(self, event):
        notification_object = NotificationsSerializer(event.get("value"))
        self.send(text_data=json.dumps({"payload": notification_object.data}))
