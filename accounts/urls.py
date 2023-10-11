from django.urls import path, re_path

import accounts.views

urlpatterns = [
    re_path(
        r"^o/(?P<provider>\S+)/$",
        accounts.views.CustomSocialProviderAuthView.as_view(),
        name="provider-auth",
    ),
    path("jwt/create/", accounts.views.CustomTokenObtainPairView.as_view()),
    path("jwt/refresh/", accounts.views.CustomTokenRefreshView.as_view()),
    path("jwt/verify/", accounts.views.CustomTokenVerifyView.as_view()),
    path("logout/", accounts.views.LogoutView.as_view()),
    path("delete/", accounts.views.DeleteUserView.as_view()),
]
