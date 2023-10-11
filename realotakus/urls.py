from django.contrib import admin
from django.conf import settings
from django.urls import path, include

urlpatterns = [
    path(settings.ADMIN_PATH, admin.site.urls),
    path("auth/", include("djoser.urls")),
    path("auth/", include("accounts.urls")),
    path("core/", include("core.urls")),
    path("notifications/", include("notifications.urls")),
]
