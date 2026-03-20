from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        COACH = 'COACH', 'Coach'
        STAFF = 'STAFF', 'Staff'
        PLAYER = 'PLAYER', 'Player'

    role = models.CharField(max_length=15, choices=Role.choices, default=Role.PLAYER)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.username} - {self.role}"
