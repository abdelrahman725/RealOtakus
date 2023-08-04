import math

from django.contrib import admin
from django.contrib.auth.models import Group
from django.utils.html import format_html
from django.db import models
from django.db.models import Count
from django.forms import Textarea

from allauth.socialaccount.models import SocialAccount

from otakus.models import User
from otakus.models import Anime
from otakus.models import Question
from otakus.models import QuestionInteraction
from otakus.models import Notification

from otakus.constants import COUNTRIES, N_QUIZ_QUESTIONS
from otakus.helpers import delete_expired_notifications

admin.site.unregister(Group)
admin.site.site_header = "RealOtakus Administration"
admin.site.site_title = admin.site.site_header
admin.site.index_title = ""


# action for deleting notifications older than one month
@admin.action(description="delete expired notifications")
def delete_expired_notifications_action(modeladmin, request, queryset):
    delete_expired_notifications()


# 5 custome filter classes
class SocialAccountFilter(admin.SimpleListFilter):
    title = "social account"
    parameter_name = "social_account"

    def lookups(self, request, model_admin):
        return (
            ("Yes", ("Yes")),
            ("No", ("No")),
        )

    def queryset(self, request, queryset):
        if self.value() == "Yes":
            return queryset.filter(socialaccount__isnull=False)

        if self.value() == "No":
            return queryset.filter(socialaccount=None)


class CountryFilter(admin.SimpleListFilter):
    title = "country"
    parameter_name = "country"

    def lookups(self, request, model_admin):
        countries_choices = set()

        for c in (
            User.otakus.filter(country__isnull=False)
            .values_list("country", flat=True)
            .distinct()
        ):
            countries_choices.add((c, (COUNTRIES[c])))

        return countries_choices

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(country=self.value())
        return queryset.all()


class IsReviewerFilter(admin.SimpleListFilter):
    title = "Reviewer"
    parameter_name = "is_reviewer"

    def lookups(self, request, model_admin):
        return (
            ("Yes", ("Yes")),
            ("No", ("No")),
        )

    def queryset(self, request, queryset):
        if self.value() == "Yes":
            return queryset.exclude(animes_to_review=None)

        if self.value() == "No":
            return queryset.filter(animes_to_review=None)


class ContributionTypeFilter(admin.SimpleListFilter):
    title = "state"
    parameter_name = "state"

    def lookups(self, request, model_admin):
        return (
            ("t", ("Staff")),
            ("c", ("Contribution")),
            ("p", ("Pending")),
            ("r", ("Reviewed")),
            ("a", ("Approved")),
            ("f", ("Rejected")),
        )

    def queryset(self, request, queryset):
        if self.value() == "t":
            return queryset.filter(is_contribution=False)

        if self.value() == "c":
            return queryset.filter(is_contribution=True)

        if self.value() == "p":
            return queryset.filter(approved__isnull=True, is_contribution=True)

        if self.value() == "r":
            return queryset.filter(approved__isnull=False, is_contribution=True)

        if self.value() == "a":
            return queryset.filter(approved=True, is_contribution=True)

        if self.value() == "f":
            return queryset.filter(approved=False, is_contribution=True)


class ReviewersExistFilter(admin.SimpleListFilter):
    title = "has reviewers"
    parameter_name = "reviewable"

    def lookups(self, request, model_admin):
        return (
            ("No", ("No")),
            ("Yes", ("Yes")),
        )

    def queryset(self, request, queryset):
        if self.value() == "No":
            return queryset.filter(anime__reviewers__isnull=True)

        if self.value() == "Yes":
            return queryset.filter(anime__reviewers__isnull=False)


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
        "last_login",
        "date_joined",
        "is_active",
    )

    autocomplete_fields = [
        "animes_to_review",
    ]

    filter_horizontal = ("user_permissions",)

    list_display_links = ("username",)

    readonly_fields = (
        "level",
        "points",
        "tests_started",
        "tests_completed",
        "first_name",
        "last_name",
        "password",
        "date_joined",
        "last_login",
    )

    list_display = (
        "id",
        "username",
        "points",
        # "email",
        "tests_started",
        "tests_completed",
        # "level",
        "quizes_score",
        "quiz_completion",
        "contributions",
        "questions_reviewed",
        "reviewer_of",
        "view_country",
        "social_connected",
    )

    list_filter = (
        IsReviewerFilter,
        SocialAccountFilter,
        "level",
        CountryFilter,
        ("animes_to_review", admin.RelatedOnlyFieldListFilter),
    )

    search_fields = ("username__startswith",)

    def get_queryset(self, request):
        query = super(UserAdmin, self).get_queryset(request)
        return query.exclude(is_superuser=True)

    def quizes_score(self, obj):
        if obj.tests_completed > 0:
            all_answers = N_QUIZ_QUESTIONS * obj.tests_completed
            right_answers = obj.questions_interacted_with.filter(
                correct_answer=True
            ).count()
            return f"{round(right_answers / all_answers * 100) } %"
        return "N/A"

    def quiz_completion(self, obj):
        if obj.tests_started > 0:
            return f"{ round(obj.tests_completed / obj.tests_started * 100)} %"
        return "N/A"

    def reviewer(self, obj):
        return obj.animes_to_review.exists()

    reviewer.boolean = True

    def social_connected(self, obj):
        try:
            SocialAccount.objects.get(user=obj)
            return True

        except SocialAccount.DoesNotExist:
            return False

    social_connected.boolean = True

    def contributions(self, obj):
        return obj.contributions.filter(approved=True, is_contribution=True).count()

    def questions_reviewed(self, obj):
        if obj.animes_to_review.exists():
            return obj.contributions_reviewed.count()
        return "N/A"

    def view_country(self, obj):
        if obj.country:
            return COUNTRIES[obj.country]
        return "N/A"

    view_country.short_description = "country"

    def reviewer_of(self, obj):
        return "{} animes".format(obj.animes_to_review.all().count())


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    # date_hierarchy = 'date_created'

    formfield_overrides = {
        models.CharField: {"widget": Textarea(attrs={"rows": 7, "cols": 50})},
    }

    list_per_page = 300

    fields = (
        "question",
        "right_answer",
        "anime",
        "active",
        "choice1",
        "choice2",
        "choice3",
        "approved",
        "feedback",
        "is_contribution",
        "contributor",
        "reviewer",
        "date_created",
        "date_reviewed",
        "id",
    )

    list_editable = ("active",)

    autocomplete_fields = ["anime"]

    list_display_links = ("question",)

    list_display = (
        "contributor",
        "question",
        "anime",
        # "right_answer",
        # "n_correct_answers",
        # "n_wrong_answers",
        "reviewers_assigned",
        "reviewed_by",
        "feedback",
        "active",
        "contribution_state",
        "date_created",
        "date_reviewed",
        "reviewed_after",
    )

    readonly_fields = (
        "contributor",
        "reviewer",
        "is_contribution",
        "date_created",
        "date_reviewed",
        "id",
    )

    list_filter = (
        "active",
        ContributionTypeFilter,
        ("anime", admin.RelatedOnlyFieldListFilter),
        ("contributor", admin.RelatedOnlyFieldListFilter),
        ("reviewer", admin.RelatedOnlyFieldListFilter),
        ReviewersExistFilter,
        "date_created",
    )

    search_fields = ("question", "anime__anime_name", "contributor__username")

    def n_correct_answers(self, obj):
        return obj.question_interactions.filter(correct_answer=True).count()

    def n_wrong_answers(self, obj):
        return obj.question_interactions.filter(correct_answer=False).count()

    def get_readonly_fields(self, request, obj=None):
        if obj:
            if not obj.is_contribution or obj.approved != None:
                return self.readonly_fields + ("approved", "feedback", "anime")

            return self.readonly_fields + ("anime",)

        return self.readonly_fields + ("approved", "feedback")

    def contribution_state(self, obj):
        if not obj.is_contribution:
            return "admin/staff"

        contribution_states = {None: "pending", True: "approved", False: "rejected"}

        states_color = {
            None: "#FF8C00",
            True: "green",
            False: "red",
        }

        return format_html(
            '<span style="color:{};">{}</span>',
            states_color[obj.approved],
            contribution_states[obj.approved],
        )

    contribution_state.short_description = "state"

    def reviewed_by(self, obj):
        return obj.reviewer

    def reviewers_assigned(self, obj):
        if obj.is_contribution:
            if obj.contributor:
                return obj.anime.reviewers.exclude(id=obj.contributor.id).count()
            return obj.anime.reviewers.all().count()
        return "N/A"

    def reviewed_after(self, obj):
        if obj.date_created and obj.date_reviewed:
            time_diff = obj.date_reviewed - obj.date_created

            if time_diff.days >= 365:
                return f"{math.floor(time_diff.days/365)} years"

            if time_diff.days >= 30:
                return f"{math.floor(time_diff.days/30)} months"

            if time_diff.days >= 1:
                return f"{time_diff.days} days"

            if time_diff.seconds >= 3600:
                return f"{math.floor(time_diff.seconds/3600)} hours"

            if time_diff.seconds > 60:
                return f"{math.floor(time_diff.seconds/60)} minutes"

            return "a few seconds"

        return "N/A"


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
    )

    list_filter = (
        "active",
        # ("reviewers",admin.RelatedOnlyFieldListFilter)
    )

    def get_queryset(self, request):
        query = super(AnimeAdmin, self).get_queryset(request)
        return query.annotate(questions_count=Count("anime_questions")).order_by(
            "-questions_count"
        )

    def view_anime(self, obj):
        return format_html("<p>{}<p/><br/>", obj.anime_name)

    def admin_questions(self, obj):
        return obj.anime_questions.exclude(is_contribution=True).count()

    def _reviewers(self, obj):
        return obj.reviewers.all().count()


@admin.register(QuestionInteraction)
class QuestionInteractionAdmin(admin.ModelAdmin):
    list_display = ("user", "question", "anime", "correct_answer")

    list_filter = (
        ("user", admin.RelatedOnlyFieldListFilter),
        ("anime", admin.RelatedOnlyFieldListFilter),
        "correct_answer",
    )

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    actions = [delete_expired_notifications_action]

    list_display = (
        "kind",
        "receiver",
        "notification",
        "time",
        "seen",
    )

    autocomplete_fields = ["receiver"]

    search_fields = ("receiver__username__startswith",)

    list_filter = (
        ("receiver", admin.RelatedOnlyFieldListFilter),
        "seen",
        "kind",
        "time",
    )

    list_display_links = None
