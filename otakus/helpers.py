from datetime import timedelta

from django.utils import timezone

import otakus.models

from otakus.constants import LEVELS, REALOTAKU, ADVANCED, INTERMEDIATE


def to_local_date_time(utc_datetime):
  if utc_datetime:
    return utc_datetime + timedelta(minutes=120)
    #local_tz = pytz.timezone('Africa/Cairo')
    #return utc_datetime.replace(tzinfo=pytz.utc).astimezone(local_tz)
  return "N/A"


def create_notification(notification, receiver=None, kind=None):
    otakus.models.Notification.objects.create(
        receiver=receiver,
        notification=notification,
        kind=kind,
        seen = False if receiver else None
    )


def notify_reviewers_of_a_new_contribution(anime, contributor):
    for reviewer in anime.reviewers.all():
        if reviewer != contributor:
            create_notification(
                receiver=reviewer,
                notification=anime.anime_name,
                kind="R"
            )


def contribution_reviewed(contribution):

    contribution.date_reviewed = timezone.now()

    if contribution.reviewer == None:
        contribution.reviewer = otakus.models.User.objects.get(is_superuser=True)

    if contribution.approved == True:

        if contribution.contributor:
            contribution.contributor.points += 10
            contribution.contributor.save()

        contribution.question.active = True
        contribution.question.save()

        create_notification(
            receiver=contribution.contributor,
            notification=contribution.question.anime,
            kind="A"
        )

    if contribution.approved == False:
        create_notification(
            receiver=contribution.contributor,
            notification=contribution.question.anime,
            kind="F"
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
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        print("returning FORWARDED_FOR")
        ip = x_forwarded_for.split(',')[-1].strip()

    elif request.META.get('HTTP_X_REAL_IP'):
        print("returning REAL_IP")
        ip = request.META.get('HTTP_X_REAL_IP')

    else:
        print("returning REMOTE_ADDR")
        ip = request.META.get('REMOTE_ADDR')
  
    return ip


def print_request_relevant_ips(request):
    print(f"REMOTE_ADDR : {request.META.get('REMOTE_ADDR')}\n")
    print(f"REMOTE_HOST : {request.META.get('REMOTE_HOST')}\n")
    print(f"SERVER_NAME : {request.META.get('SERVER_NAME')}\n")

