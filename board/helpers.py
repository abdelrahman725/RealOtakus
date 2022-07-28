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
    if user:
        Notification.objects.create(owner=user, notification=content)


def CheckLevel(user):
    print(f"\n points after quiz : {user.points}\n")
    for level in reversed(LEVELS):    
        if user.points >= LEVELS[level] and LEVELS[level] != 0:
            user.level = level            
            CreateNotification(user,f"Level up to {level}, good job")
            
            return




def ValidatePassword(password):
    return True
    if len(str(password)) >= 3:
        return True
    return False
