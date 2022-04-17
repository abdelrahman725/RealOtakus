from board.models import *

# file for reseting state of the database by deleting any data used in testing

users = User.objects.exclude(pk=1)
questions = Question.objects.all()

Game.objects.all().delete()
Notification.objects.all().delete()

Question.objects.exclude(contributor=User.objects.get(username="admin")).delete()

for user in users:
  user.points=0
  user.tests_completed=0
  user.tests_started=0
  user.contributor=False
  user.contributions_count=0
  user.level = "beginner"
  user.save()


for q in questions:
    q.correct_answers=0
    q.wrong_answers=0
    q.save()
