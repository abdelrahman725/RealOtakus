
from django.urls import path,re_path,include
from django.views.generic import TemplateView
from .views import *

urlpatterns = [
    
    path('',ReactApp),
    path('data',GetUserData),
    path('dashboard',GetDashBoard),

    path('quizanimes',GetQuizeAnimes),
    path('getgame/<int:game_anime>',GetTest),
    path('sendgame',SubmitTest),

    path('animesoptions',GetAllAnimes),
    path('contribute',MakeContribution),
    path('review',ReviewContribution),

    path('profile',GetMyProfile),
    path('update_notifications_state',UpdateNotificationsState)

]
