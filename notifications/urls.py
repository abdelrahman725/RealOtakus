from django.urls import path

import notifications.views

urlpatterns = [
    path("get/", notifications.views.get_notifications),
    path("mark/", notifications.views.mark_notifications_as_read),
]
