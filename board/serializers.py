from rest_framework import serializers
from board.models import *


class SimpleUserDataSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = (
      'id',
      'username',
      'points',
      'level',
      'country'
    )


class ProfileDataSerializer(serializers.ModelSerializer):
  
  n_questions_reviewed = serializers.IntegerField()
  n_approved_contributions = serializers.IntegerField()

  class Meta:
    model = User
    fields = (
      'points',
      'level',
      'tests_completed',
      'n_questions_reviewed',
      'n_approved_contributions'
    )


class LeaderBoradSerializer(serializers.ModelSerializer):
  n_contributions = serializers.IntegerField()

  class Meta:  
    model = User
    fields = (
      'username',
      'points',
      'level',
      'n_contributions',
      'country'
    )


class AnimeSerializer(serializers.ModelSerializer):
  class Meta:
    model = Anime
    fields = ("id","anime_name")


class QuestionSerializer(serializers.ModelSerializer):
  anime = AnimeSerializer()
    
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
      "date_created",
      "date_reviewed",
      "reviewer_feedback",
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


# class UserInteractionSerializer(serializers.ModelSerializer):
#   anime = AnimeSerializer()
  
#   class Meta:
#     model = QuestionInteraction
#     fields = (
#       "anime",
#       "correct_answer"
#     )

class UserInteractionSerializer(serializers.ModelSerializer):
  right_answers = serializers.IntegerField()
  not_right_answers = serializers.IntegerField()

  class Meta:
    model = Anime
    fields = (
      "anime_name",
      "right_answers",
      "not_right_answers"
    )


class NotificationsSerializer(serializers.ModelSerializer):
  class Meta: 
    model = Notification
    fields = (
      "id",
      "notification",
      "kind",
      "time",
      "seen"
    )
    

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
    