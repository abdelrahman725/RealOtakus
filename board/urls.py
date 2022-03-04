from django.urls import path,re_path
from django.views.generic import TemplateView
from .views import *
#/<int:id>
#<str:category>
urlpatterns = [
    
    path("",ReactApp),
    path('data/',GetUserData,name="userdata"),
    path('animes/',GetAvailableAnimes,name="animes"),
    path('test',TestPost,name="animes"),
    path('game/<int:game_anime>',GetTest,name="game"),
    path('competitors/',AllCompetitors)

]
