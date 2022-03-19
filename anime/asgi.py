import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import board.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'anime.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
    URLRouter(
        board.routing.websocket_urlpattens
    ))
})

