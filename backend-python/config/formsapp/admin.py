from django.contrib import admin
from .models import DynamicForm, FormField


class FormFieldInline(admin.TabularInline):
    model = FormField
    extra = 0
    ordering = ("order",)


@admin.register(DynamicForm)
class DynamicFormAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "user",
    )

    search_fields = (
        "title",
        "user__username",
    )

    list_filter = (
        "user",
    )

    ordering = ("-id",)

    list_per_page = 20

    inlines = [FormFieldInline]


@admin.register(FormField)
class FormFieldAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "form",
        "label",
        "field_type",
        "order",
    )

    search_fields = (
        "label",
        "form__title",
    )

    list_filter = (
        "field_type",
    )

    ordering = ("form", "order")

    list_per_page = 30