# main Project paths 
from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView
from .views import *

urlpatterns = [
    path('',MainRequest,name="welcome"),
    path('accounts/', include('allauth.urls')),
    path('admin', admin.site.urls),
    path('login/',Login,name="login_url"),
    path('register/',Register,name="register_url"),
    path('logout/',Logout),
    path('home/',include("board.urls")),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns +=path('__dubug__/',include(debug_toolbar.urls)),