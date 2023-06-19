from django.contrib import admin
from django.urls import include, path
from django.conf import settings

urlpatterns = [
    path(settings.ADMIN_PANEL_PATH, admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('',include('otakus.urls')),
]
