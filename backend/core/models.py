from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

# Create your models here.
class Category(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="categories")
    title = models.CharField(max_length=50, verbose_name="Titulo")
    description = models.TextField(null=True, blank=True, verbose_name="Descripcion")
    monthly_budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, validators=[MinValueValidator(0)],blank=True, verbose_name="Presupuesto")

class Movement(models.Model):

    class MovementType(models.TextChoices):
        INCOME = "INCOME", "Ingreso"
        EXPENSE = "EXPENSE", "Gasto"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="movements")
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="movements", null=True, blank=True)
    date = models.DateField()
    description = models.CharField(max_length=100, verbose_name="Descripcion")
    created_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=10, choices=MovementType.choices)