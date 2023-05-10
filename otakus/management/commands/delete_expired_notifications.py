from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from otakus.models import Notification


class Command(BaseCommand):
    help = "delete all expired notifications that have exceed 1 month long since their creation time"

    def handle(self, *args, **options):

        expired_notifications = Notification.objects.exclude(
            time__gt=timezone.now() - timedelta(days=30)
        )
        n_expired_notifications = expired_notifications.count()
        expired_notifications.delete()

        print(
            f"\n--- {n_expired_notifications} expired notifications deleted from the database ---\n"
        )
