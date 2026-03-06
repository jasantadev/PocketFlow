from .models import Category, Movement
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Sum, Value
from django.db.models.functions import Coalesce


class UserSerializer(serializers.ModelSerializer):
    balance = serializers.SerializerMethodField()
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email', 'balance')

    def get_balance(self, obj):
        total_income = obj.movements.filter(type=Movement.MovementType.INCOME).aggregate(total=Coalesce(Sum("amount"), Value(0)))
        total_expense = obj.movements.filter(type=Movement.MovementType.EXPENSE).aggregate(total=Coalesce(Sum("amount"), Value(0)))
        return(total_income["total"] - total_expense["total"])
        

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('title', 'description', 'monthly_budget')
        

class MovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movement
        fields = ('amount', 'category', 'date', 'description', 'type')