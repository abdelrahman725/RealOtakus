from django.urls import path,include
from .views import React,LoginRegister,Register,Login,Logout,GetUsers,GetAllAnimes,GetTest
import re
urlpatterns = [
    
    path('',LoginRegister,name="LoginRegister"),
    path('register',Register, name="register"),
    path('login',Login, name="login"),
    path('logout',Logout,name="logout"),

    path('leaderboard',GetUsers.as_view()),
    path('allanimes',GetAllAnimes.as_view()),
    path('test/<str:anime_ids>',GetTest),
    path('react',React ,name="mainreact")
]
