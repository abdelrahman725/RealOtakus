from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from django.db.models import Count

from .models import *
from .constants import QUESTIONSCOUNT,COUNTRIES


class SocialAccountFilter(admin.SimpleListFilter):
    title = 'social account'
    parameter_name = 'social'

    def lookups(self, request, model_admin):
        return (
          ('Yes', ('Yes')),
          ('No', ('No')),
      )

    def queryset(self, request, queryset):  
          
      if self.value() == 'Yes':
        return queryset.filter(socialaccount__isnull=False)
      
      if self.value() == 'No':
        return queryset.filter(socialaccount=None)
    
      else:
        return queryset.all()

class ActiveAnimeFilter(admin.SimpleListFilter):
    title = 'active (has questions)'
    parameter_name = 'active'

    def lookups(self, request, model_admin):

        return (
          ('Yes', ('Yes')),
          ('No', ('No')),
      )

    def queryset(self, request, queryset):        
      if self.value() == 'Yes':
        return queryset.exclude(anime_questions=None)
      
      if self.value() == 'No':
        return queryset.filter(anime_questions=None)
      else:
        return queryset.all()

class CountryFilter(admin.SimpleListFilter):
    title = 'country'
    parameter_name = 'country'

    def lookups(self, request, model_admin):
      countries_choices = set()

      for c in User.objects.values_list('country',flat=True).distinct():
        countries_choices.add((c,(COUNTRIES[c])))
      return countries_choices
    
    def queryset(self, request, queryset): 
      if self.value():
        return queryset.filter(country=self.value())
      return queryset.all()

# admin mdoels inherit from this class can't be changed or deleted
class ReadOnly(admin.ModelAdmin):
 
  def has_change_permission(self, request, obj=None):
    return False
 
  def has_delete_permission(self, request, obj=None):
    return False



@admin.register(User)
class User_admin(admin.ModelAdmin):
  readonly_fields =  ("level","points","contributions_count","tests_started","tests_completed")
  list_display = ("username","id","points","contributor","contributions_count","quizes_score")
  filter_horizontal = ("animes_to_review",)
  search_fields = ("username__startswith",)
  list_filter  =  (
  ("animes_to_review",admin.RelatedOnlyFieldListFilter),
  SocialAccountFilter,
  "contributor",
  "level",
  CountryFilter
  )
  
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
  # def get_queryset(self, request):
  #   query = super(Question_admin, self).get_queryset(request)
  #   if not request.user.is_superuser:
  #     return query.exclude(contributor__username = "admin")
  #   return query

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


@admin.register(Anime)
class Anime_admin(ReadOnly):
  list_display = ("anime_name","total_questions","approved_questions","pending_questions") 
  search_fields = ("anime_name__startswith",)
  list_filter = (ActiveAnimeFilter,)
  
  def get_queryset(self, request):
    query = super(Anime_admin, self).get_queryset(request)
    return  query.annotate(questions_count=Count("anime_questions")).order_by('-questions_count')
   

@admin.register(Game)
class Game_admin(ReadOnly):
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
class Notification_admin(ReadOnly):
  list_display = ("owner","notification","time","seen")
  search_fields   =  ("owner__username__startswith",)
  list_filter  = (
    ("owner",admin.RelatedOnlyFieldListFilter),
    "seen",
    "time"
    )

