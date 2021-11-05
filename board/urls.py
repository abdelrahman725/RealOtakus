from django.urls import path,re_path
from django.views.generic import TemplateView
from .views import *

urlpatterns = [

    path('register',Register, name="register"),
    path('login',Login, name="login"),
    path('logout',Logout,name="logout"), 

    path('userdata',GetUserData,name="userdata"),
    path('leaderboard',GetUsers.as_view()),
    path('allanimes',GetAllAnimes),
    path('points', UpdatePoints,name="update_points"),
    path('animescore', UpdateAnimesScores,name="anime_score"),
    path('topanimes',TopAnimes,name="topanimes"),
    path('test/<str:anime_ids>',GetTest),
    re_path(r'^.*',TemplateView.as_view(template_name='index.html'))

]
