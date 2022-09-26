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
            approval = input("\n WARNING ! please make sure you are not in production \n\n are sure you want to delete the data (yes/no): ")
            if approval == "no":
                print("\n command canceled \n")
                exit()

        questions = Question.objects.all()
        admin = User.objects.get(username="admin", is_superuser=True)
        users = User.objects.exclude(pk=admin.pk)
        

        Notification.objects.all().delete()
        print("\n deleting all notifications.. \n")

        users.filter(username__istartswith="user_").delete()
        print("\n deleting dummy users that start with 'user_'\n")


        for user in users:
            user.points = 0
            user.tests_completed = 0
            user.tests_started = 0
            user.level = BEGINNER
            #user.animes_to_review.clear()
            user.save()
  

        # Note : don't use later
        questions.filter(contribution__isnull=False,active=False).delete()
        
        Contribution.objects.all().delete()
     
        QuestionInteraction.objects.all().delete()
        
        for q in questions.filter(contribution__isnull=True):
            q.correct_answers = 0
            q.wrong_answers = 0
            q.save()
  
        print("\n deleting contributions .. \n")
    

        print("\n--- data has been cleard successfully !---\n")
