from django.urls import path

from board.authen_views import user_logout 
from board.authen_views import user_register
from board.authen_views import user_login
from board.views import *


urlpatterns = [
# main paths
    path('',react_app),
    path('register/',user_register, name="register_url"),
    path('login/',user_login, name="login_url"),
    path('logout/',user_logout),

# react router paths (views only)
    path('game/',react_route_page),  
    path('contribute/',react_route_page),
    path('mycontributions/',react_route_page),
    path('review/',react_route_page),
    path('profile/',react_route_page),
    path('notifications/',react_route_page),
    path('about/',react_route_page),
    
# DRF api endpoints
    path('gethomedata',get_home_data),
    path('getgameanimes',get_game_animes),
    path('getgame/<int:game_anime>',get_game),
    path('getprofile',get_user_interactions),
    path('get_review_contribution',get_or_review_contribution),
    path('get_make_contribution',get_or_make_contribution),
    path('interaction/<int:question_id>',record_question_encounter),
    path('update_notifications',update_notifications),
    path('submitgame',submit_game)
]
