from django.db import models

# Create your models here.
class Employee(models.Model):

    employee_id = models.CharField(max_length=20, unique=True)
    nic_number = models.CharField(max_length=20, unique=True)

    name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField()

    center_department = models.CharField(max_length=150)

    designation = models.CharField(max_length=150)
    current_designation = models.CharField(max_length=150)

    appointment_date = models.DateField()
    promotion_date = models.DateField(null=True, blank=True)

    pension_date = models.DateField()
    next_increment_date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name