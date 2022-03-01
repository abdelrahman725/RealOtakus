from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime


class User(AbstractUser):
  points = models.IntegerField(default=0)
  level = models.CharField(max_length=30,null=False,default="beginner")
  tests_completed = models.IntegerField(default=0)
  tests_started = models.IntegerField(default=0)
  best_score = models.IntegerField(default=0)
  country = models.CharField(null=True,max_length=60)
  contributor =  models.BooleanField(default=False)
  def __str__(self):
    return self.username


Admin = User.objects.filter(is_superuser=True)[0]
  
class Anime(models.Model):
  anime_name = models.CharField(max_length=100,null=False,unique=True)
  url= models.CharField(max_length=300,default="/")
  def __str__(self):
        return f"{self.anime_name}"

class Question(models.Model):
  anime    =  models.ForeignKey(Anime,on_delete=models.CASCADE,related_name="anime_questions")
  contributor = models.ForeignKey(User,on_delete=models.SET_NULL,related_name="contributions",null=True,default=Admin.id)
  advanced =  models.BooleanField(default=False)

  status_options = [
    ('approved', 'approved'),
    ('declined', 'declined'),
    ('pending', 'pending'),]

  status = models.CharField(
    choices=status_options,max_length=20,default="approved")

  question =  models.TextField(blank=False,unique=True)
  choice1  =  models.TextField(blank=False,null=True)
  choice2  =  models.TextField(blank=False,null=True)
  choice3  =  models.TextField(blank=False,null=True)
  choice4  =  models.TextField(blank=False,null=True)
  right_answer = models.TextField(blank=False,null=True)
  correct_answers= models.IntegerField(default=0)
  wrong_answers= models.IntegerField(default=0)
  
  def save(self, *args, **kwargs):
    if not self.contributor.is_superuser:

      user = self.contributor
      if self.status == "approved" : 

        msg = "congratulations your question has been approved and ready to be included in the upcoming tests"
        new_notification = Notification(owner=user,notification=msg, time=datetime.now())
        new_notification.save()
        if user.contributor == False:
          user.contributor = True
        user.points+=10
        user.save()

      if self.status == "declined":
        msg="sorry your question is declined as it didn't meet the requirements"
        new_notification = Notification(owner=user,notification=msg, time=datetime.now())
        new_notification.save()
      
    super(Question, self).save(*args, **kwargs)

  def __str__(self):
    if len(self.question)>50: 
      return f"{self.question[:50] }"
    return f"{self.question}"


class Game(models.Model):
  game_owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="get_games")
  anime =  models.ForeignKey(Anime,on_delete=models.CASCADE)
  gamesnumber = models.IntegerField(default=0)
  review = models.TextField(null=True)
  def __str__(self):
    return f"{self.game_owner} has {self.gamesnumber} games for {self.anime}"


class Notification(models.Model):
  owner =  models.ForeignKey(User,on_delete=models.CASCADE,related_name="getnotifications")
  notification = models.CharField(max_length=250)
  time = models.DateTimeField(default=None)
