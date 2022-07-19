from rest_framework import serializers

from .models import *

class BasicUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id','username','points','level','country')


class AllUserInfo_Serializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id','username','points','level','tests_completed','tests_started','country','contributions_count')


class LeaderBoradSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('username','points','level','country','contributions_count')



class AnimeSerializer(serializers.ModelSerializer):
  class Meta:
    model = Anime
    fields = ("id","anime_name")


# used for each anime and its corresponding number of questions 
class Animes_with_Questions_Count_serializer(serializers.ModelSerializer):
  class Meta:
    model = Anime
    fields = ("id","anime_name","approved_questions")
    


class QuizAnimesSerializer(serializers.ModelSerializer):
  quiz_questions_count = serializers.IntegerField()
  class Meta:
    model = Anime
    fields = ("id","anime_name","quiz_questions_count")
    


class AnimeNameSerializer(serializers.ModelSerializer):
  class Meta:
    model = Anime 
    fields = ("anime_name",)


class AnimeContributionsSerializer(serializers.ModelSerializer):
  anime = AnimeNameSerializer() 
  class Meta:
    model = Game
    fields = ("contributions","anime")


class QuestionSerializer(serializers.ModelSerializer):
  anime = AnimeNameSerializer()

  class Meta:
    model = Question
    fields = ("id","anime","question","choice1","choice2","choice3","choice4")


class QuestionsWithAnimesSerializer(serializers.ModelSerializer):
  anime = AnimeNameSerializer() 
  class Meta:
    model = Question
    fields = ("anime","question","approved")



class GameSerializer(serializers.ModelSerializer):
  anime = AnimeNameSerializer() 
  class Meta:
    model = Game
    fields = ("anime","gamesnumber")


    
class NotificationsSerializer(serializers.ModelSerializer):
  class Meta: 
    model = Notification
    fields = ("id","notification","time","seen")
    
