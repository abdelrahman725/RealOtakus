from django.core.management.base import BaseCommand

from board.models import *
from board.constants import BEGINNER

# script for reseting state of the database by deleting any data used in testing (manual or automatic)
# Note : don't use in production !


class Command(BaseCommand):

    help = "delete all created data during testing except active questions"

    def handle(self, *args, **options):

        approval = ""
        while approval != "yes" :
            approval = input("\n WARNING ! please make sure you are not in production, Delete ? (yes/no): ")
            if approval == "no":
                print("\n command canceled \n")
                exit()


        admin = User.objects.get(username="admin", is_superuser=True)
        users = User.objects.exclude(pk=admin.pk)
        
        Notification.objects.all().delete()

        users.filter(username__istartswith="user_").delete()


        for user in users:
            user.points = 0
            user.level = BEGINNER
            #user.animes_to_review.clear()
            user.save()
  

        Question.objects.filter(contribution__isnull=False).update(active=False)
        Question.objects.filter(contribution__isnull=False,active=False).delete()
        
        Contribution.objects.all().delete()
     
        QuestionInteraction.objects.all().delete()

        try: Game.objects.all().delete()
        except: pass
    

        print("\n--- data has been cleard successfully ---\n")
