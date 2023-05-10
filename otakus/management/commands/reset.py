from django.core.management.base import BaseCommand

from otakus.models import User
from otakus.models import Question
from otakus.models import QuestionInteraction
from otakus.models import Notification


class Command(BaseCommand):
    help = "delete all users and their data created during development except active questions"

    def handle(self, *args, **options):
        approval = ""
        while approval != "yes":
            approval = input(
                "\n WARNING ! please make sure you are not in production, Delete ? (yes/no): "
            )
            if approval == "no":
                print("\n operation canceled \n")
                return

        User.otakus.all().delete()

        Notification.objects.all().delete()

        Question.objects.filter(is_contribution=True).update(active=False)

        Question.objects.filter(is_contribution=True).delete()

        QuestionInteraction.objects.all().delete()

        print("\n--- data has been cleard successfully ---\n")
