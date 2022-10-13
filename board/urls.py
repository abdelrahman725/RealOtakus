from django.urls import path, re_path
from board.views import *
from board.authen_views import * 

urlpatterns = [    
    
    path('',ReactApp,name="home"),
    path('register/',Register,name="register_url"),
    path('login/',Login,name="login_url"),
    path('logout/',Logout),
    
    path('data',GetUserData),
    path('dashboard',GetDashBoard),

    path('gameanimes',GetQuizeAnimes),
    path('getgame/<int:game_anime>',GetTest),
    path('interaction/<int:question_id>',QuestionEncounter),
    path('submitgame',SubmitGame),

    path('contribution',get_or_make_contribution),
    path('review',contribution_to_review),

    path('profile',GetMyProfile),
    path('update_notifications_state',UpdateNotificationsState)

]
