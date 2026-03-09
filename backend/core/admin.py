from django.contrib import admin
from .models import Category, Movement

# Register your models here.
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    model = Category
    list_display = ["owner", "title", "monthly_budget"]
    list_display_links = ["owner"]
    list_filter = ["owner"]
    search_fields = ["owner__username", "title"]

@admin.register(Movement)
class MovementAdmin(admin.ModelAdmin):
    model = Movement
    list_display = ["owner", "amount", "category", "date", "type"]
    list_display_links = ["owner", "category"]
    list_filter = ["category", "owner", "date", "type"]
    search_fields = ["owner__username", "date"]