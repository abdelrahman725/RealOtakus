from django.contrib import admin

from .models import *

@admin.register(User)
class User_info(admin.ModelAdmin):
  list_display=("id","username","points","highest_score","TestsCount")
  list_filter = ("level",)
  search_fields = ("username",)

@admin.register(Question)
class QuestionInfo(admin.ModelAdmin):
  list_display=("anime","question","right_answer","advanced")
  list_filter = ("anime","advanced")
  search_fields = ("question",)


@admin.register(Anime)
class AnimeInfo(admin.ModelAdmin):
  list_display = ("id","anime_name")

# admin.site.register(AnimeScore)

@admin.register(AnimeScore)
class AnimeScoreInfo(admin.ModelAdmin):
  list_display = ("user","anime","score")
  list_filter = ("user","anime")
  search_fields = ("user__username","anime__anime_name")