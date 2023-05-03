from django.urls import path, re_path

from otakus.authen_views import send_csrf_token_to_client
from otakus.authen_views import user_register
from otakus.authen_views import user_login
from otakus.authen_views import user_logout
from otakus.authen_views import delete_account

from otakus.views import react_app
from otakus.views import get_home_data
from otakus.views import get_game_animes
from otakus.views import get_game
from otakus.views import get_user_interactions
from otakus.views import get_or_make_contribution
from otakus.views import get_or_review_contribution
from otakus.views import record_question_encounter
from otakus.views import save_user_country
from otakus.views import update_notifications
from otakus.views import submit_game


# DRF endpoints

urlpatterns = [

  # not authenticated routes
    path('main', get_home_data),
    path('get_csrf/', send_csrf_token_to_client),
    path('login/', user_login),
    path('register/', user_register),
  
  # authenticated routes
    path('logout/', user_logout),
    path('delete_account/', delete_account),
    path('getgameanimes', get_game_animes),
    path('getgame/<int:game_anime>', get_game),
    path('getprofile', get_user_interactions),
    path('get_make_contribution', get_or_make_contribution),
    path('get_review_contribution', get_or_review_contribution),
    path('interaction/<int:question_id>', record_question_encounter),
    path('post_country', save_user_country),
    path('update_notifications', update_notifications),
    path('submitgame', submit_game)
]

# catch all for react app and its routes 
urlpatterns += [re_path(r'^.*',react_app)]
