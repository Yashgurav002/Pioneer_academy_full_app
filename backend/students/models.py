from django.db import models

class Student(models.Model):
    full_name = models.CharField(max_length=255)
    dob = models.DateField()
    guardian_name = models.CharField(max_length=255)
    contact = models.CharField(max_length=50)
    address = models.TextField()
    joining_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.full_name
