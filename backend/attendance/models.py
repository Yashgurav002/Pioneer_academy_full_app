from django.db import models
from students.models import Student
from training.models import TrainingSession
from django.conf import settings

class Attendance(models.Model):
    STATUS_CHOICES = (
        ('PRESENT', 'Present'),
        ('ABSENT', 'Absent'),
        ('EXCUSED', 'Excused'),
    )

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendances')
    session = models.ForeignKey(TrainingSession, on_delete=models.CASCADE, related_name='attendances')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PRESENT')
    marked_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='marked_attendances')
    date_marked = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'session')

    def __str__(self):
        return f"{self.student.full_name} - {self.session.title} - {self.status}"
