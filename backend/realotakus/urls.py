from django.contrib import admin
from django.conf import settings
from django.urls import path, include

urlpatterns = [
    path(settings.ADMIN_PATH, admin.site.urls),
    path("", include("core.urls")),
    path("auth/", include("djoser.urls")),
    path("auth/", include("accounts.urls")),
    path("notifications/", include("notifications.urls")),
]
