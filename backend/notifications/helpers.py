from notifications.models import Notification


def create_notification(notification, receiver=None, kind=None):
    if not receiver:
        return
    Notification.objects.create(notification=notification, receiver=receiver, kind=kind)
