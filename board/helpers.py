import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.shortcuts import redirect
from django.utils import timezone

import board.models

from board.constants import LEVELS


def CreateNotification(receiver,notification,kind):
    if receiver and not receiver.is_superuser:
        board.models.Notification.objects.create(
            owner=receiver,
            notification=notification,
            kind = kind
        )


def notify_reviewers(anime):
    msg = f"new question for {anime.anime_name} and needs review, check your profile"
    for reviewer in anime.reviewers.all():
        CreateNotification(
            receiver=reviewer,
            notification= msg,
            kind="R"
        )


def announce_new_active_anime(question):
    if question.anime.anime_questions.filter(active=True).count() >= 5:
        question.anime.active = True
        question.anime.save()

        notification = f"{question.anime.anime_name} is now active and has questions !"
        reviewer,contributor = None,None
        
        try:        
            contributor = question.contribution.contributor
            reviewer =  question.contribution.reviewer
   
        except board.models.Contribution.DoesNotExist:
            pass

        for user in board.models.User.objects.all():
            if user != reviewer and user != contributor:
                CreateNotification(
                    receiver=user,
                    notification= notification,
                    kind="N"
                )


def deactivate_anime(anime):
    if anime.anime_questions.filter(active=True).count() < 5:
        anime.active = False
        anime.save()


def notify_user_of_contribution_state(contribution):

    contribution.date_reviewed = timezone.now()

    if contribution.reviewer == None:
        contribution.reviewer = board.models.User.objects.get(pk=1,is_superuser=True) 

    
    if contribution.approved == True:
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
            CreateNotification(user,f"Level up to {level}, good job")
            return level
    return user.level 


def check_empty_string(value):

    if re.search(r'^\s+$',value):        
        raise ValidationError(
            _('no empty strings allowed')
        )


def question_validator(value):
    
    check_empty_string(value)

    if len(value) < 10:
        raise ValidationError(
            _('question must be at leat 10 characters length'),
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
            old_function = f(request, *args, **kwargs)
            return old_function
    return wraper
