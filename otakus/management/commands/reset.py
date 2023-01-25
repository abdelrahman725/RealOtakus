from django.core.management.base import BaseCommand

from otakus.models import User
from otakus.models import Contribution
from otakus.models import Question
from otakus.models import QuestionInteraction
from otakus.models import Notification 

# script for reseting state of the database by deleting any data used in testing (manual or automatic)
# Note : don't use in production !


class Command(BaseCommand):

    help = "delete all users and their data created during development except active questions"

    def handle(self, *args, **options):

        approval = ""
        while approval != "yes" :
            approval = input("\n WARNING ! please make sure you are not in production, Delete ? (yes/no): ")
            if approval == "no":
                print("\n command canceled \n")
                exit()


        admin = User.objects.get(username="admin", is_superuser=True)

        User.objects.exclude(pk=admin.pk).delete()
        
        Notification.objects.all().delete()
  
        Question.objects.filter(contribution__isnull=False).update(active=False)

        Question.objects.filter(contribution__isnull=False).delete()
        
        Contribution.objects.all().delete()
     
        QuestionInteraction.objects.all().delete()
    

        print("\n--- data has been cleard successfully ---\n")
