from django.contrib import admin
from django.contrib.auth.models import Group

from accounts.models import UserAccount
from social_django.models import UserSocialAuth

admin.site.unregister(Group)
admin.site.site_header = "RealOtakus Administration"
admin.site.site_title = admin.site.site_header
admin.site.index_title = ""


@admin.register(UserAccount)
class UserAdmin(admin.ModelAdmin):
    fields = (
        "id",
        "username",
        "password",
        "email",
        "last_login",
        "date_joined",
        "is_active",
    )

    list_display_links = ("username",)

    readonly_fields = (
        "id",
        "email",
        "password",
        "date_joined",
        "last_login",
    )

    list_display = ("id", "username", "email", "social_connected")

    search_fields = ("username__startswith",)

    def social_connected(self, obj):
        try:
            UserSocialAuth.objects.get(user=obj)
            return True

        except UserSocialAuth.DoesNotExist:
            return False

    social_connected.boolean = True
