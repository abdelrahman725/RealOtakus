from rest_framework import serializers

from .models import *

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id','username','points','level','tests_completed','tests_started','country','contributions_count')


class AnimeSerializer(serializers.ModelSerializer):
  class Meta:
    model = Anime
    fields = '__all__'


class AnimeSimpleSerializer(serializers.ModelSerializer):
  class Meta:
    model = Anime
    fields = ("id","anime_name")

class QuestionSerializer(serializers.ModelSerializer):
  class Meta:
    model = Question
    fields = '__all__'


class GameSerializer(serializers.ModelSerializer):
  class Meta:
    model = Game
    fields = '__all__'

    

class NotificationsSerializer(serializers.ModelSerializer):
  class Meta:
    model = Notification
    fields = '__all__'