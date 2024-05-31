import math

from django.db import models
from django.db.models import Q
from django.contrib import admin
from django.contrib.auth.models import Group
from django.urls import reverse
from django.utils import timezone
from django.utils.html import format_html
from django.forms import Textarea


from core.models import Otaku
from core.models import Anime
from core.models import Question
from core.models import QuestionInteraction
from core.constants import COUNTRIES


class CountryFilter(admin.SimpleListFilter):
    title = "country"
    parameter_name = "country"

    def lookups(self, request, model_admin):
        countries_choices = set()

        for country_code in (
            Otaku.objects.filter(country__isnull=False)
            .values_list("country", flat=True)
            .distinct()
        ):
            countries_choices.add((country_code, (COUNTRIES[country_code])))

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
            ("t", ("Admin")),
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
            return queryset.filter(state="pending", is_contribution=True)

        if self.value() == "r":
            return queryset.filter(~Q(state="pending"), is_contribution=True)

        if self.value() == "a":
            return queryset.filter(state="approved", is_contribution=True)

        if self.value() == "f":
            return queryset.filter(state="rejected", is_contribution=True)


admin.site.unregister(Group)


@admin.register(Otaku)
class OtakuAdmin(admin.ModelAdmin):
    fields = (
        "username",
        "email",
        "score",
        "tests_started",
        "tests_completed",
        "animes_to_review",
        "country",
        "level",
        "password",
        "is_active",
        "date_joined",
        "last_login",
    )

    list_display = (
        "username",
        "email",
        "is_active",
        "score",
        "level",
        "tests_started",
        "tests_completed",
        "contributions",
        "reviewer_of",
        "country",
    )

    list_per_page = 500
    list_max_show_all = 2000

    list_editable = ("is_active",)
    list_per_page = 500
    list_max_show_all = 2000

    autocomplete_fields = [
        "animes_to_review",
    ]

    search_fields = ("username__startswith", "email__startswith")

    readonly_fields = ("score", "tests_started", "tests_completed", "level", "password")

    list_filter = (
        "is_active",
        "level",
        IsReviewerFilter,
        (
            "animes_to_review",
            admin.RelatedOnlyFieldListFilter,
        ),
        CountryFilter,
    )

    def contributions(self, obj):
        return obj.contributions.filter(state="approved", is_contribution=True).count()

    def reviewer_of(self, obj):
        return "{} animes".format(obj.animes_to_review.all().count())

    def has_delete_permission(self, request, obj=None):
        if obj and obj.is_superuser:
            return False
        return True

    # def social_connected(self, obj):
    #     return obj.social_auth.exists()

    # social_connected.boolean = True


@admin.register(Anime)
class AnimeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
    )

    search_fields = ("name",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    fields = (
        "contributor",
        "anime",
        "question",
        "right_answer",
        "choice1",
        "choice2",
        "choice3",
        "state",
        "feedback",
        "is_contribution",
        "reviewer",
        "date_created",
        "date_reviewed",
    )

    readonly_fields = ("contributor", "reviewer", "date_created", "date_reviewed")

    formfield_overrides = {
        models.CharField: {"widget": Textarea(attrs={"rows": 7, "cols": 50})},
    }

    list_display = (
        "pk",
        "anime",
        "question",
        "state",
        "_contributor",
        "reviewed_by",
        "feedback",
        "created",
    )

    list_display_links = ("question",)
    list_max_show_all = 2000

    list_filter = (
        ContributionTypeFilter,
        ("anime", admin.RelatedOnlyFieldListFilter),
        ("contributor", admin.RelatedOnlyFieldListFilter),
        ("reviewer", admin.RelatedOnlyFieldListFilter),
        "date_created",
    )

    def _contributor(self, obj):
        if not obj.is_contribution:
            return "ADMIN"
        return obj.contributor

    def reviewed_by(self, obj):
        return obj.reviewer

    def created(self, obj):
        time_diff = timezone.now() - obj.date_created

        if time_diff.days >= 365:
            return f"{math.floor(time_diff.days/365)} years ago"

        if time_diff.days >= 30:
            return f"{math.floor(time_diff.days/30)} months ago"

        if time_diff.days >= 1:
            return f"{time_diff.days} days ago"

        if time_diff.seconds >= 3600:
            return f"{math.floor(time_diff.seconds/3600)} hours ago"

        if time_diff.seconds > 60:
            return f"{math.floor(time_diff.seconds/60)} minutes ago"

        return "few seconds ago"

    # def get_readonly_fields(self, request, obj=None):
    #     if obj:
    #         if not obj.is_contribution or obj.approved != None:
    #             return self.readonly_fields + ("approved", "feedback", "anime")

    #         return self.readonly_fields + ("anime",)

    #     return self.readonly_fields + ("approved", "feedback")

    # def has_delete_permission(self, request, obj=None):
    #     if obj:
    #         return not obj.state === "approved"
    #     return True


@admin.register(QuestionInteraction)
class QuestionInteractionAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "_question",
        "anime",
        "answer",
    )

    list_display_links = None

    list_filter = (
        ("anime", admin.RelatedOnlyFieldListFilter),
        ("user", admin.RelatedOnlyFieldListFilter),
        "correct_answer",
    )

    def answer(self, obj):
        return obj.correct_answer

    def _question(self, obj):
        link = reverse("admin:core_question_change", args=[obj.question.id])
        return format_html('<a href="{}">{}</a>', link, obj.question)

    def has_change_permission(self, request, obj=None):
        return False

    answer.boolean = True
