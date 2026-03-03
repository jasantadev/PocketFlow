from django.contrib import admin
from .models import Category, Movement

# Register your models here.

class CategoryAdmin(admin.ModelAdmin):
    model = Category
    list_display = ["title", "monthly_budget"]
    list_display_links = ["user"]
    list_filter = ["user"]
    search_fields = ["user", "title"]

@admin.register(Category, CategoryAdmin)