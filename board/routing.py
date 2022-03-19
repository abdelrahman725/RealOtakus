from django.urls import re_path
from .consumer import NotificationConsumer


websocket_urlpattens = [
  re_path(r'ws/socket-server/',NotificationConsumer.as_asgi())
]