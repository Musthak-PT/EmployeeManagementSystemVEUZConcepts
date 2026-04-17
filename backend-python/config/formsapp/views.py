from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import DynamicForm
from .serializers import DynamicFormSerializer
from django.db import IntegrityError

       
class FormCreateView(APIView):

    def post(self, request):
        serializer = DynamicFormSerializer(
            data=request.data,
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        try:
            serializer.save(user=request.user)

        except IntegrityError:
            return Response(
                {
                    "success": False,
                    "message": "Form title already exists."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "success": True,
                "message": "Form created successfully",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )


class FormListView(APIView):

    def get(self, request):
        forms = DynamicForm.objects.filter(user=request.user)

        serializer = DynamicFormSerializer(forms, many=True)

        return Response(
            {
                "success": True,
                "count": forms.count(),
                "data": serializer.data
            }
        )