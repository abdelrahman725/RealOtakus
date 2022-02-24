from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, generics

import json

from .models import *
from .serializers import *
from .helpers import login_required 

def DevelopmentUser(): return User.objects.get(pk=28)


# render react build page
@login_required
def ReactApp(request):
  return redirect("http://localhost:3000/home")
  #return render(request, "index.html")


@api_view(["GET"])
def GetUserData(request):
  serialized_data = UserSerializer(DevelopmentUser(),many=False)
  return Response(serialized_data.data)

  

@api_view(["GET"])
def GetAvailableAnimes(request):
  AnimesWithQuestions = Anime.objects.filter(anime_question__isnull=False).distinct()
  serialized_data = AnimeSimpleSerializer(AnimesWithQuestions,many=True)
  return Response(serialized_data.data)


@api_view(["GET"])
def AllCompetitors(request):
  otakus = User.objects.all()
  serialized_data = UserSerializer(otakus,many=True)
  return Response(serialized_data.data)




@api_view(["POST"])
def TestPost(request):
  return JsonResponse({"message": "oka ya gamd"})



# @login_required
# @api_view(["GET"])
# def GetAnimeOrdered(request):
#   sorted_animes = (Anime.objects.filter(anime_question__isnull=False).distinct()).order_by('-total_score')
#   serialized_data = AnimeSerializer(sorted_animes,many=True)
#   return Response(serialized_data.data)



# @login_required
# @api_view(["POST"])
# def GetTest(request):
#   current_user = request.user
#   current_user.tests_started+=1
#   current_user.save()
#   selected_animes=request.data["selectedanimes"]
#   questions=[]
#   for anime in selected_animes:
#     EachAnime_4_Questions=Question.objects.filter(anime=anime["id"])[:4]
#     questions.append(EachAnime_4_Questions)
#   final_questions = list(chain(*questions))
  
#   serialized_data = QuestionSerializer(final_questions,many=True)
#   return Response(serialized_data.data)


# @login_required
# @api_view(["POST"])
# def CheckTest(request):
#   answers = request.data["results"]
#   questions_length = request.data["questionslength"]
#   test_score = 0
#   for Id, user_answer in answers.items():
#     question = Question.objects.get(pk=Id) 
#     anime = Anime.objects.get(pk=question.anime.id)
#     anime.total_answers+=1
#     if question.right_answer == user_answer:
#       test_score+=1
#       anime.total_score+=1
#     anime.save()


#   current_user = request.user
#   current_user.tests_completed+=1
#   passed = False

#   # check if user has passed the test
#   # because no quiz or score related data will be updated if the user failed the quiz

#   if test_score >= math.ceil(questions_length/2):
#     passed=True
#     current_user.points += test_score
    
#     if test_score > current_user.best_score:
#       current_user.best_score = test_score
    
#     if current_user.points >=200:
#       current_user.level = "real otaku"

#     elif current_user.points >=100:
#       current_user.level = "intermediate"

#   current_user.save()

#   return JsonResponse({"message": "test answers have been received","passed":passed,"testscore":test_score}, status=201)



