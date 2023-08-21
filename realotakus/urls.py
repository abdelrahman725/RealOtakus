from django.contrib import admin
from django.conf import settings
from django.urls import path, include

urlpatterns = [
    path(settings.ADMIN_PATH, admin.site.urls),
    path("api/", include("djoser.urls")),
    path("api/", include("accounts.urls")),
    path("notifications/", include("notifications.urls")),
    # path("app or other name/", include("core.urls")),
]
