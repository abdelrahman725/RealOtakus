from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime


class User(AbstractUser):
  points = models.IntegerField(default=0)
  tests_completed = models.IntegerField(default=0)
  tests_started = models.IntegerField(default=0)
  country = models.CharField(null=True,max_length=60)
  contributor =  models.BooleanField(default=False)
  contributions_count = models.IntegerField(default=0)
  level_options = [
    ('beginner', 'beginner'),
    ('intermediate', 'intermediate'),
    ('advanced', 'advanced'),
    ('realOtaku', 'realOtaku'),]

  level = models.CharField(
    choices=level_options,max_length=20,default="beginner")
  def __str__(self):
    return self.username


Admin = User.objects.get(is_superuser=True)
  
class Anime(models.Model):
  anime_name = models.CharField(max_length=40,null=False,unique=True)
  questions_number= models.IntegerField(default=0)
  url= models.CharField(max_length=300,default="/")
  def __str__(self):
        return f"{self.anime_name}"

class Question(models.Model):
  anime    =  models.ForeignKey(Anime,on_delete=models.CASCADE,related_name="anime_questions")
  contributor = models.ForeignKey(User,on_delete=models.SET_NULL,related_name="contributions",null=True,default=Admin.pk)
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
  
  def save(self, *args, **kwargs):
    # if self.approved :
    #   the_anime = self.anime
    #   the_anime.questions_number+=1
    #   the_anime.save()

    if not self.contributor.is_superuser:
      user = self.contributor
      if self.approved :
        msg="" 
        if user.contributor == False:
          msg = "congratulations ! your first contribution has been approved and you are now an otaku contributor"
          user.contributor = True
        else:
          msg="congratulations you got your question approved another contribution added to your profile"

        new_notification = Notification(owner=user,notification=msg, time=datetime.now())
        new_notification.save()
        user.contributions_count +=1
        user.points+=10
        user.save()
      
    super(Question, self).save(*args, **kwargs)


  def delete(self, *args, **kwargs):
    if not self.contributor.is_superuser and not self.approved:
      msg = "sorry your question has been declined as it didn't meet the required criteria"
      new_notification = Notification(owner=self.contributor,notification=msg, time=datetime.now())
      new_notification.save()
    super(Question, self).delete(*args, **kwargs)


  def __str__(self):
    if len(self.question)>50: 
      return f"{self.question[:50]}"
    return f"{self.question}"


class Game(models.Model):
  game_owner = models.ForeignKey(User,on_delete=models.CASCADE,related_name="get_games")
  anime =  models.ForeignKey(Anime,on_delete=models.CASCADE)
  score =models.IntegerField(default=0)
  gamesnumber = models.IntegerField(default=0)
  review = models.TextField(null=True,blank=True)
  
  def __str__(self):
    return f"{self.game_owner} has {self.gamesnumber} tests for {self.anime}"


class Notification(models.Model):
  owner =  models.ForeignKey(User,on_delete=models.CASCADE,related_name="getnotifications")
  notification = models.CharField(max_length=250)
  time = models.DateTimeField(default=None)



class Post(models.Model):
  owner =models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_posts")
  post = models.TextField(blank=False)
  time = models.DateTimeField(default=None)
  likes = models.IntegerField(default=0)
  def save(self, *args, **kwargs):
    if not self.owner.contributor:
      print("\n" *3 + "##  Error! Post is not saved: only contributors allow to share posts" + "\n"*2)
      return

    super(Post, self).save(*args, **kwargs)
