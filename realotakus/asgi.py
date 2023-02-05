import os

from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
import otakus.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'realotakus.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            otakus.routing.websocket_urlpattens
        )
    )
})
