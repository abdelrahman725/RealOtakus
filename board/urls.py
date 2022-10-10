
from django.urls import path,re_path,include
from board.views import *

urlpatterns = [
    
    path('',ReactApp),
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
