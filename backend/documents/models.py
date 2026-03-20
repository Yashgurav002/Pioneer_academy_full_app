from django.db import models
from django.conf import settings

class Document(models.Model):
    DOCUMENT_TYPES = (
        ('IDENTITY', 'Identity Proof'),
        ('MEDICAL', 'Medical Record'),
        ('CONTRACT', 'Contract'),
        ('OTHER', 'Other'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to='documents/%Y/%m/%d/')
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES, default='OTHER')
    title = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.user.username})"
