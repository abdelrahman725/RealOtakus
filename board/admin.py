from django.contrib import admin
from .models import *

@admin.register(User)
class User_info(admin.ModelAdmin):
  list_display=("id","username","points","TestsCount","country")
  list_filter = ("level",)
  search_fields = ("username",)
  

@admin.register(Question)
class QuestionInfo(admin.ModelAdmin):
  list_display=("anime","question","right_answer","advanced")
  list_filter = ("anime","advanced")
  search_fields = ("question",)


@admin.register(Anime)
class AnimeInfo(admin.ModelAdmin):
  list_display = ("anime_name","total_score","id")
  search_fields = ("anime_name",)

