from board.models import *
#from time import sleep

# script for reseting state of the database by deleting any data used in testing

admin = User.objects.get(username="admin",is_superuser=True)
users = User.objects.exclude(pk=admin.pk)
questions = Question.objects.all()
Game.objects.all().delete()

Notification.objects.all().delete()

Question.objects.exclude(contributor=admin).delete()

for user in users:
  user.points=0
  user.tests_completed=0
  user.tests_started=0
  user.contributor=False
  user.contributions_count=0
  user.level = "beginner"
  user.animes_to_review.clear()
  user.save()



for q in questions:
    q.correct_answers=0
    q.wrong_answers=0
    q.save()



print(f"\n data created through manual testing of the app has been deleted sucessfully !\n")