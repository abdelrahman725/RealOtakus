from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import Otaku
from accounts.models import UserAccount


@receiver(post_save, sender=UserAccount)
def create_otaku_user(sender, instance, created, **kwargs):
    if not instance.is_superuser and created:
        Otaku.objects.create(user=instance)
