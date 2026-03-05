from .models import Category, Movement
from rest_framework import serializers
from django.conf import settings



class UserSerializer(serializers.ModelSerializer):
    #Tengo que introducir campo calculado -> Capital Total, sumando y restando todos los movimiento del Usuario
    class Meta:
        model = settings.AUTH_USER_MODEL
        fields = ('id', 'username', 'email')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('title', 'description', 'monthly_budget')

class MovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movement
        fields = ('amount', 'category', 'date', 'description', 'type')