from datetime import timedelta
from django.utils import timezone

import otakus.models
from otakus.constants import LEVELS, REALOTAKU, ADVANCED, INTERMEDIATE


def get_superuser():
    return otakus.models.User.objects.filter(is_superuser=True).first()


def create_notification(notification, receiver=None, broad=False, kind=None):
    if not receiver and not broad:
        return
    otakus.models.Notification.objects.create(
        notification=notification, receiver=receiver, broad=broad, kind=kind
    )


# delete notifications older than one month
def delete_expired_notifications(life_period_days=30):
    expired_notifications = otakus.models.Notification.objects.exclude(
        time__gt=timezone.now() - timedelta(days=life_period_days)
    )
    n_expired_notifications = expired_notifications.count()
    expired_notifications.delete()

    print(
        f"\n--- {n_expired_notifications} expired notifications deleted from the database ---\n"
    )


def notify_reviewers_of_a_new_contribution(anime, contributor):
    for reviewer in anime.reviewers.all():
        if reviewer != contributor:
            create_notification(
                receiver=reviewer, notification=anime.anime_name, kind="R"
            )


def contribution_got_reviewed(contributed_question):
    contributed_question.date_reviewed = timezone.now()

    if contributed_question.approved == True:
        contributed_question.active = True

        if contributed_question.contributor:
            is_first_approved_contribution = (
                contributed_question.contributor.contributions.filter(
                    approved=True
                ).count()
                == 0
            )
            contributed_question.contributor.points += 10
            contributed_question.contributor.save()

    create_notification(
        receiver=contributed_question.contributor,
        notification=contributed_question.anime,
        kind="F"
        if contributed_question.approved == False
        else "A1"
        if is_first_approved_contribution
        else "A",
    )


def get_user_new_level(user):
    if user.points >= LEVELS[REALOTAKU]:
        return REALOTAKU

    if user.points >= LEVELS[ADVANCED]:
        return ADVANCED

    if user.points >= LEVELS[INTERMEDIATE]:
        return INTERMEDIATE
    return None


def get_client_ip(request):
    # use this in case of application is running behind a reverse proxy server (like Nginx)
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        print("returning FORWARDED_FOR")
        ip = x_forwarded_for.split(",")[-1].strip()

    elif request.META.get("HTTP_X_REAL_IP"):
        print("returning REAL_IP")
        ip = request.META.get("HTTP_X_REAL_IP")

    else:
        print("returning REMOTE_ADDR")
        ip = request.META.get("REMOTE_ADDR")

    return ip


def print_request_relevant_ips(request):
    print(f"REMOTE_ADDR : {request.META.get('REMOTE_ADDR')}\n")
    print(f"REMOTE_HOST : {request.META.get('REMOTE_HOST')}\n")
    print(f"SERVER_NAME : {request.META.get('SERVER_NAME')}\n")
