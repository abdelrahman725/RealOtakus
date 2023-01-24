import os

from django.contrib import admin
from django.urls import include, path
from anime.settings import DEBUG

ADMIN_URL_PATH = 'admin/' if DEBUG == True else os.getenv('DJANGO_ADMIN_PATH') 

urlpatterns = [
    path('',include('board.urls')),
    path('accounts/', include('allauth.urls')),
    path(ADMIN_URL_PATH, admin.site.urls)
]
