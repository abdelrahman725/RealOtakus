import math
import pytz

from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from django.utils.translation import ugettext_lazy as _
from django.db.models import Count
from django.utils import timezone

from board.models import *
from board.constants import COUNTRIES


def to_local_date_time(utc_datetime):

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

      for c in User.objects.filter(country__isnull=False).values_list('country',flat=True).distinct():
        countries_choices.add((c,(COUNTRIES[c])))

      return countries_choices
    
    def queryset(self, request, queryset): 
      if self.value():
        return queryset.filter(country=self.value())
      return queryset.all()


class ActiveAnimeFilter(admin.SimpleListFilter):
    title = 'has questions'
    parameter_name = 'contains_questions'

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


class ContributionState(admin.SimpleListFilter):
  title = 'state'
  parameter_name = 'state'

  def lookups(self, request, model_admin):

      return (
        ('p', _('Pending ....')),
        ('r', _('Reviewed')),
        ('a', _('Approved')),
        ('f', _('Rejected'))
    )

  def queryset(self, request, queryset):
    if self.value() == 'p':
      return queryset.filter(approved__isnull=True)
    
    if self.value() == 'r':
      return queryset.filter(approved__isnull=False)

    if self.value() == 'a':
      return queryset.filter(approved=True)

    if self.value() == 'f':
      return queryset.filter(approved=False)


class ReviewersExistFilter(admin.SimpleListFilter):
  title = 'has reviewers'
  parameter_name = 'reviewable'

  def lookups(self, request, model_admin):

      return (
        ('No', ('No')),
        ('Yes', ('Yes')),
    )

  def queryset(self, request, queryset):
    if self.value() == 'No':
      return queryset.filter(question__anime__reviewers__isnull=True)
    
    if self.value() == 'Yes':
      return queryset.filter(question__anime__reviewers__isnull=False)


# admin models inherit from this class can't be changed or deleted
class ReadOnly(admin.ModelAdmin):
 
  def has_change_permission(self, request, obj=None):
    return False
 
  def has_delete_permission(self, request, obj=None):
    return True
    return False


@admin.register(Anime)
class AnimeAdmin(admin.ModelAdmin):

  list_editable = ("active",)
  search_fields = ("anime_name",)

  list_display = (
    "anime_name",
    "total_questions",
    "active"
  )

  list_filter = (
    "active",
  )

  def get_queryset(self, request):
    query = super(AnimeAdmin, self).get_queryset(request)
    return  query.annotate(questions_count=Count("anime_questions")).order_by('-questions_count')



@admin.register(Notification)
class NotificationAdmin(ReadOnly):
  readonly_fields = (
    "time",
  )
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



@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):

  readonly_fields = (
    "question",
    "contributor",
    "reviewer",
    "date_created",
    "date_reviewed"
  )

  list_display = (
    "view_contribution",
    "contributor",
    "approved",
    "view_question",
    "reviewers_assigned",
    "reviewed_by",
    "reviewer_feedback",
    "_date_created",
    "_date_reviewed",
    "reviewed_after"
  )
  
  list_filter = (
    ContributionState,
    ReviewersExistFilter,
    "date_created"
    #"deleted_questions" 
  )
  
  list_display_links = None
  
  def view_question(self, obj):
    if obj.question:
      url = reverse('admin:board_question_change', args=(obj.question.id,))
      return format_html('<a href="{}">{}</a>',url, obj.question.question)
    return "removed"

  view_question.short_description = "question"
  
  def view_contribution(self,obj):
    if not obj.question:
      return "no related question"

    if obj.approved == None:
      url = reverse('admin:board_contribution_change', args=(obj.id,))
      return format_html('<a href="{}">pending...</a>',url)

    return "Reviewed"
  
  view_contribution.short_description = "state"

  def reviewed_by(self,obj):
    return obj.reviewer

  def reviewers_assigned(self,obj):
    return obj.question.anime.reviewers.count() 

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

  def get_readonly_fields(self, request, obj=None):
    if obj and obj.approved != None:
      return self.readonly_fields + ('approved','reviewer_feedback')

    return self.readonly_fields

  def has_delete_permission(self, request, obj=None):
    return True
    return False

  def has_add_permission(self,request,obj=None):
    return False
    return True

  

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
  #date_hierarchy = 'date_created'
  
  fields = (
    "active",
    "anime",
    "question",
    "right_answer",
    "choice1",
    "choice2",
    "choice3",
    "correct_answers",
    "wrong_answers"
  )
  
  list_editable=("active",)

  autocomplete_fields = ['anime']

  readonly_fields =  (
    "correct_answers",
    "wrong_answers"
  )

  list_display =  (
    "question",
    "id",
    "right_answer",
    "choice1",
    "choice2",
    "choice3",
    "active",
    "anime",
    "reviewers_assigned",
    #"_contribution"
  )

  list_filter = (
    QuestionTypeFilter,
    "active",
    ("anime",admin.RelatedOnlyFieldListFilter),
  )
  
  search_fields   =  ("question",)


  def get_readonly_fields(self, request, obj=None):
    if obj and obj.pk:  return self.readonly_fields + ('anime',)
    return self.readonly_fields
  

# hide Delete button if it's an active question
  def has_delete_permission(self, request, obj=None):
    return True
    if obj: return not obj.active
  

  def reviewers_assigned(self,obj):
    return obj.anime.reviewers.count()


  def _contribution(self,obj):
    try:
      if obj.contribution:
        url = reverse('admin:board_contribution_change', args=(obj.contribution.id,))
       
        contribution_states= {
                None:"pending...",
                True:"approved",
                False:"rejected"
              }
        
        return format_html('<a href="{}">{}</a>',url,contribution_states[obj.contribution.approved]) 
    except:
      pass
    return None



@admin.register(QuestionInteraction)
class QuestionInteractionAdmin(ReadOnly):
    
  list_display = (
    "user",
    "question",
    "anime",
    "correct_answer"
  )

  list_filter = (
    ("user",admin.RelatedOnlyFieldListFilter),
    ("anime",admin.RelatedOnlyFieldListFilter),
    "correct_answer"
  )

  def has_add_permission(self, request, obj=None):
    return False
  

@admin.register(User)
class UserAdmin(admin.ModelAdmin):  
  
  fields = (
    "username",
    "first_name",
    "last_name",
    "email",
    "country",
    "level",
    "points",
    "animes_to_review",
    "tests_completed",
    "tests_started",
    #"password",
    "last_login",
    "date_joined",
    "is_active"
  )

  autocomplete_fields = ['animes_to_review']
  
  readonly_fields =  (
    "level",
    "points",
    "first_name",
    "last_name",
    "tests_started",
    "tests_completed",
    "password",
    "date_joined",
    "last_login"
  )

  list_display = (
    "username",
    "id",
    #"email",
    "level",
    "points",
    "tests_completed",
    "contributions",
    "questions_reviewed",
    "reviewer_of",
    "view_country"
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
  
  def view_country(self,obj):
    if obj.country:
      return format_html(
        '<img src="https://flagcdn.com/w80/{}.png" width="35" alt="country flag" >&nbsp;{}</img>',
        obj.country,
        COUNTRIES[obj.country]
      )

    return "N/A"
  view_country.short_description = "country"

  def reviewer_of(self,obj):
    return "{} animes".format(obj.animes_to_review.all().count())   
