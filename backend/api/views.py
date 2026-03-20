from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.decorators import action

from .serializers import (
    UserSerializer, ProfileSerializer, CoachProfileSerializer, PlayerProfileSerializer,
    StudentSerializer, TrainingSessionSerializer, AttendanceSerializer, DocumentSerializer
)
from profiles.models import Profile, CoachProfile, PlayerProfile
from students.models import Student
from training.models import TrainingSession
from attendance.models import Attendance
from documents.models import Document
from .permissions import IsAdminUser, IsCoachOrAdmin, IsOwnerOrReadOnly, IsStaffOrAdmin

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

class CoachProfileViewSet(viewsets.ModelViewSet):
    queryset = CoachProfile.objects.all()
    serializer_class = CoachProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class PlayerProfileViewSet(viewsets.ModelViewSet):
    queryset = PlayerProfile.objects.all()
    serializer_class = PlayerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    
    def get_permissions(self):
        return [permissions.IsAuthenticated()]

class TrainingSessionViewSet(viewsets.ModelViewSet):
    queryset = TrainingSession.objects.all()
    serializer_class = TrainingSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
