from rest_framework import serializers

from .models import *

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id','username','points','level','tests_completed','tests_started','country','contributions_count','contributor')



class DashBoardSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('username','points','level','country','contributions_count')



class AnimeSerializer(serializers.ModelSerializer):
  class Meta:
    model = Anime
    fields = '__all__'



class QuestionSerializer(serializers.ModelSerializer):
  class Meta:
    model = Question
    fields = ("id","anime","question","choice1","choice2","choice3","choice4")


class GameSerializer(serializers.ModelSerializer):
  class Meta:
    model = Game
    fields = '__all__'

    

class NotificationsSerializer(serializers.ModelSerializer):
  class Meta:
    model = Notification
    fields = '__all__'



class PostSerializer(serializers.ModelSerializer):
  class Meta:
    model = Post
    fields = '__all__'