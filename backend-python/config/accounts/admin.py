from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


admin.site.unregister(User)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "id",
        "username",
        "email",
        "is_staff",
        "is_active",
        "date_joined",
    )

    search_fields = (
        "username",
        "email",
    )

    list_filter = (
        "is_staff",
        "is_active",
        "date_joined",
    )

    ordering = ("-date_joined",)