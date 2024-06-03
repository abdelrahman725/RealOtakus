import threading

from django.utils import timezone
from django.db.models.signals import (
    pre_save,
    post_save,
    pre_delete,
    post_delete,
    m2m_changed,
)
from django.dispatch import receiver
from django.core.cache import cache
from django.core.exceptions import ValidationError

from core.models import Anime
from core.models import Question
from core.models import Otaku

from notifications.helpers import create_notification


# @receiver(post_save, sender=Question)
# def post_contributing(sender, instance, created, **kwargs):
#     if created and instance.is_contribution:

#         def notify_reviewers():
#             for reviewer in instance.anime.reviewers.all():
#                 if reviewer != instance.contributor:
#                     create_notification(
#                         receiver=reviewer, notification=instance.anime.name, kind="R"
#                     )

#         async_notification = threading.Thread(target=notify_reviewers)
#         async_notification.start()


@receiver(pre_save, sender=Question)
def post_contribution_review(sender, instance, **kwargs):
    if (
        instance.pk == None
        or instance.date_reviewed
        or not instance.is_contribution
        or instance.state == "pending"
    ):
        return

    instance.date_reviewed = timezone.now()

    if instance.state == "approved" and instance.contributor:
        instance.contributor.score += 10
        instance.contributor.save()

    create_notification(
        receiver=instance.contributor,
        notification=instance.anime,
        kind="A" if instance.state == "approved" else "F",
    )


@receiver(pre_delete, sender=Question)
def protect_active_questions(sender, instance, **kwargs):
    if instance.state == "approved":
        raise ValidationError(("approved questions can not be deleted"))


@receiver(m2m_changed, sender=Otaku.animes_to_review.through)
def on_animes_to_review_change(sender, instance, **kwargs):
    action = kwargs.pop("action", None)

    if action == "post_remove":
        create_notification(
            receiver=instance,
            notification="Sorry you are no longer a reviewer as you didn't comply with our review guidelines",
        )

    if action == "post_add":
        for anime_id in kwargs.pop("pk_set", None):
            create_notification(
                receiver=instance,
                notification=Anime.objects.get(id=anime_id),
                kind="N",
            )


# @receiver([post_save, post_delete], sender=Anime)
# def update_cached_animes(sender, **kwargs):
#     pass