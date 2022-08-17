import re

from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.shortcuts import redirect

from .constants import LEVELS


def login_required(f):
    def wraper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect("/")
        else:
            old_function = f(request, *args, **kwargs)
            return old_function
    return wraper


def CreateNotification(user, content):
    from .models import Notification
    if user and not user.is_superuser:
        Notification.objects.create(owner=user, notification=content)


def CheckLevel(user):
    for level in reversed(LEVELS):    
        if user.points >= LEVELS[level] and LEVELS[level] != 0:
            user.level = level            
            CreateNotification(user,f"Level up to {level}, good job")
            
            return


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
