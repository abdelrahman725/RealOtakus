from rest_framework import serializers

from board.models import *


class SimpleUserDataSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id','username','points','level','country')

class AllUserDataSerializer(serializers.ModelSerializer):
  # n_contributions = serializers.IntegerField()
  class Meta:
    model = User
    fields = (
      'id',
      'username',
      'points',
      'level',
      'contributions',
      'tests_completed',
      'tests_started',
      'country',
      )

class LeaderBoradSerializer(serializers.ModelSerializer):
  n_contributions = serializers.IntegerField()

  class Meta:  
    model = User
    fields = ('username','points','level','n_contributions','country')


class AnimeSerializer(serializers.ModelSerializer):
  class Meta:
    model = Anime
    fields = ("id","anime_name")

    

class AnimeNameSerializer(serializers.ModelSerializer):
  class Meta:
    model = Anime 
    fields = ("anime_name",)



class QuestionSerializer(serializers.ModelSerializer):
  anime = AnimeNameSerializer()
    
  class Meta:
    model = Question
    fields = (
      "anime",
      "question",
      "choice1",
      "choice2",
      "choice3",
      "right_answer",
      "active",
      "id",
    )


class AnswersSerializer(serializers.ModelSerializer):
  class Meta:
    model = Question
    fields = (
      "id",
      "right_answer"
    )


class AnimeInteractionsSerializer(serializers.ModelSerializer):
  user_interactions = serializers.IntegerField()
  total_questions  = serializers.IntegerField()
  
  class Meta:
    model = Anime 
    fields = (
      "id",
      "anime_name",
      "user_interactions",
      "total_questions"
    )

class NotificationsSerializer(serializers.ModelSerializer):
  class Meta: 
    model = Notification
    fields = ("id","notification","kind","time","seen")
    

class QuestionsApiService(serializers.ModelSerializer):
    
  class Meta:
    model = Question
    fields = (
      "id",
      "question",
      "choice1",
      "choice2",
      "choice3",
      "right_answer",
    )
    