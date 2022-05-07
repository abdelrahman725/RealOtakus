from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime
from .consumer import NotificationConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

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
  question =  models.TextField(blank=False,unique=True)
  choice1  =  models.TextField(blank=False,null=True)
  choice2  =  models.TextField(blank=False,null=True)
  choice3  =  models.TextField(blank=False,null=True)
  choice4  =  models.TextField(blank=False,null=True)
  right_answer = models.TextField(blank=False,null=True)
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
        
        msg=""
        # then it's his first approved contribution
        if user.contributor ==False:
          user.contributor=True
          msg = "your first contribution has been approved and you are now an otaku contributor"

        # subsequent approved contributions 
        else:
          msg=f"congratulations your question on {self.anime} got  approved, another contribution added to your profile"


        CurrentGame, created = Game.objects.get_or_create(game_owner=user,anime=self.anime)
        CurrentGame.contributions+=1
        CurrentGame.save()
  

        new_notification = Notification(owner=user,notification=msg, time=datetime.now())
        new_notification.save()
        user.contributions_count +=1
        user.points+=10
        user.save()
      
    super(Question, self).save(*args, **kwargs)


  def delete(self, *args, **kwargs):
    if not self.contributor.is_superuser:
      if not self.approved:
        msg = f"sorry your last question on {self.anime} has been declined as it didn't meet the required criteria"
        new_notification = Notification(owner=self.contributor,notification=msg, time=datetime.now())
        new_notification.save()
    
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
  def save(self,*args,**kwargs):
    # if the number of approved contributions for that particular user in that specific anime reaches 5 contributions then the user is qualified to be a reviewer for that anime 
    
    if self.contributions == 5:
      self.game_owner.animes_to_review.add(self.anime)

      Notification.objects.create(owner=self.game_owner,notification=f"now you can review {self.anime} questions!")
    super(Game,self).save(*args, **kwargs)
    
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

