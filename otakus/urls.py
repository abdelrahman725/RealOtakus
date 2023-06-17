from django.urls import path, re_path

import otakus.views
import otakus.authen_views


# DRF endpoints
urlpatterns = [

    # first endpoint hit by the client (loads user related data if authenticated)
    path("main", otakus.views.get_home_data),
    
    # auth-related endpoints
    path("register/", otakus.authen_views.user_register),    
    path("login/", otakus.authen_views.user_login),
    path("logout/", otakus.authen_views.user_logout),
    path("delete_account/", otakus.authen_views.delete_account),
    
    # app logic-related endpoints
    path("getgameanimes", otakus.views.get_game_animes),
    path("getgame/<int:game_anime>", otakus.views.get_game),
    path("getprofile", otakus.views.get_user_interactions),
    path("get_make_contribution", otakus.views.get_or_make_contribution),
    path("get_review_contribution", otakus.views.get_or_review_contribution),
    path("interaction/<int:question_id>", otakus.views.record_question_encounter),
    path("post_country", otakus.views.save_user_country),
    path("notifications/mark", otakus.views.mark_notifications_as_read),
    path("submitgame", otakus.views.submit_game),
]

# catch all for react app and its routes
urlpatterns += [re_path(r"^.*", otakus.views.react_app)]
