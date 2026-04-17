from django.db import models
from django.contrib.auth.models import User


class DynamicForm(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="forms"
    )

    title = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-id"]
        unique_together = ("user", "title")

    def __str__(self):
        return self.title


class FormField(models.Model):
    FIELD_TYPES = (
        ("text", "Text"),
        ("textarea", "Textarea"),
        ("number", "Number"),
        ("date", "Date"),
        ("password", "Password"),
        ("email", "Email"),
        ("phone", "Phone"),
    )

    form = models.ForeignKey(
        DynamicForm,
        related_name="fields",
        on_delete=models.CASCADE
    )

    label = models.CharField(max_length=100)

    field_type = models.CharField(
        max_length=20,
        choices=FIELD_TYPES
    )

    order = models.PositiveIntegerField(default=1)

    is_required = models.BooleanField(default=True)

    placeholder = models.CharField(
        max_length=150,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]
        unique_together = [
            ("form", "label"),
            ("form", "order")
        ]

    def __str__(self):
        return f"{self.form.title} - {self.label}"