import math
import pytz

from django import forms
from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from django.utils.translation import ugettext_lazy as _
from django.db.models import Count
from django.utils import timezone

from board.models import *
from board.helpers import MakeContributionApproved
from board.constants import QUESTIONSCOUNT,COUNTRIES


def to_local_date_time(utc_datetime):
  #return utc_datetime
  if utc_datetime:
    local_tz = pytz.timezone('Africa/Cairo')
    return utc_datetime.replace(tzinfo=pytz.utc).astimezone(local_tz)
    
# 10 customized filter classes

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


class IsContributorFilter(admin.SimpleListFilter):
    title = 'contributor'
    parameter_name = 'is_contributor'

    def lookups(self, request, model_admin):
        return (
          ('Yes', ('Yes')),
          ('No', ('No')),
      )

    def queryset(self, request, queryset):  
          
      if self.value() == 'Yes':
        return queryset.filter(contributions__question__approved=True)
      
      if self.value() == 'No':
        return queryset.exclude(contributions__question__approved=True)
    

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
  title = 'Type'
  parameter_name = 'questions_contributor'

  def lookups(self, request, model_admin):

      return (
        ('admin', _('admin')),
        ('users', _('users'))
    )

  def queryset(self, request, queryset):

    if self.value() == 'admin':
      return queryset.filter(contribution__isnull=True)

    if self.value() == 'users':
      return queryset.filter(contribution__isnull=False)


class OldestToNewestContributionsFilter(admin.SimpleListFilter):
  title = 'oldest to newest'
  parameter_name = 'order_by_oldest'

  def lookups(self, request, model_admin):

      return (
        ('yes', _('yes')),
    )

  def queryset(self, request, queryset):
    if self.value() == 'yes':
      # in testing (when datetime data is random)
      return queryset.order_by("question__date_created")
      # in actual use
      return queryset.order_by("id")


class ContributionState(admin.SimpleListFilter):
  title = 'state'
  parameter_name = 'state'

  def lookups(self, request, model_admin):

      return (
        ('p', _('Pending.....')),
        ('r', _('Reviewed')),
        ('a', _('Approved')),
        ('f', _('Declined'))
    )

  def queryset(self, request, queryset):
    if self.value() == 'p':
      return queryset.filter(reviewer__isnull=True)
    
    if self.value() == 'r':
      return queryset.filter(reviewer__isnull=False)

    if self.value() == 'a':
      return queryset.filter(question__approved=True,reviewer__isnull=False)

    if self.value() == 'f':
      return queryset.filter(question__approved=False,reviewer__isnull=False)



# admin models inherit from this class can't be changed or deleted
class ReadOnly(admin.ModelAdmin):
 
  def has_change_permission(self, request, obj=None):
    return False
 
  def has_delete_permission(self, request, obj=None):
    return False





def move_to_production(modeladmin, request, queryset):
    queryset.update(active=True)

def remove_from_production(modeladmin, request, queryset):
    queryset.update(active=False)

def approve(modeladmin, request, queryset):  
  for question in queryset:
    question.approved=True
    question.save()
    MakeContributionApproved(question)


def delete_selected(modeladmin, request, queryset):
  [question.delete() for question in queryset]
  


@admin.register(Question)
class Question_admin(admin.ModelAdmin):
  #date_hierarchy = 'date_created'
  actions = [
    delete_selected,
    move_to_production,
    remove_from_production,
    approve
  ]

  readonly_fields =  (
    "anime",
    "date_created",
    "correct_answers",
    "wrong_answers"
  )

  list_display    =  (
    "question",
    "right_answer",
    "choice1",
    "choice2",
    "choice3",
    "active",
    "anime",
    "approved",
    #"number_of_reviewers",
    "_date_created"
  )

  list_filter = (
    QuestionTypeFilter,
    "approved",
    "active",
    ReviewersFilter,
    ("anime",admin.RelatedOnlyFieldListFilter),
    "date_created"
  )
  search_fields   =  ("question",)

  def save_model(self, request, obj, form, change):
    MakeContributionApproved(obj)
    super().save_model(request, obj, form, change)


# hide Delete button if it's a production question
  def has_delete_permission(self, request, obj=None):
    if obj:
      return not obj.active

  def number_of_reviewers(self,obj):
    return obj.anime.reviewers.count()

  def _date_created(self,obj):
    return to_local_date_time(obj.date_created)

  def _date_reviewed(self,obj):
    return to_local_date_time(obj.contribution.date_reviewed)


@admin.register(Contribution)
class Contribution_admin(admin.ModelAdmin):
  readonly_fields =  (
    "date_reviewed",
  )

  list_display = (
    "state",
    "contributor",
    "view_question",
    "reviewer",
    "reviewer_feedback",
    "_date_created",
    "_date_reviewed",
    "reviewed_after"
  )

  list_filter  = (
    ContributionState,
    ("contributor",admin.RelatedOnlyFieldListFilter),
    ("reviewer",admin.RelatedOnlyFieldListFilter),
    "reviewer_feedback",
    OldestToNewestContributionsFilter,
    "date_reviewed"

  )

  def _date_created(self,obj):
    return to_local_date_time(obj.date_created)

  def _date_reviewed(self,obj):
    return to_local_date_time(obj.date_reviewed)
  
  def reviewed_after(self,obj):
    
    if obj.date_created and obj.date_reviewed:

      time_diff = obj.date_reviewed - obj.date_created

      if time_diff.days >=365:  
        return f"{math.floor(time_diff.days/365)} years"  
      
      if time_diff.days >=30:
        return f"{math.floor(time_diff.days/30)} months"  
      
      if time_diff.days >=1:
        return f"{time_diff.days} days"

      if time_diff.seconds >= 3600:
        return f"{math.floor(time_diff.seconds/3600)} hours"

      if time_diff.seconds > 60:
        return f"{math.floor(time_diff.seconds/60)} minutes"
      
      return f"{time_diff.seconds} seconds"

    return "N/A"
  
  def state(self,obj):
    if not obj.date_reviewed and not obj.reviewer:
      return "pending ..."
    
    if obj.question.approved == True:
      return "ok approved"
    
    return "sorry rejected"  
  
  
  # display only list of questions that aren't 
  # (already contributions or production or approved)  
  def get_form(self, request, obj, **kwargs):
    form = super(Contribution_admin,self).get_form(request, obj, **kwargs)
    
    if not obj:
      form.base_fields['question'] = forms.ModelChoiceField(
        queryset=Question.objects.filter(
          contribution__isnull=True,
          approved=False,
          active=False
        )
      )
    return form

  def get_readonly_fields(self, request, obj=None):

    if obj:
        return self.readonly_fields + ('question','contributor','reviewer','reviewer_feedback')
    return self.readonly_fields

  def view_question(self, obj):
    url = reverse('admin:board_question_change', args=(obj.question.id,))
    return format_html('<a href="{}">{}</a>',url, obj.question.question)
  view_question.short_description = "question"



@admin.register(User)
class User_admin(admin.ModelAdmin):
  readonly_fields =  (
  "level",
  "points",
  "tests_started",
  "tests_completed"
  )

  list_display = (
    "username",
    "email",
    "level",
    "points",
    "tests_completed",
    "contributor",
    "reviewer",
    "_animes_to_review",
    "country_name",
    "id"
  )

  list_filter  =  (
  QuizTakerFilter,
  IsContributorFilter,
  IsReviewerFilter,
  SocialAccountFilter,

  ("animes_to_review",admin.RelatedOnlyFieldListFilter),
  "level",
  CountryFilter
  )
  filter_horizontal = ("animes_to_review",)
  search_fields = ("username__startswith",)
  
  def get_queryset(self, request):    
    query = super(User_admin, self).get_queryset(request)
    return query.exclude(is_superuser=True,pk=1)

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
  
  def contributor(self,obj):
    if obj.contributions.filter(question__approved=True):
      return True
    return False
  contributor.boolean= True
  
  def country_name(self,obj):
    if obj.country:
      return COUNTRIES[obj.country]
    return "N/A"
  country_name.short_description = "country"

  def _animes_to_review(self,obj):
    return obj.animes_to_review.all().count()



@admin.register(Anime)
class Anime_admin(ReadOnly):
  list_display = (
  "anime_name",
  "total_questions",
  "approved_questions",
  "pending_questions",
  "rejected_questions",
  "quiz_takers",
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
  def quiz_takers(self,obj):
    return obj.anime_games.count()

  def _reviewers(self,obj):
    return obj.reviewers.count()
  
  def get_queryset(self, request):
    query = super(Anime_admin, self).get_queryset(request)
    return  query.annotate(questions_count=Count("anime_questions")).order_by('-questions_count')
   

@admin.register(Game)
class Game_admin(ReadOnly):
  readonly_fields= ("score","gamesnumber")
  list_display = (
    "anime",
    "game_owner_link",
    "gamesnumber",
    "score"
  )
  search_fields   =  ("game_owner__username__startswith",)
  list_filter  = (
    ("game_owner",admin.RelatedOnlyFieldListFilter),
    ("anime",admin.RelatedOnlyFieldListFilter),
    )

  def game_owner_link(self, obj):
    url = reverse('admin:board_user_change', args=(obj.game_owner.id,))
    return format_html('<a href="{}">{}</a>',url, obj.game_owner.username)

  game_owner_link.short_description = "game owner"


@admin.register(Notification)
class Notification_admin(ReadOnly):
  list_display = (
    "kind",
    "owner",
    "notification",
    "_time",
    "seen"
  )
  search_fields   =  ("owner__username__startswith",)
  list_filter  = (
    ("owner",admin.RelatedOnlyFieldListFilter),
    "seen",
    "kind",
    "time"
    )

  def _time(self,obj):  return to_local_date_time(obj.time)
