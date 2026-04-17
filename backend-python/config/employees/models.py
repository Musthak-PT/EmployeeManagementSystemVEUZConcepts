from django.db import models
from formsapp.models import DynamicForm


class Employee(models.Model):
    form = models.ForeignKey(
        DynamicForm,
        on_delete=models.CASCADE,
        related_name="employees"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return f"Employee #{self.id}"


class EmployeeFieldValue(models.Model):
    employee = models.ForeignKey(
        Employee,
        related_name="values",
        on_delete=models.CASCADE
    )

    label = models.CharField(max_length=100)
    value = models.TextField()

    class Meta:
        unique_together = ("employee", "label")

    def __str__(self):
        return self.label