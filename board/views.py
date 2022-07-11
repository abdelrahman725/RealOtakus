from django.db import connection, IntegrityError
from django.db.models import Count,Q
from django.shortcuts import render, redirect
from django.http import  JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import random
from time import sleep

from .models import *
from .serializers import *
from .helpers import login_required 

animes_dict = {}

game = {}
game_questions = {}


for anime in Anime.objects.all():
  animes_dict[anime.pk] = anime


def GetWantedUser(request):
  return request.user
  username = "yara"
  return User.objects.get(username=username)



@login_required
def ReactApp(request):
  #return redirect("http://localhost:3000/home")
  return render(request, "index.html")

@login_required
@api_view(["GET","POST"])
def GetUserData(request):
  user =  GetWantedUser(request)

  if request.method == "POST":
    user.country = request.data["country"]
    user.save()
    return Response({"countrycreated"},status=status.HTTP_201_CREATED)


  serialized_basic_data = BasicUserSerializer(user,many=False)

  serialized_notifications= NotificationsSerializer(user.getnotifications.all().order_by('-id') ,many=True)

  return Response({
     "user_data": serialized_basic_data.data,
     "notifications": serialized_notifications.data
    })


@login_required
@api_view(["GET"])
def GetDashBoard(request):

#Note :  we still have to figure out how many users will be shown in the dashboard
  otakus = User.objects.exclude(pk=1).order_by('-points')

  animes_with_questions_count = Anime.objects.annotate(approved_questions=Count("anime_questions",
  filter=Q(anime_questions__approved=True))).order_by("-anime_questions")
  
  LeaderBorad  = LeaderBoradSerializer(otakus,many=True)
  AnimesQuestionsINfo  = AnimeQuestionsSerializer(animes_with_questions_count,many=True)
  
  return Response({
    "leaderboard":LeaderBorad.data,
    "animes":AnimesQuestionsINfo.data})



# -------------------------------------- Test Handling functions ----------------------------------------

@login_required 
@api_view(["GET"])
def GetAvailableAnimes(request):

  user = GetWantedUser(request)
  animes_with_questions = Anime.objects.annotate(approved_questions=Count("anime_questions",filter=(Q(anime_questions__approved=True) & ~Q(anime_questions__contributor=user)))).filter(approved_questions__gte=5)
  
  user_games_dict={}
  for game in Game.objects.filter(game_owner=user):
    user_games_dict[game.anime.id] = game.gamesnumber

  serialized_animes = AnimeQuestionsSerializer(animes_with_questions,many=True)



  return Response({
    "animes":serialized_animes.data,
    "games":user_games_dict 
    })



@login_required
@api_view(["GET"])
def GetTest(request,game_anime):
  current_user =  GetWantedUser(request)
  selected_anime = animes_dict[game_anime]
  current_user.tests_started+=1
  current_user.save()

  CurrentGame, created = Game.objects.get_or_create(game_owner=current_user,anime=selected_anime)

  index = CurrentGame.gamesnumber * 5

#this game questions
  questions=selected_anime.anime_questions.filter(approved=True).exclude(contributor=current_user)[index:index+5]

  CurrentGame.gamesnumber+=1
  game[current_user.id] = CurrentGame
  CurrentGame.save() 
  
  game_questions[current_user.id] ={}

  for q in questions:
    game_questions[current_user.id][q.id] = q

  serialized_data = QuestionSerializer(questions,many=True)
  return Response(serialized_data.data)



@login_required
@api_view(["POST"])
def SubmitTest(request):
  user =  GetWantedUser(request)
  test_score = 0
  test_results = request.data["results"]
  
  questions =game_questions[user.id]

  for q in test_results:
    Q=questions[int(q)]
    
    if test_results[q] == Q.right_answer:
      Q.correct_answers+=1
      user.points+=1
      test_score+=1

    else:
      Q.wrong_answers+=1
    Q.save()
  


  def CheckLevel(user,user_points):
    
    previous_level = user.level
    if user_points >=5000:
      user.level = "realOtaku" 

    elif user_points >= 3000:
      user.level  = "advanced"
    elif user_points >= 1000:
      user.level = "intermediate"

    # level up the user by pushing a notfication 
    if previous_level != user.level :
      Notification.objects.create(owner=user,notification=f"Level up to {user.level}! good work")


  CheckLevel(user,user.points)
  
  user.tests_completed+=1
  CurrentGame= game[user.id]
  CurrentGame.score += test_score

  CurrentGame.save()
  user.save()

  answers_dict = {}

  for key in game_questions[user.id]:
    answers_dict[key]= game_questions[user.id][key].right_answer


  # deleteing used cache from memory : 
  del game_questions[user.id]
  del game[user.id]
  

  return JsonResponse({"message": "test submitted successfully","score":test_score,"answers":answers_dict, "level":user.level})


# ------------------------------------------------------------------------------------




@login_required
@api_view(["GET"])
def GetAllAnimes(request):
  serialized_data = AnimeSerializer(animes_dict.values(),many=True)
  return Response(serialized_data.data)


@login_required
@api_view(["POST"])
def MakeContribution(request):
  user = GetWantedUser(request)
  
  try:
    anime = animes_dict[int(request.data["anime"])]
  except: 
    return  JsonResponse({"anime_id doesn't exist! or it's not an int"})
  
  def CheckDuplicatChoices(choices): 
    choies_set = set()
    for choice in choices:
      choies_set.add(choice)
    if len(choies_set) != len(choices):
      return True 
    return False 

  QuestionOBject = request.data["question"]

  right_answer = QuestionOBject["rightanswer"].strip()
  actualquestion = QuestionOBject["question"].strip()

  c1=QuestionOBject["choice1"].strip()
  c2=QuestionOBject["choice2"].strip()
  c3=QuestionOBject["choice3"].strip()
  
  choices = [c1,right_answer,c2,c3]
  random.shuffle(choices)

  
  # if CheckDuplicatChoices([c1,c2,c3,c4]):
  #   return JsonResponse({"message": f"choices can't have duplicates"})



  # check if the contributer user is already a reviewer of the anime associated with the question 

  is_anime_reviewr = False
  if anime in user.animes_to_review.all():
    is_anime_reviewr=True


  try:
    Question.objects.create(
      anime=anime,contributor= user,
      approved=is_anime_reviewr,
      question=actualquestion,right_answer=right_answer,
      choice1=choices[0],choice2=choices[1],
      choice3=choices[2],choice4=choices[3])
    
    if is_anime_reviewr:
      return JsonResponse({"message": f"you have contributed a new question for {anime}! it's approved since you are a reviewer of that anime"})


    #sleep(1)
    return JsonResponse({"message": f"your question submission for {anime} has been received and waits approval"})

  except  IntegrityError as e:
    if 'UNIQUE constraint' in str(e.args):
      return JsonResponse({"message": "sorry this question already exist"})

    return JsonResponse({"message": "error occurred, but stil IntegrityError"})



# endpoint for a reviewr to approve/decline a question contributed by other user/s
@login_required
@api_view(["POST"])
def ReviewContribution(request):
  state = request.data["state"]
  q_id = int(request.data["question"])
  question = Question.objects.filter(pk=q_id)
  
  if not question.exists():
    return Response({"sorry this question doesn't exist anymore"},status=status.HTTP_404_NOT_FOUND)

  question = question[0]

  if state =="approve":
    question.approved=True
    question.save()
    return Response({"question got approved successfully"},status=status.HTTP_200_OK)


  if state =="decline":
    question.delete()
    return Response({"question got declined and deleted successfully"},status=status.HTTP_200_OK)

  
  return Response({"not expected response"},status=status.HTTP_200_OK)


@login_required
@api_view(["GET"])
def GetMyProfile(request):
  user = GetWantedUser(request)

  my_data = AllUserInfo_Serializer(user,many=False)
  pending_contributions = PendingQuestionsSerializer(user.contributions.filter(approved=False).order_by("-id"),many=True)

#contributed questions by other users for the current user to review and approve if any  
  questionsForReview = QuestionSerializer(Question.objects.filter(approved=False,anime__in=user.animes_to_review.all()).order_by("-id"),many=True)
  
# animes with contributed questions made by current user : 
  contributed_animes = AnimeContributionsSerializer(Game.objects.filter(game_owner=user,contributions__gt=0) 
   ,many=True)

  #sleep(2)
  return Response({
     "data": my_data.data,
     "PendingContributions": pending_contributions.data,
     "questionsForReview":questionsForReview.data,
     "animes_with_contributions":contributed_animes.data   
      })


@login_required
@api_view(["PUT"])
def UpdateNotificationsState(request):

  unseen_notifications=request.data["notifications"]

  Notification.objects.filter(pk__in=unseen_notifications).update(seen=True)

  return Response({f"notifications state of {request.user.username} are updated successfully"},status=status.HTTP_201_CREATED)


# str_repr = repr()
# connection.queries: