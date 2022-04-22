from django.contrib import admin
from .models import *

@admin.register(User)
class User_info(admin.ModelAdmin):
  list_display=("id","username","points","country","tests_started","contributor","contributions_count")
  list_filter = ("level","contributor",)
  filter_horizontal=("animes_to_review",)
  search_fields = ("username",)
  

@admin.register(Question)
class QuestionInfo(admin.ModelAdmin):
  list_display=("anime","question","right_answer","contributor","approved","correct_answers","wrong_answers")
  list_filter = ("anime","advanced","contributor","approved",)
  search_fields = ("question",)


@admin.register(Anime)
class AnimeInfo(admin.ModelAdmin):
  list_display = ("anime_name","id")
  search_fields = ("anime_name",)


@admin.register(Game)
class GameInfo(admin.ModelAdmin):
  list_display = ("game_owner","anime","gamesnumber","score")
  list_filter = ("game_owner",)


@admin.register(Notification)
class Notifications(admin.ModelAdmin):
  list_display = ("owner","notification","time")
  list_filter = ("owner",)
