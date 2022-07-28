from django.contrib import admin
from django.urls import reverse
from django.utils.http import urlencode
from django.utils.html import format_html
from django.db.models import Count

from .models import *
from .constants import QUESTIONSCOUNT

# info = (Object._meta.app_label, Object._meta.model_name)


@admin.register(User)
class User_admin(admin.ModelAdmin):
  readonly_fields =  ("level","points","contributions_count","tests_started","tests_completed")
  list_display = ("username","id","points","contributor","contributions_count","quizes_score")
  filter_horizontal = ("animes_to_review",)
  search_fields = ("username__startswith",)
  list_filter  =  ("contributor","level",("animes_to_review",admin.RelatedOnlyFieldListFilter))
  
  def quizes_score(self, obj):
    from django.db.models import Sum
    games = Game.objects.filter(game_owner=obj,gamesnumber__gt=0).aggregate(Sum("score"),Sum("gamesnumber"))

    if games["gamesnumber__sum"]:
      correct_over_total_questions = games["score__sum"]  / (games["gamesnumber__sum"] * QUESTIONSCOUNT) 
      return f"{ round(correct_over_total_questions*100) } %"
    return "N/A"


@admin.register(Anime)
class Anime_admin(admin.ModelAdmin):
  list_display = ("anime_name","total_questions","approved_questions","pending_questions") 
  search_fields = ("anime_name__startswith",)

  def has_delete_permission(self, request, obj=None):
      if obj and obj.anime_questions.count() > 0:
        return False
      return True

  def has_change_permission(self, request, obj=None):
    return False
  

@admin.register(Question)
class Question_admin(admin.ModelAdmin):
  readonly_fields =  ("correct_answers","wrong_answers")
  list_display    =  ("question","view_contributor_link","approved","anime")
  list_filter     =  (

    ("anime",admin.RelatedOnlyFieldListFilter),
    ("contributor",admin.RelatedOnlyFieldListFilter),
     "approved"
  )
  search_fields   =  ("question",)

# prevent deletion if this is one of my approved questions (main questions)  
  def has_delete_permission(self, request, obj=None):
    if obj and obj.approved and obj.contributor.is_superuser:
      return False
    return True

  def view_contributor_link(self, obj):
    url = reverse('admin:board_user_change', args=(obj.contributor.id,))
    return format_html('<a href="{}">{}</a>',url, obj.contributor.username)

# not used yet
  def view_anime_link(self, obj):
    url = reverse('admin:board_anime_change', args=(obj.anime.id,))
    return format_html('<a href="{}">{}</a>',url, obj.anime.anime_name)

  view_contributor_link.short_description = "contributor"
  view_anime_link.short_description = "anime"

    
@admin.register(Game)
class Game_admin(admin.ModelAdmin):
  list_display = ("anime","game_owner_link","gamesnumber","score","contributions")
  search_fields   =  ("game_owner__username__startswith",)
  list_filter  = (
    ("game_owner",admin.RelatedOnlyFieldListFilter),
    ("anime",admin.RelatedOnlyFieldListFilter)
    )

  def has_change_permission(self, request, obj=None):
    return False

  def game_owner_link(self, obj):
    url = reverse('admin:board_user_change', args=(obj.game_owner.id,))
    return format_html('<a href="{}">{}</a>',url, obj.game_owner.username)

  game_owner_link.short_description = "game owner"


@admin.register(Notification)
class Notification_admin(admin.ModelAdmin):
  list_display = ("owner","notification","time","seen")
  search_fields   =  ("owner__username__startswith",)
  list_filter  = (
    ("owner",admin.RelatedOnlyFieldListFilter),"seen","time")

  def has_change_permission(self, request, obj=None):
    return False
