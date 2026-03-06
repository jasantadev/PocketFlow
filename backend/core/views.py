from django.shortcuts import render
from rest_framework import viewsets
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, CategorySerializer, MovementSerializer
from .models import Category, Movement
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = get_user_model().objects.all()
    permission_classes = [IsAuthenticated]


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Category.objects.none()
        else:
            return Category.objects.filter(user=user)
        

class MovementViewSet(viewsets.ModelViewSet):
    serializer_class = MovementSerializer
    queryset = Movement.objects.all()
    permission_classes = [IsAuthenticated]