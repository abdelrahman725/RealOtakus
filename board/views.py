from django.shortcuts import render, redirect
from django.http import  JsonResponse
from django.db import connection

from rest_framework.decorators import api_view
from rest_framework.response import Response

import json
import random
from datetime import datetime

from .models import *
from .serializers import *
from .helpers import login_required 

animes_dict = {}
posts_dict = {}

game = {}
game_questions = {}


AnimesWithQuestions = Anime.objects.filter(anime_questions__isnull=False).distinct()
AllPosts = Post.objects.all()

for anime in AnimesWithQuestions:
  animes_dict[anime.pk] = anime

for post in AllPosts:
  posts_dict[post.id] = post

def DevelopmentUser(): return User.objects.get(pk=28)

def Random():
  return random.randint(1, 4)


#@login_required
def ReactApp(request):
  return redirect("http://localhost:3000/home")
  #return render(request, "index.html")

#@login_required
@api_view(["GET"])
def GetUserData(request):
  print(request.user)
  serialized_data = UserSerializer(DevelopmentUser(),many=False)
  return Response(serialized_data.data)

  
# done chache
@api_view(["GET"])
def GetAvailableAnimes(request):
  serialized_data = AnimeSerializer(AnimesWithQuestions,many=True)
  return Response(serialized_data.data)



#@login_required
@api_view(["GET"])
def AllCompetitors(request):
  otakus = User.objects.exclude(pk=1).exclude(points=0).order_by('-points')
  serialized_data = UserSerializer(otakus,many=True)
  return Response(serialized_data.data)


# -------------------------------------- Test Handling functions  ----------------------------------------


#@login_required
@api_view(["GET"])
def GetTest(request,game_anime):
  current_user =  DevelopmentUser()
  selected_anime = animes_dict[game_anime]
  
  #current_user.tests_started+=1
  #current_user.save()

#---------testing only and to delete later--------------

  questions=selected_anime.anime_questions.filter(approved=True).exclude(contributor=current_user)[:5]
  serialized_data = QuestionSerializer(questions,many=True)
  return Response(serialized_data.data)



  #-------------real code ---------
  # CurrentGame, created = Game.objects.get_or_create(game_owner=current_user,anime=selected_anime)

  # index = CurrentGame.gamesnumber
  
  # if index * 5 < selected_anime.questions_number:
  #   CurrentGame.gamesnumber+=1
  #   game[current_user.id] = CurrentGame
  #   CurrentGame.save() 
  #   questions=selected_anime.anime_questions.filter(approved=True).exclude(contributor=current_user)[5*index:(5*index)+5]  

  #   game_questions[current_user.id] =questions
    
  #   serialized_data = QuestionSerializer(questions,many=True)
  #   return Response(serialized_data.data)

  # return JsonResponse({"message": "sorry out of questions for this anime"})







#@login_required
@api_view(["POST"])
def SubmitTest(request):
  user =  DevelopmentUser()
  test_score = 0
  test_results = request.data["answers"]
  review = request.data["review"]
  questions =game_questions[user.id]

  for q,question in zip(test_results,questions):
    
    if test_results[q] == question.right_answer:
      question.correct_answers+=1
      user.points+=1
      test_score+=1
    else:
      question.wrong_answers+=1
    question.save()
  
  del game_questions[user.id]
  
  
  user.tests_completed+=1
  CurrentGame= game[user.id]

  CurrentGame.score += test_score
  if review:
    CurrentGame.review = review
  
  CurrentGame.save()
  user.save()

  return JsonResponse({"message": "test submitted successfully","test_score":test_score})


# ------------------------------------------------------------------------------------



#@login_required
@api_view(["POST"])
def MakeContribution(request):
  anime = animes_dict[request.data["anime"]]

  question=request.data["question"]
  right_answer=request.data["correct"]
  
  c1=request.data["choice_1"]
  c2=request.data["choice_2"]
  c3=request.data["choice_3"]
  c4=right_answer

  random_number = Random()

  if random_number == 1:
    c1=request.data["choice_3"]
    c2=request.data["choice_2"]
    c3=right_answer
    c4=request.data["choice_1"]

  if random_number == 2:
    c1=request.data["choice_1"]
    c2=right_answer
    c3=request.data["choice_3"]
    c4=request.data["choice_2"]

  if random_number == 3:
    c1=right_answer
    c2=request.data["choice_2"]
    c3=request.data["choice_3"]
    c4=request.data["choice_1"]


  Question.objects.create(anime=anime,contributor= DevelopmentUser(),approved=False,
  question=question,right_answer=right_answer,choice1=c1,choice2=c2,choice3=c3,choice4=c4)

  return JsonResponse({"message": "new question has been added by a contributor and waits approval"})


#@login_required
@api_view(["GET"])
def UserContributions(request):
  user_questions = Question.objects.filter(contributor=DevelopmentUser())
  serialized_data = QuestionSerializer(user_questions,many=True)
  return Response(serialized_data.data)


#@login_required
@api_view(["GET"])
def GetUserProfile(request,user):
  requested_user = User.objects.get(pk=user)
  serialized_data = UserSerializer(requested_user)
  return Response(serialized_data.data)


#@login_required
@api_view(["POST"])
def SharePost(request):
  post_content = request.data["post"]
  new_post=Post.objects.create(owner=DevelopmentUser(),post=post_content,time=datetime.now())
  posts_dict[new_post.id] = new_post
  return JsonResponse({"message": "you have shared a post successfully"})



#@login_required
@api_view(["PUT"])
def Like(request,id):
  post= None
  try:
    post = posts_dict[id]
  except KeyError:
    post = Post.objects.get(pk=id)
  post.likes+=1
  post.save()
  posts_dict[id] = post

  return JsonResponse({"message": "like received, post has been updated"})



@api_view(["GET"])
def GetPosts(request):
  allposts = posts_dict.values()
  serialized_data = PostSerializer(allposts,many=True)
  return Response(serialized_data.data)


#@login_required
@api_view(["POST"])
def DeletePost(request,id):
  del posts_dict[id]
  post=Post.objects.get(pk=id)
  if post.owner == DevelopmentUser():
    post.delete()
  return JsonResponse({"message": "post is deleted"})


# str_repr = repr(AnimesWithQuestions)
# connection.queries:
