# from rest_framework import serializers
# from .models import DynamicForm, FormField


# class FormFieldSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = FormField
#         fields = ["label", "field_type", "order"]


# class DynamicFormSerializer(serializers.ModelSerializer):
#     fields = FormFieldSerializer(many=True)

#     class Meta:
#         model = DynamicForm
#         fields = ["id", "title", "fields"]

#     def create(self, validated_data):
#         fields_data = validated_data.pop("fields")
#         form = DynamicForm.objects.create(**validated_data)

#         for field in fields_data:
#             FormField.objects.create(form=form, **field)

#         return form

from rest_framework import serializers
from .models import DynamicForm, FormField


ALLOWED_FIELD_TYPES = [
    "text",
    "textarea",
    "number",
    "date",
    "password",
    "email",
    "phone",
]


class FormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormField
        fields = ["id","label","field_type","order","is_required","placeholder"]
        read_only_fields = ["id"]

    def validate_label(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Field label is required."
            )

        if len(value) < 2:
            raise serializers.ValidationError(
                "Field label must be at least 2 characters."
            )

        if len(value) > 100:
            raise serializers.ValidationError(
                "Field label cannot exceed 100 characters."
            )

        return value

    def validate_field_type(self, value):
        if value not in ALLOWED_FIELD_TYPES:
            raise serializers.ValidationError(
                f"{value} is not a valid field type."
            )

        return value

    def validate_order(self, value):
        if value < 1:
            raise serializers.ValidationError(
                "Order must be greater than 0."
            )

        return value

    def validate_placeholder(self, value):
        if value:
            value = value.strip()

        return value


class DynamicFormSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True)

    class Meta:
        model = DynamicForm
        fields = ["id","title","fields","created_at","updated_at"]
        read_only_fields = ["id","created_at","updated_at"]

    def validate_title(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Title is required."
            )

        if len(value) < 3:
            raise serializers.ValidationError(
                "Title must be at least 3 characters."
            )

        if len(value) > 100:
            raise serializers.ValidationError(
                "Title cannot exceed 100 characters."
            )

        request = self.context.get("request")

        if request:
            queryset = DynamicForm.objects.filter(
                user=request.user,
                title__iexact=value
            )

            if self.instance:
                queryset = queryset.exclude(
                    id=self.instance.id
                )

            if queryset.exists():
                raise serializers.ValidationError(
                    "You already created a form with this title."
                )

        return value

    def validate(self, attrs):
        fields = attrs.get("fields", [])

        if not fields:
            raise serializers.ValidationError({
                "fields": "At least one field is required."
            })

        labels = []
        orders = []

        for field in fields:
            label = field["label"].strip().lower()
            order = field["order"]

            # duplicate labels
            if label in labels:
                raise serializers.ValidationError({
                    "fields":
                    f"Duplicate label found: {field['label']}"
                })

            labels.append(label)

            # duplicate orders
            if order in orders:
                raise serializers.ValidationError({
                    "fields":
                    f"Duplicate order found: {order}"
                })

            orders.append(order)

        return attrs

    def create(self, validated_data):
        fields_data = validated_data.pop("fields")

        form = DynamicForm.objects.create(
            **validated_data
        )

        for field in fields_data:
            FormField.objects.create(
                form=form,
                label=field["label"].strip(),
                field_type=field["field_type"],
                order=field["order"],
                is_required=field.get(
                    "is_required", True
                ),
                placeholder=field.get(
                    "placeholder", ""
                )
            )

        return form

    def update(self, instance, validated_data):
        fields_data = validated_data.pop("fields", [])

        instance.title = validated_data.get(
            "title",
            instance.title
        )
        instance.save()

        instance.fields.all().delete()

        for field in fields_data:
            FormField.objects.create(
                form=instance,
                label=field["label"].strip(),
                field_type=field["field_type"],
                order=field["order"],
                is_required=field.get(
                    "is_required", True
                ),
                placeholder=field.get(
                    "placeholder", ""
                )
            )

        return instance