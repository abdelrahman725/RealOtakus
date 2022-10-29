import re

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.shortcuts import redirect
from django.utils import timezone

from board.constants import LEVELS 
import board.models


def get_client_ip(request):
    # use this in case of a the application is running behind a reverse proxy server(like Nginx)
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        print ("returning FORWARDED_FOR")
        ip = x_forwarded_for.split(',')[-1].strip()

    elif request.META.get('HTTP_X_REAL_IP'):
        print ("returning REAL_IP")
        ip = request.META.get('HTTP_X_REAL_IP')

    else:
        print ("returning REMOTE_ADDR")
        ip = request.META.get('REMOTE_ADDR')
    return ip


def print_request_relevant_ips(request):
    print(f"REMOTE_ADDR : {request.META.get('REMOTE_ADDR')}\n")
    print(f"REMOTE_HOST : {request.META.get('REMOTE_HOST')}\n")
    print(f"SERVER_NAME : {request.META.get('SERVER_NAME')}\n")


def CreateNotification(receiver,notification,kind=None):
    if receiver and not receiver.is_superuser:
        board.models.Notification.objects.create(
            owner=receiver,
            notification=notification,
            kind = kind
        )


def notify_reviewers(anime):
    for reviewer in anime.reviewers.all():
        CreateNotification(
            receiver=reviewer,
            notification= f"new question for {anime.anime_name} and needs review, check your profile",
            kind="R"
        )


def notify_user_of_contribution_state(contribution):

    contribution.date_reviewed = timezone.now()

    if contribution.reviewer == None:
        contribution.reviewer = board.models.User.objects.get(pk=1,is_superuser=True) 
    
    if contribution.approved == True:

        if contribution.contributor: 
            contribution.contributor.points+=10
            contribution.contributor.save()

        contribution.question.active = True
        contribution.question.save()

        CreateNotification(
                receiver=contribution.contributor,
                notification=f"Congratulations! your contribution for {contribution.question.anime} is approvd",
                kind="A"
            )

    if contribution.approved == False:
        CreateNotification(
                receiver=contribution.contributor,
                notification=f"Sorry, your last contribution for {contribution.question.anime} is rejected",
                kind="F"
            )
  

def CheckLevel(user):
    for level in reversed(LEVELS):    
        if user.points >= LEVELS[level] and LEVELS[level] != 0:
            CreateNotification(
                receiver=user,
                notification= f"Level up to {level}, good job"
            )
            return level
    return user.level 


def check_empty_string(value):
    if re.search(r'^\s+$',value):        
        raise ValidationError(
            _('no empty strings allowed')
        )


def question_validator(value):
    
    check_empty_string(value)

    if len(value) < 8:
        raise ValidationError(
            _('question must be at leat 8 characters length'),
            code="invalid question length"
        )


def choices_integirty(choices):

    unique_choices = set()

    for choice in choices:
        check_empty_string(choice)
        unique_choices.add(choice)

    if len(unique_choices) < len(choices):
         raise ValidationError(
            _('question choices must be unique'),code="choices_integrity_error"
        )


def ValidatePassword(password):
    return True
    if len(str(password)) >= 3:
        return True
    return False


def login_required(f):
    def wraper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect("/")
        else:
            requested_endpoint = f(request, *args, **kwargs)
            return requested_endpoint
    return wraper
