import pytz
from django.utils import timezone
from django.conf import settings


class LocalTimezoneMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if settings.ADMIN_PATH in request.path:
            timezone.activate(pytz.timezone("Africa/Cairo"))
        return self.get_response(request)
