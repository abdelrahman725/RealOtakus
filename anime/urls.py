# main project paths

from django.conf import settings
from django.contrib import admin
from django.urls import include, path
#from django.views.generic import TemplateView


urlpatterns = [
    path('',include("board.urls")),
    path('accounts/', include('allauth.urls')),
    path('admin', admin.site.urls),
]
