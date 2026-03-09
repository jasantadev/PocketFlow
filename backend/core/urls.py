from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, MovementViewSet, UserProfileView
from django.urls import path, include

router = DefaultRouter()

router.register("categories", CategoryViewSet, "category")
router.register("movements", MovementViewSet, "movement")

urlpatterns = [
    path('me/', UserProfileView.as_view(), name='user-me'),
    path('', include(router.urls)),
]