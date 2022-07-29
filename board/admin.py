from django.contrib import admin
from django.urls import reverse
from django.utils.http import urlencode
from django.utils.html import format_html

from .models import *
from .constants import QUESTIONSCOUNT


@admin.register(User)
class User_admin(admin.ModelAdmin):
  readonly_fields =  ("level","points","contributions_count","tests_started","tests_completed")
  list_display = ("username","id","points","contributor","contributions_count","quizes_score","is_staff")
  filter_horizontal = ("animes_to_review",)
  search_fields = ("username__startswith",)
  list_filter  =  ("contributor","level","is_staff",("animes_to_review",admin.RelatedOnlyFieldListFilter))
  
  def get_queryset(self, request):
    query = super(User_admin, self).get_queryset(request)
    return query.exclude(is_superuser=True,username="admin")

  def get_list_display(self, request):
    return self.list_display
  
  def quizes_score(self, obj):
    from django.db.models import Sum
    games = Game.objects.filter(game_owner=obj,gamesnumber__gt=0).aggregate(Sum("score"),Sum("gamesnumber"))

    if games["gamesnumber__sum"]:
      correct_over_total_questions = games["score__sum"]  / (games["gamesnumber__sum"] * QUESTIONSCOUNT) 
      return f"{ round(correct_over_total_questions*100) } %"
    return "N/A"


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

  def get_queryset(self, request):
    query = super(Question_admin, self).get_queryset(request)
    if not request.user.is_superuser:
      return query.exclude(contributor__username = "admin")
    return query

# prevent any deletion from anyone if this is one of my approved questions (main questions)  
  def has_delete_permission(self, request, obj=None):
    if obj and obj.approved and obj.contributor.is_superuser and obj.contributor.username =="admin":
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


# classes inherits from this class can't be changed or deleted
class ImmutableModel(admin.ModelAdmin):
 
  def has_change_permission(self, request, obj=None):
    return False
 
  def has_delete_permission(self, request, obj=None):
    return False

@admin.register(Anime)
class Anime_admin(ImmutableModel):
  list_display = ("anime_name","total_questions","approved_questions","pending_questions") 
  search_fields = ("anime_name__startswith",)
   
@admin.register(Game)
class Game_admin(ImmutableModel):
  list_display = ("anime","game_owner_link","gamesnumber","score","contributions")
  search_fields   =  ("game_owner__username__startswith",)
  list_filter  = (
    ("game_owner",admin.RelatedOnlyFieldListFilter),
    ("anime",admin.RelatedOnlyFieldListFilter)
    )

  def game_owner_link(self, obj):
    url = reverse('admin:board_user_change', args=(obj.game_owner.id,))
    return format_html('<a href="{}">{}</a>',url, obj.game_owner.username)

  game_owner_link.short_description = "game owner"

@admin.register(Notification)
class Notification_admin(ImmutableModel):
  list_display = ("owner","notification","time","seen")
  search_fields   =  ("owner__username__startswith",)
  list_filter  = (
    ("owner",admin.RelatedOnlyFieldListFilter),"seen","time")

