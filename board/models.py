from django.db import models
from django.contrib import admin
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
  points = models.IntegerField(default=0)
  highest_score =  models.IntegerField(default=0)
  level = models.CharField(max_length=30,null=False,default="beginner")
  TestsCount= models.IntegerField(default=0)

class Anime(models.Model):
  anime_name = models.CharField(max_length=100,null=False,unique=True)
  def __str__(self):
        return f"{self.anime_name}"

class Question(models.Model):
  anime = models.ForeignKey(Anime,on_delete=models.CASCADE,related_name="anime_question")
  question =  models.TextField(blank=False,unique=True)
  advanced = models.BooleanField(default=False)
  choice1 =  models.TextField(blank=False,null=True)
  choice2 =  models.TextField(blank=False,null=True)
  choice3 =  models.TextField(blank=False,null=True)
  right_answer = models.TextField(blank=False,null=True)
  def __str__(self):
        return f"{self.question[:len(self.question)%70]}"


