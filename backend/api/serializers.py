from rest_framework import serializers
from django.contrib.auth import get_user_model
from profiles.models import Profile, CoachProfile, PlayerProfile
from students.models import Student
from training.models import TrainingSession
from attendance.models import Attendance
from documents.models import Document

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role', 'first_name', 'last_name')
        read_only_fields = ('id',)

    def create(self, validated_data):
        password = validated_data.pop('password', 'defaultpassword123')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Profile
        fields = '__all__'

class CoachProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    dob = serializers.DateField(source='user.profile.dob', read_only=True)
    phone = serializers.CharField(source='user.profile.phone', read_only=True)
    address = serializers.CharField(source='user.profile.address', read_only=True)
    
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

class CoachRegistrationSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    dob = serializers.DateField(required=False, allow_null=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    
    resume = serializers.FileField(required=False, allow_null=True)
    license = serializers.FileField(required=False, allow_null=True)
    contract = serializers.FileField(required=False, allow_null=True)
    specialization = serializers.CharField(max_length=255, required=False, allow_blank=True)
    experience_years = serializers.IntegerField(default=0)

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ('user',)

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role
        return token
