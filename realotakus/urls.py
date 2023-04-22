import os

from django.contrib import admin
from django.urls import include,path
from realotakus.settings import ADMIN_PANEL_PATH

urlpatterns = [
    path(ADMIN_PANEL_PATH, admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('',include('otakus.urls')),
]
