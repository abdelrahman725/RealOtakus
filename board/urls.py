from django.urls import path, re_path
from board.authen_views import Register
from board.authen_views import Login
from board.authen_views import Logout
from board.views import *


urlpatterns = [
    
    path('',ReactApp,name="home"),
    path('register/',Register,name="register_url"),
    path('login/',Login,name="login_url"),
    path('logout/',Logout),
    
    path('data',main_data),
    
    path('gameanimes',GetQuizeAnimes),
    path('getgame/<int:game_anime>',GetTest),
    path('interaction/<int:question_id>',QuestionEncounter),
    path('submitgame',SubmitGame),

    path('contribution',get_or_make_contribution),
    path('review',contribution_to_review),

    path('profile',GetMyProfile),
    path('update_notifications_state',UpdateNotificationsState)

]
