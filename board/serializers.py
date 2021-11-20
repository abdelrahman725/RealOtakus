from rest_framework import serializers

from .models import *

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id','username','points','level','tests_completed','tests_started','best_score','country')


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
    fields = ("id","question","advanced","choice1","choice2","choice3","choice4")

