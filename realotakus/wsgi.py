"""
WSGI config for realotakus project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/wsgi/
"""

import os

from otakus import expired_notifications_scheduler
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "realotakus.settings")

application = get_wsgi_application()

expired_notifications_scheduler.start()
