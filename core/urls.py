from django.urls import path

import core.views

urlpatterns = [
    path("leaderboard/", core.views.get_leaderboard),
    path("animes/", core.views.get_all_animes),
    path("profile/", core.views.get_profile),
    path("contribute/", core.views.contribute_question),
    path("contributions/", core.views.get_contributions),
    path("review/", core.views.review_contribution),
    path("review-contributions/", core.views.get_contributions_for_review),
    path("country/", core.views.save_country),
    path("quiz/animes/", core.views.get_quiz_animes),
    path("quiz/get/<int:anime>", core.views.get_quiz),
    path("quiz/interact/", core.views.record_question_interaction),
    path("quiz/submit/", core.views.submit_quiz),
]
