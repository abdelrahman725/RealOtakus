from ...models import *
from ...constants import BEGINNER
from django.core.management.base import BaseCommand

# script for reseting state of the database by deleting any data used in testing (manual or automatic)
# Note : don't use in production !


class Command(BaseCommand):

    help = "delete all created data during development except approved questions by admin"

    def handle(self, *args, **options):

        approval = ""
        while approval != "yes" :
            approval = input("\nWARNING ! please make sure you are not in production \n\nare sure you want to delete the data (yes/no): ")
            if approval == "no":
                print("\n command canceled \n")
                exit()

        questions = Question.objects.all()
        admin = User.objects.get(username="admin", is_superuser=True)
        users = User.objects.exclude(pk=admin.pk)
        

        Game.objects.all().delete()
        print("\n deleting all games.. \n")

        Notification.objects.all().delete()
        print("\n deleting all notifications.. \n")


        for user in users:
            user.points = 0
            user.tests_completed = 0
            user.tests_started = 0
            user.contributor = False
            user.contributions_count = 0
            user.level = BEGINNER
            user.animes_to_review.clear()
            user.save()
        print("\n reseting users data.. \n")
        
        # Warning : don't use this when there are Real moderators
        for q in questions:
            if q.contributor == admin and q.approved == True:
                q.correct_answers = 0
                q.wrong_answers = 0
                q.save()
            else:
                q.delete()
        print("\n clearing unwated questions .. \n")
    

        print("\n--- data has been cleard successfully !---\n")
