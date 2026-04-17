from rest_framework import serializers
from datetime import datetime
from decimal import Decimal

from .models import Employee, EmployeeFieldValue


class FieldValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeFieldValue
        fields = ["label", "value"]


class EmployeeSerializer(serializers.ModelSerializer):
    values = FieldValueSerializer(many=True)
    form_title = serializers.CharField(
        source="form.title",
        read_only=True
    )

    class Meta:
        model = Employee
        fields = ["id", "form", "form_title", "values"]

    def validate(self, attrs):
        form = attrs["form"]
        values = attrs["values"]

        form_fields = {
            field.label: field
            for field in form.fields.all()
        }

        submitted_labels = []

        if not values:
            raise serializers.ValidationError({
                "values": "At least one field required."
            })

        for item in values:
            label = item["label"]
            value = item["value"]

            if label in submitted_labels:
                raise serializers.ValidationError({
                    "values": f"Duplicate label: {label}"
                })

            submitted_labels.append(label)

            if label not in form_fields:
                raise serializers.ValidationError({
                    "values": f"{label} not in selected form."
                })

            field = form_fields[label]

            if field.is_required and not str(value).strip():
                raise serializers.ValidationError({
                    label: "This field is required."
                })

            if field.field_type == "number":
                try:
                    Decimal(str(value))
                except:
                    raise serializers.ValidationError({
                        label: "Must be valid number."
                    })

            elif field.field_type == "date":
                try:
                    datetime.strptime(value, "%Y-%m-%d")
                except:
                    raise serializers.ValidationError({
                        label: "Date must be YYYY-MM-DD."
                    })

            elif field.field_type == "email":
                if "@" not in value:
                    raise serializers.ValidationError({
                        label: "Invalid email."
                    })

        return attrs

    def create(self, validated_data):
        values_data = validated_data.pop("values")

        employee = Employee.objects.create(**validated_data)

        for item in values_data:
            EmployeeFieldValue.objects.create(
                employee=employee,
                **item
            )

        return employee
    
    def update(self, instance, validated_data):
        values_data = validated_data.pop("values", [])

        # update parent
        instance.form = validated_data.get(
            "form",
            instance.form
        )
        instance.save()

        # remove old child values
        instance.values.all().delete()

        # create new child values
        for item in values_data:
            EmployeeFieldValue.objects.create(
                employee=instance,
                **item
            )

        return instance