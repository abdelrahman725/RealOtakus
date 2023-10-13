import math

from django.db import models
from django.contrib import admin
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


@admin.register(Otaku)
class OtakuAdmin(admin.ModelAdmin):
    list_display = (
        "username",
        "account",
        "points",
        "level",
        "contributions",
        # "tests_started",
        # "tests_completed",
        "reviewer_of",
        "country",
    )

    list_per_page = 500
    list_max_show_all = 2000

    autocomplete_fields = [
        "animes_to_review",
    ]

    list_filter = (
        "level",
        IsReviewerFilter,
        (
            "animes_to_review",
            admin.RelatedOnlyFieldListFilter,
        ),
        CountryFilter,
    )

    def account(self, obj):
        link = reverse("admin:accounts_useraccount_change", args=[obj.user.id])
        return format_html('<a href="{}">{}</a>', link, obj.user.username)

    def username(self, obj):
        return obj.user.username

    def contributions(self, obj):
        return obj.contributions.filter(approved=True, is_contribution=True).count()

    def reviewer_of(self, obj):
        return "{} animes".format(obj.animes_to_review.all().count())


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
        "question",
        "right_answer",
        "anime",
        "contributor",
        "active",
        "choice1",
        "choice2",
        "choice3",
        "approved",
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
        "_contributor",
        "reviewed_by",
        "feedback",
        "created",
        "active",
    )

    list_display_links = ("question",)
    list_editable = ("active",)
    list_max_show_all = 2000

    list_filter = (
        ContributionTypeFilter,
        "active",
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

    def get_readonly_fields(self, request, obj=None):
        if obj:
            if not obj.is_contribution or obj.approved != None:
                return self.readonly_fields + ("approved", "feedback", "anime")

            return self.readonly_fields + ("anime",)

        return self.readonly_fields + ("approved", "feedback")

    def has_delete_permission(self, request, obj=None):
        if obj:
            return not obj.active
        return True


@admin.register(QuestionInteraction)
class QuestionInteractionAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "question",
        "anime",
        "answer",
    )

    list_filter = (
        ("anime", admin.RelatedOnlyFieldListFilter),
        ("user", admin.RelatedOnlyFieldListFilter),
        "correct_answer",
    )

    def answer(self, obj):
        return obj.correct_answer

    answer.boolean = True
