from rest_framework import serializers
from django.contrib.auth import get_user_model
from profiles.models import Profile, CoachProfile, PlayerProfile
from students.models import Student
from training.models import TrainingSession
from attendance.models import Attendance
from documents.models import Document

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'first_name', 'last_name')
        read_only_fields = ('id',)

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Profile
        fields = '__all__'

class CoachProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = CoachProfile
        fields = '__all__'

class PlayerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = PlayerProfile
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class TrainingSessionSerializer(serializers.ModelSerializer):
    coach_name = serializers.CharField(source='coach.username', read_only=True)
    class Meta:
        model = TrainingSession
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    session_title = serializers.CharField(source='session.title', read_only=True)
    class Meta:
        model = Attendance
        fields = '__all__'

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ('user',)
