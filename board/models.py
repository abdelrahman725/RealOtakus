from time import time
from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime
from .consumer import NotificationConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

def CreateNotification(user,content):
  Notification.objects.create(owner=user,notification=content,time=datetime.now())

class Anime(models.Model):
  anime_name = models.CharField(max_length=40,unique=True)
  url= models.CharField(max_length=300,default="/")
  class Meta:
    ordering=["id"]
  def save(self, *args, **kwargs):
    new = False
    if not self.id:
      new =True
    super(Anime, self).save(*args, **kwargs)
    if new:
      from .views import animes_dict
      animes_dict[self.id] = self

  def delete(self, *args, **kwargs):
    from .views import animes_dict
    del animes_dict[self.id] 
    super(Anime, self).delete(*args, **kwargs)

  def __str__(self): return f"{self.anime_name}"

class User(AbstractUser):
  points = models.IntegerField(default=0)
  tests_completed = models.IntegerField(default=0)
  tests_started = models.IntegerField(default=0)
  country = models.CharField(null=True,max_length=60,blank=True)
  contributor =  models.BooleanField(default=False)
  contributions_count = models.IntegerField(default=0)
  animes_to_review = models.ManyToManyField(Anime,related_name="reviewers",blank=True)

  level_options = [
    ('beginner', 'beginner'),
    ('intermediate', 'intermediate'),
    ('advanced', 'advanced'),
    ('realOtaku', 'realOtaku'),]

  level = models.CharField(
    choices=level_options,max_length=12,default="beginner")

  class Meta:
    ordering= ["-points"]
  def __str__(self):
    return self.username

#Admin = User.objects.get(is_superuser=True)


class Question(models.Model):
  anime  = models.ForeignKey(Anime,on_delete=models.SET_NULL,related_name="anime_questions",null=True)
  contributor = models.ForeignKey(User,on_delete=models.SET_NULL,related_name="contributions",null=True,default=1)
  advanced =  models.BooleanField(default=False)
  question =  models.TextField(blank=False,unique=True,max_length=300)
  choice1  =  models.TextField(blank=False,null=True,max_length=150)
  choice2  =  models.TextField(blank=False,null=True,max_length=150)
  choice3  =  models.TextField(blank=False,null=True,max_length=150)
  choice4  =  models.TextField(blank=False,null=True,max_length=150)
  right_answer = models.TextField(blank=False,null=True,max_length=150)
  approved = models.BooleanField(default=True)
  correct_answers= models.IntegerField(default=0)
  wrong_answers= models.IntegerField(default=0)
  
  previous_status = None

  def __init__(self,*args, **kwargs):
    super().__init__(*args, **kwargs)
    self.previous_status  = self.approved

     
  def save(self, *args, **kwargs):

    if not self.contributor.is_superuser:
      user = self.contributor
      if self.previous_status == False and self.approved==True:
        # then it's his first approved contribution
        if user.contributor ==False:
          user.contributor=True
          msg = f"congratulations your question for {self.anime} ({self.question[:30]}) got  approved,you are an official Otaku contributor now ! "
          CreateNotification(user,msg)

        # subsequent approved contributions 
        else:
          msg=  f"congratulations your question for {self.anime} ({self.question[:30]}) got  approved, another contribution added to your profile"
          CreateNotification(user,msg)


        CurrentGame, created = Game.objects.get_or_create(game_owner=user,anime=self.anime)
        CurrentGame.contributions+=1
      
      # if the number of approved contributions for that particular user in that specific anime reaches 5 contributions 
      # then the user is qualified to be a reviewer for that anime 

        if CurrentGame.contributions == 5:
          if self.anime not in user.animes_to_review.all():
            user.animes_to_review.add(self.anime)
            CreateNotification(user,f"now you can review {self.anime} questions!")

        CurrentGame.save()
  

        user.contributions_count +=1
        user.points+=10
        user.save()
      
    super(Question, self).save(*args, **kwargs)


  def delete(self, *args, **kwargs):
    if not self.contributor.is_superuser:
      if not self.approved:
        msg = f"sorry your last question on {self.anime} has been declined as it didn't meet the required criteria"
        CreateNotification(self.contributor,msg)
    
    super(Question, self).delete(*args, **kwargs)


  def __str__(self):
    if len(self.question)>50: 
      return f"{self.question[:50]}"
    return f"{self.question}"


class Game(models.Model):
  game_owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="get_games")
  anime =  models.ForeignKey(Anime,on_delete=models.CASCADE,related_name="anime_game")
  score =models.IntegerField(default=0)
  gamesnumber = models.IntegerField(default=0)
  contributions = models.IntegerField(default=0)
  review = models.TextField(null=True,blank=True)
    
  def __str__(self):
    return f"{self.game_owner} had {self.gamesnumber} tests for {self.anime}"


class Notification(models.Model):
  owner =  models.ForeignKey(User,on_delete=models.CASCADE,related_name="getnotifications")
  notification = models.CharField(max_length=250)
  time = models.DateTimeField(default=None,null=True)
  seen = models.BooleanField(default=False)

  def save(self, *args, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
      f'notifications_group_{self.owner.id}',{
        'type':'send_notifications',
        'value':{ "notification": self.notification}
      }

    )
    super(Notification, self).save(*args, **kwargs)

