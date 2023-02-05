import math

from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from django.db.models import Count

from allauth.socialaccount.models import SocialAccount

from otakus.models import User
from otakus.models import Anime
from otakus.models import Contribution
from otakus.models import Question
from otakus.models import QuestionInteraction
from otakus.models import Notification 

from otakus.helpers import to_local_date_time

from otakus.constants import COUNTRIES, QUESTIONSCOUNT

# 8 custome filter classes
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


class OldestToRecentFilter(admin.SimpleListFilter):
    title = 'oldest to latest'
    parameter_name = 'chronological_order'

    def lookups(self, request, model_admin):
        return (
          ('Yes', ('Yes')),
      )

    def queryset(self, request, queryset):  
          
      if self.value() == 'Yes':
        return queryset.order_by("id")


class CountryFilter(admin.SimpleListFilter):
    title = 'country'
    parameter_name = 'country'

    def lookups(self, request, model_admin):
      countries_choices = set()

      for c in User.otakus.filter(country__isnull=False).values_list('country',flat=True).distinct():
        countries_choices.add((c,(COUNTRIES[c])))
        
      return countries_choices
    
    def queryset(self, request, queryset): 
      if self.value():
        return queryset.filter(country=self.value())
      return queryset.all()
     

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
        ('admin', ('admin')),
        ('users', ('contribution'))
    )

  def queryset(self, request, queryset):

    if self.value() == 'admin':
      return queryset.filter(contribution__isnull=True)

    if self.value() == 'users':
      return queryset.filter(contribution__isnull=False)


class ContributionStateFilter(admin.SimpleListFilter):
  title = 'state'
  parameter_name = 'state'

  def lookups(self, request, model_admin):

      return (
        ('p', ('Pending ....')),
        ('r', ('Reviewed')),
        ('a', ('Approved')),
        ('f', ('Rejected'))
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


class ReviewersAssignedFilter(admin.SimpleListFilter):
  title = 'reviewers assigned'
  parameter_name = 'reviewer_assigned'

  def lookups(self, request, model_admin):
    reviewers_choices =  set()

    for reviewer in User.otakus.filter(animes_to_review__isnull=False):
      reviewers_choices.add((reviewer.id,(reviewer)))
    
    return reviewers_choices

  def queryset(self, request, queryset):
    if self.value():
      selected_user = User.otakus.get(id=int(self.value()))
      return queryset.filter(question__anime__in = selected_user.animes_to_review.all())
    

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
    "tests_started",
    "tests_completed",
    "animes_to_review",
    "password",
    "is_staff",
    #"user_permissions",
    "last_login",
    "date_joined",
    "is_active"
  )

  autocomplete_fields = ["animes_to_review",]
  
  #filter_horizontal = ("user_permissions",)

  list_display_links = ("username",)

  readonly_fields =  (
    #"level",
    "points",
    "tests_started",
    "tests_completed",
    "first_name",
    "last_name",
    "password",
    "date_joined",
    "last_login"
  )

  list_display = (
    "id",
    "username",
    "points",
    #"email",
    "tests_started",
    "tests_completed",
    #"level",
    "quizes_score",
    "quiz_completion",
    "contributions",
    "questions_reviewed",
    "reviewer_of",
    "view_country",
    "social_connected"
  )

  list_filter  =  (
    IsReviewerFilter,
    SocialAccountFilter,
    #"is_staff",
    "level",
    CountryFilter,
    ("animes_to_review",admin.RelatedOnlyFieldListFilter)
  )

  search_fields = ("username__startswith",)
  
  def get_queryset(self, request):    
    query = super(UserAdmin, self).get_queryset(request)
    return query.exclude(is_superuser=True)

  
  def quizes_score(self,obj):
    if obj.tests_completed > 0:
      all_answers =  QUESTIONSCOUNT * obj.tests_completed
      right_answers =  obj.questions_interacted_with.filter(correct_answer=True).count()
      return f"{round(right_answers / all_answers * 100) } %"
    return "N/A"

  def quiz_completion(self,obj):
    if obj.tests_started > 0:
      return f"{ round(obj.tests_completed / obj.tests_started * 100)} %"
    return "N/A"

  def reviewer(self,obj):
    return obj.animes_to_review.exists()
  reviewer.boolean = True
    
  def social_connected(self,obj):

    try:
      SocialAccount.objects.get(user=obj)
      return True
    
    except SocialAccount.DoesNotExist:
      return False

  social_connected.boolean = True

  def contributions(self,obj):
    return obj.contributions.filter(approved=True).count()
  
  def questions_reviewed(self,obj):
    return obj.contributions_reviewed.count()
  
  def view_country(self,obj):
    if obj.country:
      return COUNTRIES[obj.country]
    return "N/A"

  view_country.short_description = "country"

  def reviewer_of(self,obj):
    return "{} animes".format(obj.animes_to_review.all().count())   


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
    "feedback",
    "_date_created",
    "_date_reviewed",
    "reviewed_after"
  )
  
  list_filter = (

    OldestToRecentFilter,
    ContributionStateFilter,
    ReviewersAssignedFilter,
    ("question__anime",admin.RelatedOnlyFieldListFilter),
    ("contributor",admin.RelatedOnlyFieldListFilter),
    ("reviewer",admin.RelatedOnlyFieldListFilter),
    "feedback",
    ReviewersExistFilter,
    "date_created",
    #"deleted_questions" 
  )
  
  list_display_links = None
  
  def view_question(self, obj):
    if obj.question:
      url = reverse('admin:otakus_question_change', args=(obj.question.id,))
      return format_html(
        '<p>{anime}<br/><br/> <a href="{url}">{question}</a><p/>',
        anime=obj.question.anime.anime_name,
        question=obj.question.question,
        url=url,
      )
    return "removed"

  view_question.short_description = "question"
  
  def view_contribution(self,obj):
    if not obj.question:
      return "none"

    if obj.approved == None:
      url = reverse('admin:otakus_contribution_change', args=(obj.id,))
      return format_html(
        '<a href="{}" style="color:#FF8C00;font-size:15px;letter-spacing: 1px;">pending...</a>',
        url
      )

    return "Reviewed"
  
  view_contribution.short_description = "state"

  def reviewed_by(self,obj):
    return obj.reviewer

  def reviewers_assigned(self,obj):
    if obj.question:
      if obj.contributor:
        return obj.question.anime.reviewers.exclude(id=obj.contributor.id).count()
      return obj.question.anime.reviewers.all().count()
    return "N/A"

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
      
      return "a few seconds"

    return "N/A"

  def get_readonly_fields(self, request, obj=None):
    if obj and obj.approved != None:
      return self.readonly_fields + ('approved','feedback')

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
    "choice3"
  )
  
  list_editable=("active",)

  autocomplete_fields = ['anime']

  list_display_links = ("question",)

  list_display =  (
    "contributor",
    "question",
    "anime",
    #"id",
    #"right_answer",
    #"choice1",
    #"choice2",
    #"choice3",
    #"correct_answers",
    #"wrong_answers",
    #"no_answers",
    "active",
    "_contribution"
  )

  list_filter = (
    QuestionTypeFilter,
    "active",
    ("anime",admin.RelatedOnlyFieldListFilter)
  )
  
  search_fields   =  ("question","anime__anime_name")

  def contributor(self,obj):
    try:
      if obj.contribution.contributor == None:
        return "DELETED"
      return obj.contribution.contributor
    except Contribution.DoesNotExist:
      return "admin"

  def correct_answers(self,obj):
    return obj.question_interactions.filter(correct_answer=True).count()
  
  def wrong_answers(self,obj):
    return obj.question_interactions.filter(correct_answer=False).count()
  
  def no_answers(self,obj): 
    return obj.question_interactions.filter(correct_answer__isnull=True).count()

  def get_readonly_fields(self, request, obj=None):
    if obj and obj.pk:  return self.readonly_fields + ('anime',)
    return self.readonly_fields
  

# hide Delete button if it's an active question
  def has_delete_permission(self, request, obj=None):
    return True
    if obj: return not obj.active  

  def _contribution(self,obj):
    try:
      if obj.contribution:
        url = reverse('admin:otakus_contribution_change', args=(obj.contribution.id,))
       
        contribution_states= {
                None:"pending...",
                True:"approved",
                False:"rejected"
        }

        states_color = {
          None:"#FF8C00",
          True:"green",
          False:"red",
        }
        
        return format_html(
          '<a href="{}" style="color:{};">{}</a>',
          url,
          states_color[obj.contribution.approved],
          contribution_states[obj.contribution.approved],
        )

    except:
      pass
    return None


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
    "view_anime",
    "active",
    "total_questions",
    "active_questions",
    "admin_questions",
    "total_contributions",
    "approved_contributions",
    "pending_contributions",
    "rejected_contributions",
    "_reviewers",
    "interactions"
  )

  list_filter = (
    "active",
    ("reviewers",admin.RelatedOnlyFieldListFilter)
  )

  def get_queryset(self, request):
    query = super(AnimeAdmin, self).get_queryset(request)
    return  query.annotate(questions_count=Count("anime_questions")).order_by('-questions_count')
  
  def view_anime(self,obj):
    return format_html('<p>{}<p/><br/>',obj.anime_name) 
  
  def interactions(self,obj):
    return obj.anime_interactions.all().count()        
  
  def admin_questions(self,obj):
    return obj.anime_questions.exclude(contribution__isnull=False).count()   


  def _reviewers(self,obj):
    return obj.reviewers.all().count()

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
  
@admin.register(Notification)
class NotificationAdmin(ReadOnly):

  list_display = (
    "kind",
    "receiver",
    "notification",
    "_time",
    "seen"
  )
  
  autocomplete_fields = ['receiver']
  
  search_fields   =  ("receiver__username__startswith",)

  list_filter  = (
    ("receiver",admin.RelatedOnlyFieldListFilter),
    "seen",
    "kind",
    "time"
  )

  list_display_links = None

  def _time(self,obj): return to_local_date_time(obj.time)
    