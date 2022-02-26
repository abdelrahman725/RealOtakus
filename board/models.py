from django.db import models
from django.contrib import admin
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
  points = models.IntegerField(default=0)
  level = models.CharField(max_length=30,null=False,default="beginner")
  tests_completed = models.IntegerField(default=0)
  tests_started = models.IntegerField(default=0)
  best_score = models.IntegerField(default=0)
  country = models.CharField(null=True,max_length=60)
  def __str__(self):
    return self.username

  
class Anime(models.Model):
  anime_name = models.CharField(max_length=100,null=False,unique=True)
  url= models.CharField(max_length=300,default="/")
  total_answers =  models.IntegerField(default=0)
  total_score = models.IntegerField (default=0)
  def __str__(self):
        return f"{self.anime_name}"

class Question(models.Model):
  anime    =  models.ForeignKey(Anime,on_delete=models.CASCADE,related_name="anime_questions")
  contributor = models.ForeignKey(User,on_delete=models.SET_NULL,related_name="contributions",null=True)
  advanced =  models.BooleanField(default=False)
  approved = models.BooleanField(default=True)
  question =  models.TextField(blank=False,unique=True)
  choice1  =  models.TextField(blank=False,null=True)
  choice2  =  models.TextField(blank=False,null=True)
  choice3  =  models.TextField(blank=False,null=True)
  choice4  =  models.TextField(blank=False,null=True)
  right_answer = models.TextField(blank=False,null=True)
  
  def __str__(self):
    if len(self.question)>70:
      return f"{self.question[:70]}"
    return f"{self.question}"


class Game(models.Model):
  game_owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="get_games")
  anime =  models.ForeignKey(Anime,on_delete=models.CASCADE)
  gamesnumber = models.IntegerField(default=0)
  def __str__(self):
    return f"{self.game_owner} has {self.gamesnumber} games for {self.anime}"
