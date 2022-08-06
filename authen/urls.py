# auth Project paths 

from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView
from .views import *

urlpatterns = [
    
    path('',InitialRequest,name="mainrequest"),
    path('register/',Register,name="register_url"),
    path('login/',Login,name="login_url"),
    path('logout/',Logout),
]
