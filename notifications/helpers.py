from notifications.models import Notification


def create_notification(notification, receiver=None, broad=False, kind=None):
    if not receiver and not broad:
        return
    Notification.objects.create(
        notification=notification, receiver=receiver, broad=broad, kind=kind
    )



