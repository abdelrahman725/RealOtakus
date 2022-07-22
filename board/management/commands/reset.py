from ...models import *
from ...constants import LEVELS
from django.core.management.base import BaseCommand

# script for reseting state of the database by deleting any data used in testing (manual or automatic)


class Command(BaseCommand):

    help = "delete all created data during development except approved questions by admin"

    def handle(self, *args, **options):

        questions = Question.objects.all()
        admin = User.objects.get(username="admin", is_superuser=True)
        users = User.objects.exclude(pk=admin.pk)

        Game.objects.all().delete()

        Notification.objects.all().delete()

        Question.objects.exclude(contributor=admin).delete()

        for user in users:
            user.points = 0
            user.tests_completed = 0
            user.tests_started = 0
            user.contributor = False
            user.contributions_count = 0
            user.level = LEVELS[0]
            user.animes_to_review.clear()
            user.save()

        for q in questions:
            q.correct_answers = 0
            q.wrong_answers = 0
            q.save()

        print("\n--- data has been cleard successfully ---\n")
