from django.contrib import admin
from django.contrib.auth.models import Group
from accounts.models import UserAccount

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
        "is_active",
        "date_joined",
        "last_login",
    )

    readonly_fields = (
        "id",
        # "email",
        "password",
        "date_joined",
        "last_login",
    )

    list_display_links = ("username",)
    list_display = ("id", "username", "email", "social_connected")
    list_per_page = 500
    list_max_show_all = 2000
    list_filter = ("is_active",)

    search_fields = ("username__startswith", "email__startswith")

    def social_connected(self, obj):
        return obj.social_auth.exists()

    social_connected.boolean = True

    def has_delete_permission(self, request, obj=None):
        if obj and obj.is_superuser:
            return False
        return True
