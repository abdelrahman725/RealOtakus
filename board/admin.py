import pytz

from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from django.utils.translation import ugettext_lazy as _
from django.db.models import Count

from .models import *
from .helpers import CreateNotification
from .constants import QUESTIONSCOUNT,COUNTRIES

def to_local_date_time(utc_datetime):
  #return utc_datetime
  if utc_datetime:
    local_tz = pytz.timezone('Africa/Cairo')
    return utc_datetime.replace(tzinfo=pytz.utc).astimezone(local_tz)
    
# 8 customized filter classes
class SocialAccountFilter(admin.SimpleListFilter):
    title = 'social account'
    parameter_name = 'social_account'

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
    

class QuizTakerFilter(admin.SimpleListFilter):
    title = 'quiz takers'
    parameter_name = 'taken_quiz'

    def lookups(self, request, model_admin):

        return (
          ('Yes', ('Yes')),
          ('No', ('No')),
      )

    def queryset(self, request, queryset):        
      if self.value() == 'Yes':
        return queryset.filter(tests_completed__gt=0)
      
      if self.value() == 'No':
        return queryset.filter(tests_completed=0)
        

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


class ActiveAnimeFilter(admin.SimpleListFilter):
    title = 'Active'
    parameter_name = 'is_active'

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
     

class IsReviewerFilter(admin.SimpleListFilter):
    title = 'Reviewer'
    parameter_name = 'is_reviewer'

    def lookups(self, request, model_admin):

        return (
          ('Yes', ('Yes')),
          ('No', ('No')),
      )

    def queryset(self, request, queryset):        
      if self.value() == 'Yes':
        return queryset.exclude(animes_to_review=None)
      
      if self.value() == 'No':
        return queryset.filter(animes_to_review=None)
     

class ReviewersFilter(admin.SimpleListFilter):
    title = 'has reviewers'
    parameter_name = 'reviewers_exist'

    def lookups(self, request, model_admin):

        return (
          ('Yes', ('Yes')),
          ('No', ('No')),
      )

    def queryset(self, request, queryset):        
      if self.value() == 'Yes':
        return queryset.exclude(anime__reviewers=None)
      
      if self.value() == 'No':
        return queryset.filter(anime__reviewers=None)
     

class QuestionTypeFilter(admin.SimpleListFilter):
  title = 'contributor type'
  parameter_name = 'questions_contributor'

  def lookups(self, request, model_admin):

      return (
        ('admin', _('admin')),
        ('users', _('users'))
    )

  def queryset(self, request, queryset):

    if self.value() == 'admin':
      return queryset.filter(contributor__is_superuser=True)

    if self.value() == 'users':
      return queryset.filter(contributor__is_superuser=False)


class QuizGamesFilter(admin.SimpleListFilter):
  title = 'quiz games'
  parameter_name = 'quiz_games'

  def lookups(self, request, model_admin):
      return (
        ('all', _('All')),
        (None, _('Yes')),
        ('no', _('No'))
    )
  
  def choices(self, cl):
    for lookup, title in self.lookup_choices:
        yield {
            'selected': self.value() == lookup,
            'query_string': cl.get_query_string({
                self.parameter_name: lookup,
            }, []),
            'display': title,
        }

  def queryset(self, request, queryset):

    if self.value() == None:
      return queryset.filter(gamesnumber__gt=0)

    if self.value() == 'no':
      return queryset.filter(gamesnumber=0)


# admin models inherit from this class can't be changed or deleted
class ReadOnly(admin.ModelAdmin):
 
  def has_change_permission(self, request, obj=None):
    return False
 
  def has_delete_permission(self, request, obj=None):
  # should be False!
    return False


@admin.register(User)
class User_admin(admin.ModelAdmin):
  readonly_fields =  ("level",
  "points",
  "contributions_count",
  "tests_started",
  "tests_completed"
  )

  list_display = (
    "username",
    "email",
    "points",
    "tests_completed",
    "quizes_score",
    "total_contributions",
    "reviewer",
    "_animes_to_review",
    "country_name",
    "id"
  )

  list_filter  =  (
  QuizTakerFilter,
  IsReviewerFilter,
  SocialAccountFilter,
  "contributor",
  ("animes_to_review",admin.RelatedOnlyFieldListFilter),
  "level",
  CountryFilter
  )
  filter_horizontal = ("animes_to_review",)
  search_fields = ("username__startswith",)
  
  def get_queryset(self, request):    
    query = super(User_admin, self).get_queryset(request)
    return query.exclude(is_superuser=True,username="admin")

  def quizes_score(self, obj):
    from django.db.models import Sum
    games = Game.objects.filter(game_owner=obj,gamesnumber__gt=0).aggregate(Sum("score"),Sum("gamesnumber"))

    if games["gamesnumber__sum"]:
      correct_over_total_questions = games["score__sum"]  / (games["gamesnumber__sum"] * QUESTIONSCOUNT) 
      return f"{ round(correct_over_total_questions*100) } %"
    return "N/A"
  
  def reviewer(self,obj):
    return obj.animes_to_review.exists()
  reviewer.boolean = True

  def country_name(self,obj):
    if obj.country:
      return COUNTRIES[obj.country]
    return "N/A"
  country_name.short_description = "country"

  def _animes_to_review(self,obj):
    return obj.animes_to_review.all().count()
  def total_contributions(self,obj):
    return obj.contributions.filter(approved=True).count()


@admin.register(Question)
class Question_admin(admin.ModelAdmin):
  date_hierarchy = 'date_created'
  readonly_fields =  ("correct_answers","wrong_answers")
  list_display    =  (
    "question",
    "anime",
    "view_contributor_link",
    "approved",
    "number_of_reviewers",
    "_date_created"
  )

  list_filter = (
    QuestionTypeFilter,
    ReviewersFilter,
    "approved",
    ("anime",admin.RelatedOnlyFieldListFilter),
    ("contributor",admin.RelatedOnlyFieldListFilter),
    "date_created"
  )
  search_fields   =  ("question",)

  def delete_model(self, request, obj):
      CreateNotification(
          user=obj.contributor,
          content=f"sorry your question ({obj.question[:15]}...) got deleted by RealOtakus, as it didn't align with our Guidelines, you can read our Guidlines in Contribution form"
        )
      obj.delete()

# hide Delete button if it's approved question by the admin  
  def has_delete_permission(self, request, obj=None):
    if obj and obj.contributor:
      if obj.approved and obj.contributor.is_superuser:
        return False
    return True

  def view_contributor_link(self, obj):
    if obj.contributor:
      if obj.contributor.is_superuser:
        return "admin"
      url = reverse('admin:board_user_change', args=(obj.contributor.id,))
      return format_html('<a href="{}">{}</a>',url, obj.contributor.username)
    return "DELETED"

  view_contributor_link.short_description = "contributor"

# not used yet
  def view_anime_link(self, obj):
    url = reverse('admin:board_anime_change', args=(obj.anime.id,))
    return format_html('<a href="{}">{}</a>',url, obj.anime.anime_name)

  view_anime_link.short_description = "anime"

  def number_of_reviewers(self,obj):
    return obj.anime.reviewers.count()

  def _date_created(self,obj):
    return to_local_date_time(obj.date_created)


@admin.register(Anime)
class Anime_admin(ReadOnly):
  list_display = (
  "anime_name",
  "total_questions"
  ,"approved_questions",
  "pending_questions",
  "number_of_quiz_takers",
  "_reviewers"
  ) 
  search_fields = ("anime_name__startswith",)
  
  def custom_titled_filter(title):
    class Wrapper(admin.RelatedOnlyFieldListFilter):
        def __new__(cls, *args, **kwargs):
            instance = admin.RelatedOnlyFieldListFilter(*args, **kwargs)
            instance.title = title
            return instance
    return Wrapper

  list_filter = (
    ActiveAnimeFilter,
    ("reviewers", custom_titled_filter('reviewr'))
  )
  def number_of_quiz_takers(self,obj):
    return Game.objects.filter(anime=obj,gamesnumber__gt=0).count()

  def _reviewers(self,obj):
    return obj.reviewers.count()
  
  def get_queryset(self, request):
    query = super(Anime_admin, self).get_queryset(request)
    return  query.annotate(questions_count=Count("anime_questions")).order_by('-questions_count')
   

@admin.register(Game)
class Game_admin(ReadOnly):
  list_display = ("anime","game_owner_link","gamesnumber","score")
  search_fields   =  ("game_owner__username__startswith",)
  list_filter  = (
    QuizGamesFilter,
    ("game_owner",admin.RelatedOnlyFieldListFilter),
    ("anime",admin.RelatedOnlyFieldListFilter),
    )

  def game_owner_link(self, obj):
    url = reverse('admin:board_user_change', args=(obj.game_owner.id,))
    return format_html('<a href="{}">{}</a>',url, obj.game_owner.username)

  game_owner_link.short_description = "game owner"


@admin.register(Notification)
class Notification_admin(ReadOnly):
  list_display = ("owner","notification","_time","seen")
  search_fields   =  ("owner__username__startswith",)
  list_filter  = (
    ("owner",admin.RelatedOnlyFieldListFilter),
    "seen",
    "time"
    )

  def _time(self,obj):
    return to_local_date_time(obj.time)
