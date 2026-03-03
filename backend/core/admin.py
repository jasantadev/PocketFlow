from django.contrib import admin
from .models import Category, Movement

# Register your models here.
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    model = Category
    list_display = ["user", "title", "monthly_budget"]
    list_display_links = ["user"]
    list_filter = ["user"]
    search_fields = ["user__username", "title"]

@admin.register(Movement)
class MovementAdmin(admin.ModelAdmin):
    model = Movement
    list_display = ["user", "amount", "category", "date", "type"]
    list_display_links = ["user", "category"]
    list_filter = ["category", "user", "date", "type"]
    search_fields = ["user__username", "date"]