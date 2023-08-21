from datetime import timedelta

from django.db import models
from django.utils import timezone
from django.conf import settings

from accounts.models import UserAccount

# return notifications that are within the valid time period
class NoneExpiredNotifcationsManager(models.Manager):
    notifications_life_period = getattr(settings, "NOTIFICATIONS_LIFE_PERIOD", 15)

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(
                time__gt=timezone.now() - timedelta(days=self.notifications_life_period)
            )
        )


class Notification(models.Model):
    receiver = models.ForeignKey(
        UserAccount,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications",
    )
    notification = models.CharField(max_length=250)
    time = models.DateTimeField(default=timezone.now)
    seen = models.BooleanField(default=False)
    broad = models.BooleanField(default=False)
    kind = models.CharField(
        choices=(
            ("NA", "new available anime in quizes"),
            ("N", "new anime to review"),
            ("R", "review needed"),
            ("A", "question approved"),
            ("A1", "first question approved"),
            ("F", "question rejected"),
        ),
        max_length=2,
        null=True,
        blank=True,
    )

    objects = models.Manager()
    non_expired = NoneExpiredNotifcationsManager()

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return f"{self.kind} : {self.receiver}"
