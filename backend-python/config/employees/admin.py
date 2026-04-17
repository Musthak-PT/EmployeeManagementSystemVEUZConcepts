from django.contrib import admin
from .models import Employee, EmployeeFieldValue


class EmployeeFieldValueInline(admin.TabularInline):
    model = EmployeeFieldValue
    extra = 0


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "form",
        "created_at",
    )

    search_fields = (
        "form__title",
    )

    list_filter = (
        "created_at",
        "form",
    )

    ordering = ("-created_at",)

    readonly_fields = (
        "created_at",
    )

    list_per_page = 25

    inlines = [EmployeeFieldValueInline]


@admin.register(EmployeeFieldValue)
class EmployeeFieldValueAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "employee",
        "label",
        "value",
    )

    search_fields = (
        "label",
        "value",
    )

    list_filter = (
        "label",
    )

    ordering = ("employee",)

    list_per_page = 30