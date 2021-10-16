from django.urls import path,include
from .views import React,LoginRegister,Register,Login,Logout,GetUsers,GetTest,UpdatePoints,GetAllAnimes,UpdateAnimesScores,TopAnimes

urlpatterns = [
    
    path('',LoginRegister,name="LoginRegister"),
    path('register',Register, name="register"),
    path('login',Login, name="login"),
    path('logout',Logout,name="logout"),

    path('leaderboard',GetUsers.as_view()),
    path('allanimes',GetAllAnimes),
    path('points', UpdatePoints,name="update_points"),
    path('animescore', UpdateAnimesScores,name="anime_score"),
    path('topanimes',TopAnimes,name="topanimes"),
    path('test/<str:anime_ids>',GetTest),
    path('react',React ,name="mainreact")
]
