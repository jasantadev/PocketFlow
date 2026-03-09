from django.shortcuts import render
from rest_framework import viewsets
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, CategorySerializer, MovementSerializer
from .models import Category, Movement
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response



# Create your views here.
class UserProfileView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Category.objects.none()
        else:
            return Category.objects.filter(owner=user)
        

class MovementViewSet(viewsets.ModelViewSet):
    serializer_class = MovementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Movement.objects.none()
        else:
            return Movement.objects.filter(owner=user)
        
    def perform_create(self, serializer):
        user = self.request.user
        return serializer.save(owner=user)