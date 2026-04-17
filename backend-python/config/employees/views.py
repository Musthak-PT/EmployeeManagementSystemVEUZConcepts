from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from django.db.models import Q
from .models import Employee
from .serializers import EmployeeSerializer


"""
Create Employee
"""
class EmployeeCreateView(APIView):

    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        try:
            serializer.save()

        except IntegrityError:
            return Response(
                {
                    "success": False,
                    "message": "Unable to create employee."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "success": True,
                "message": "Employee created successfully",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )


"""
List Employees
Search by label / value
"""
class EmployeeListView(APIView):

    def get(self, request):
        search = request.GET.get("search", "").strip()

        queryset = Employee.objects.select_related(
            "form"
        ).prefetch_related(
            "values"
        ).all()

        if search:
            queryset = queryset.filter(
                Q(values__label__icontains=search) |
                Q(values__value__icontains=search) |
                Q(form__title__icontains=search)
            )

        queryset = queryset.distinct().order_by("-id")

        serializer = EmployeeSerializer(
            queryset,
            many=True
        )

        return Response(
            {
                "success": True,
                "count": queryset.count(),
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )


"""
Employee Detail
"""
class EmployeeDetailView(APIView):

    def get_object(self, pk):
        try:
            return Employee.objects.select_related(
                "form"
            ).prefetch_related(
                "values"
            ).get(pk=pk)

        except Employee.DoesNotExist:
            return None

    def get(self, request, pk):
        employee = self.get_object(pk)

        if not employee:
            return Response(
                {
                    "success": False,
                    "message": "Employee not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = EmployeeSerializer(employee)

        return Response(
            {
                "success": True,
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )


"""
Update Employee
"""
class EmployeeUpdateView(APIView):

    def get_object(self, request, pk):
        try:
            return Employee.objects.get(
                pk=pk,
                form__user=request.user
            )

        except Employee.DoesNotExist:
            return None

    def put(self, request, pk):
        employee = self.get_object(request, pk)

        if not employee:
            return Response(
                {
                    "success": False,
                    "message": "Employee not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = EmployeeSerializer(
            employee,
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        try:
            serializer.save()

        except IntegrityError:
            return Response(
                {
                    "success": False,
                    "message": "Unable to update employee."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "success": True,
                "message": "Employee updated successfully",
                "data": serializer.data
            },
            status=status.HTTP_200_OK
        )


"""
Delete Employee
"""
class EmployeeDeleteView(APIView):

    def get_object(self, request, pk):
        try:
            return Employee.objects.get(
                pk=pk,
                form__user=request.user
            )

        except Employee.DoesNotExist:
            return None

    def delete(self, request, pk):
        employee = self.get_object(request, pk)

        if not employee:
            return Response(
                {
                    "success": False,
                    "message": "Employee not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        employee.delete()

        return Response(
            {
                "success": True,
                "message": "Employee deleted successfully"
            },
            status=status.HTTP_200_OK
        )