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
class QuestionAdmin(admin.ModelAdmin):
  #date_hierarchy = 'date_created'
  actions = [
    delete_selected,
    move_to_production,
    remove_from_production,
    approve
  ]

  #list_editable = ("approved",)

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
    #"number_of_reviewers",
    "_date_created"
  )

  list_filter = (
    QuestionTypeFilter,
    "active",
    ReviewersFilter,
    ("anime",admin.RelatedOnlyFieldListFilter),
    "date_created"
  )
  search_fields   =  ("question",)

  # def save_model(self, request, obj, form, change):
  #   MakeContributionApproved(obj)
  #   super().save_model(request, obj, form, change)


# hide Delete button if it's an active question
  def has_delete_permission(self, request, obj=None):
    if obj: return not obj.active
  

  def number_of_reviewers(self,obj):
    return obj.anime.reviewers.count()

  def _date_created(self,obj):
    return to_local_date_time(obj.date_created)

  def _date_reviewed(self,obj):
    return to_local_date_time(obj.contribution.date_reviewed)


@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
  list_display = (
    "_approved",
    "question",
    "contributor",
    "reviewer",
    "reviewer_feedback",
    "date_reviewed"
  )

  def _approved(self,obj):
    if obj.approved == None: return "pending..."
    if obj.approved == False: return "rejected"
    return "approved !"
  
  _approved.short_description = "state" 

 
@admin.register(QuestionInteraction)
class InteractionAdmin(admin.ModelAdmin):
  
  list_display = (
    "user",
    "question",
    "anime",
    "correct"
  )
  list_filter = (
    ("user",admin.RelatedOnlyFieldListFilter),
  )
  
  def anime(self,obj): 
    return obj.question.anime


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
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
    "contributions",
    "questions_reviewed",
    "reviewer_of",
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
    query = super(UserAdmin, self).get_queryset(request)
    return query.exclude(is_superuser=True,pk=1)


  
  def reviewer(self,obj):
    return obj.animes_to_review.exists()
  reviewer.boolean = True
  
  def contributions(self,obj):
    return obj.contributions.filter(approved=True).count()
  
  def questions_reviewed(self,obj):
    return obj.contributions_reviewed.count()
  
  def country_name(self,obj):
    if obj.country:
      return COUNTRIES[obj.country]
    return "N/A"
  country_name.short_description = "country"

  def reviewer_of(self,obj):
    return "{} animes".format(obj.animes_to_review.all().count())   


@admin.register(Anime)
class AnimeAdmin(ReadOnly):
  list_display = (
  "anime_name",
) 
  search_fields = ("anime_name__startswith",)
  

@admin.register(Notification)
class NotificationAdmin(ReadOnly):
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
