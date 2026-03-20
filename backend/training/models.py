from django.db import models
from django.conf import settings

class TrainingSession(models.Model):
    title = models.CharField(max_length=255)
    coach = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, limit_choices_to={'role': 'COACH'})
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} on {self.date}"
