from django.urls import path,re_path
from django.views.generic import TemplateView
from .views import *

urlpatterns = [

    # path('register',Register, name="register"),
    # path('login',Login, name="login"),
    # path('logout',Logout,name="logout"), 

    # path('userdata',GetUserData,name="userdata"),
    # path('leaderboard',GetUsers.as_view()),
    # path('animes',GetAvailableAnimes),
    # path('sorted_animes',GetAnimeOrdered),
    
    # path('test',GetTest),
    # path('submit',CheckTest),

    # re_path(r'^.*',TemplateView.as_view(template_name='index.html'))

]
