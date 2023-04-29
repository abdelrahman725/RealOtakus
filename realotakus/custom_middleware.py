import pytz    
from django.utils import timezone

class LocalTimezoneMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_superuser:
            timezone.activate(pytz.timezone('Africa/Cairo'))
        return self.get_response(request)