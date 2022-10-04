from rest_framework import serializers
from board.models import *


class SimpleUserDataSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id','username','points','level','country')


class AllUserDataSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = (
      'username',
      'points',
      'level',
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
      "id",
    )
  

class ContributionSerializer(serializers.ModelSerializer):
  question = QuestionSerializer()

  class Meta:
    model = Contribution
    fields = (
      "approved",
      "reviewer_feedback",
      "date_reviewed",
      "question"
    ) 
  

class AnswersSerializer(serializers.ModelSerializer):
  class Meta:
    model = Question
    fields = (
      "id",
      "right_answer"
    )


class AnimeInteractionsSerializer(serializers.ModelSerializer):
  n_user_interactions = serializers.IntegerField()
  n_active_questions  = serializers.IntegerField()
  
  class Meta:
    model = Anime 
    fields = (
      "id",
      "anime_name",
      "n_user_interactions",
      "n_active_questions",
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
      "right_answer",
      "choice1",
      "choice2",
      "choice3"
    )
    