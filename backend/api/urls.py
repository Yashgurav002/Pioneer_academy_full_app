from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    UserViewSet, ProfileViewSet, CoachProfileViewSet, PlayerProfileViewSet,
    StudentViewSet, TrainingSessionViewSet, AttendanceViewSet, DocumentViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'profiles', ProfileViewSet)
router.register(r'coaches', CoachProfileViewSet)
router.register(r'players', PlayerProfileViewSet)
router.register(r'students', StudentViewSet)
router.register(r'training', TrainingSessionViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
