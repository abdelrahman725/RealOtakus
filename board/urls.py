from django.urls import path

from board.authen_views import user_logout
from board.authen_views import user_register
from board.authen_views import user_login

from board.views import react_app
from board.views import react_route_page
from board.views import get_home_data
from board.views import get_game_animes
from board.views import get_game
from board.views import get_user_interactions
from board.views import get_or_make_contribution
from board.views import get_or_review_contribution
from board.views import record_question_encounter
from board.views import save_user_country
from board.views import update_notifications
from board.views import submit_game
from board.views import privacy_policy_page
from board.views import terms_page

urlpatterns = [

    path('', react_app),
    path('register/', user_register, name="register_url"),
    path('login/', user_login, name="login_url"),
    path('logout/', user_logout),
    path('privacy/', privacy_policy_page, name="privacy_url"),
    path('terms/', terms_page, name="terms_url"),

    # react router paths (views only)
    path('game/', react_route_page),
    path('contribute/', react_route_page),
    path('mycontributions/', react_route_page),
    path('review/', react_route_page),
    path('profile/', react_route_page),
    path('notifications/', react_route_page),
    path('about/', react_route_page),

    # DRF api endpoints
    path('gethomedata', get_home_data),
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
