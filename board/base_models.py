from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class Anime(models.Model):
  anime_name = models.CharField(max_length=40,unique=True)
  url = models.CharField(max_length=300,default="/")
  
  class Meta:
    abstract = True 


class User(AbstractUser):
  points = models.IntegerField(default=0)
  tests_completed = models.PositiveIntegerField(default=0)
  tests_started = models.PositiveIntegerField(default=0)
  country = models.CharField(null=True,max_length=60,blank=True)
  contributor =  models.BooleanField(default=False)
  contributions_count = models.PositiveIntegerField(default=0)
  animes_to_review = models.ManyToManyField(Anime,related_name="reviewers",blank=True)

  level_options = [
    ('beginner', 'beginner'),
    ('intermediate', 'intermediate'),
    ('advanced', 'advanced'),
    ('realOtaku', 'realOtaku'),]

  max_level_length = max([len(level[0]) for level in level_options])

  level = models.CharField(choices=level_options,max_length = max_level_length, default=level_options[0])

  class Meta:
    abstract = True


class Question(models.Model):
  anime  = models.ForeignKey(Anime,on_delete=models.CASCADE,related_name="anime_questions")
  contributor = models.ForeignKey(User,on_delete=models.SET_NULL,related_name="contributions",null=True,blank=True,default=1)

  question =  models.TextField(max_length=300,unique=True)
  choice1  =  models.TextField(max_length=150)
  choice2  =  models.TextField(max_length=150)
  choice3  =  models.TextField(max_length=150)
  choice4  =  models.TextField(max_length=150)
  right_answer = models.TextField(max_length=150)

  approved = models.BooleanField(default=True)

  correct_answers= models.PositiveIntegerField(default=0)
  wrong_answers= models.PositiveIntegerField(default=0)  
  advanced =  models.BooleanField(default=False)
  
  class Meta:
      abstract = True


class Game(models.Model):
  game_owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="get_games")
  anime =  models.ForeignKey(Anime,on_delete=models.CASCADE,related_name="anime_games")
  score = models.PositiveIntegerField(default=0)
  gamesnumber = models.PositiveIntegerField(default=0)
  contributions = models.PositiveIntegerField(default=0)
 
  class Meta:
      abstract = True


class Notification(models.Model):
  owner =  models.ForeignKey(User,on_delete=models.CASCADE,related_name="getnotifications")
  notification = models.CharField(max_length=250)
  time = models.DateTimeField(default=timezone.now)
  seen = models.BooleanField(default=False)

  class Meta:
    abstract= True
