from datetime import timedelta

from django.contrib import admin
from django.utils import timezone
from django.conf import settings

from notifications.models import Notification


# action for deleting notifications older than the  period specefied by NOTIFICATIONS_LIFE_PERIOD, default to 7 days
@admin.action(description="delete expired notifications")
def delete_expired_notifications_action(modeladmin, request, queryset):
    notifications_life_period = getattr(settings, "NOTIFICATIONS_LIFE_PERIOD", 7)

    expired_notifications = Notification.objects.exclude(
        time__gt=timezone.now() - timedelta(days=notifications_life_period)
    )
    n_expired_notifications = expired_notifications.count()
    expired_notifications.delete()

    print(
        f"\n--- {n_expired_notifications} expired notifications deleted from the database ---\n"
    )


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    actions = [delete_expired_notifications_action]

    list_display = (
        "kind",
        "receiver",
        "notification",
        "time",
        "seen",
    )

    autocomplete_fields = ["receiver"]

    search_fields = ("receiver__username__startswith",)

    list_filter = (
        ("receiver", admin.RelatedOnlyFieldListFilter),
        "seen",
        "kind",
        "time",
    )

    list_display_links = None
