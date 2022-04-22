
from django.urls import path,re_path,include
from django.views.generic import TemplateView
from .views import *

urlpatterns = [
    
    path("",ReactApp),
    path('data',GetUserData,name="userdata"),
    path('animes',GetAvailableAnimes,name="animes"),
    path('dashboard',GetDashBoard),

    path('getgame/<int:game_anime>',GetTest,name="getgame"),
    path('sendgame',SubmitTest,name="postgame"),

    path('contribute',MakeContribution),
    path('animesoptions',GetAllAnimes),

    path('profile',GetMyProfile),

]
