from django.contrib import admin
from .models import *

@admin.register(User)
class User_admin(admin.ModelAdmin):
  list_display = ("id","username","points","country","contributor","contributions_count")
  list_filter  =  ("level","contributor","country")
  filter_horizontal = ("animes_to_review",)
  search_fields = ("username",)
  

@admin.register(Question)
class Question_admin(admin.ModelAdmin):
  readonly_fields =  ("correct_answers","wrong_answers")
  list_display    =  ("anime","question","contributor","approved")
  list_filter     =  ("anime","contributor","approved",)
  search_fields   =  ("question",)


@admin.register(Anime)
class Anime_admin(admin.ModelAdmin):
  def has_change_permission(self, request, obj=None):
      return False

  list_display = ("anime_name","id") 
  search_fields = ("anime_name",)


@admin.register(Game)
class Game_admin(admin.ModelAdmin):
  def has_change_permission(self, request, obj=None):
        return False

  list_display = ("game_owner","anime","gamesnumber","score","contributions")
  list_filter  = ("game_owner","anime")


@admin.register(Notification)
class Notification_admin(admin.ModelAdmin):
  def has_change_permission(self, request, obj=None):
        return False
      
  list_display = ("owner","notification","time","seen")
  list_filter  = ("owner","seen")
