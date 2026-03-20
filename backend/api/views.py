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

from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction

class CoachProfileViewSet(viewsets.ModelViewSet):
    queryset = CoachProfile.objects.all()
    serializer_class = CoachProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser], parser_classes=[MultiPartParser, FormParser])
    @transaction.atomic
    def register(self, request):
        from .serializers import CoachRegistrationSerializer
        serializer = CoachRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        # 1. Create User
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role='COACH'
        )
        
        # 2. Update the auto-created base Profile
        profile = user.profile
        profile.dob = data.get('dob')
        profile.phone = data.get('phone')
        profile.address = data.get('address')
        profile.save()
        
        # 3. Update the auto-created CoachProfile
        coach_profile = user.coach_profile
        coach_profile.resume = data.get('resume')
        coach_profile.license = data.get('license')
        coach_profile.contract = data.get('contract')
        coach_profile.specialization = data.get('specialization', '')
        coach_profile.experience_years = data.get('experience_years', 0)
        coach_profile.save()
        
        return Response(CoachProfileSerializer(coach_profile).data, status=status.HTTP_201_CREATED)

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

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
