from django.db import models
from django.conf import settings
from cloudinary_storage.storage import RawMediaCloudinaryStorage

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255)
    dob = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    address = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} Profile"

class CoachProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='coach_profile')
    resume = models.FileField(upload_to='coaches/resumes/', storage=RawMediaCloudinaryStorage(), null=True, blank=True)
    license = models.FileField(upload_to='coaches/licenses/', storage=RawMediaCloudinaryStorage(), null=True, blank=True)
    contract = models.FileField(upload_to='coaches/contracts/', storage=RawMediaCloudinaryStorage(), null=True, blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    specialization = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Coach {self.user.username}"

class PlayerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='player_profile')
    position = models.CharField(max_length=100, null=True, blank=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Height in cm")
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Weight in kg")
    medical_report = models.FileField(upload_to='players/medical/', storage=RawMediaCloudinaryStorage(), null=True, blank=True)
    contract = models.FileField(upload_to='players/contracts/', storage=RawMediaCloudinaryStorage(), null=True, blank=True)

    def __str__(self):
        return f"Player {self.user.username}"
