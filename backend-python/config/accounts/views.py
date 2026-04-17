from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .serializers import RegisterSerializer, ProfileSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True) # Validates data and automatically returns a 400 error if invalid
        serializer.save()

        return Response({
            "success": True,
            "message": "Registration successful"
        }, status=201)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = authenticate(
            username=request.data["username"],
            password=request.data["password"]
        )

        if not user:
            return Response({
                "success": False,
                "message": "Invalid credentials"
            }, status=400)

        refresh = RefreshToken.for_user(user)

        return Response({
            "success": True,
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })


class ProfileView(APIView):

    def get(self, request):
        serializer = ProfileSerializer(request.user)

        return Response({
            "success": True,
            "data": serializer.data
        })


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return Response({
                "success": False,
                "message": "Both old and new passwords are required"
            }, status=400)

        if not request.user.check_password(old_password):
            return Response({
                "success": False,
                "message": "Old password is incorrect"
            }, status=400)
        
        if old_password == new_password:
            return Response({
                "success": False,
                "message": "New password cannot be the same as old password"
            }, status=400)

        request.user.set_password(new_password)
        request.user.save()

        return Response({
            "success": True,
            "message": "Password changed successfully"
        }, status=200)