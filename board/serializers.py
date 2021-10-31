from rest_framework import serializers

from .models import *

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id','username','points','level','TestsCount','country')


class AnimeSerializer(serializers.ModelSerializer):
  class Meta:
    model = Anime
    fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
  class Meta:
    model = Question
    fields = '__all__'



class AnimeScoreSerializer(serializers.ModelSerializer):
  class Meta:
    model = AnimeScore
    fields = '__all__'