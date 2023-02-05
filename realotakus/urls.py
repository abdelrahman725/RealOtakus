import os

from django.contrib import admin
from django.urls import include,path
from realotakus.settings import DEBUG

ADMIN_PANEL_PATH = 'admin/' if DEBUG == True else os.getenv('DJANGO_ADMIN_PATH') 

urlpatterns = [
    path(ADMIN_PANEL_PATH, admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('',include('otakus.urls')),
]
