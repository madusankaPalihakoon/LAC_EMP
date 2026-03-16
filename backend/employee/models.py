from django.db import models

class Employee(models.Model):
    employee_id = models.CharField(max_length=20, unique=True)
    nic_number = models.CharField(max_length=20, blank=True, null=True)
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    center_department = models.CharField(max_length=150, blank=True, null=True)
    designation = models.CharField(max_length=150, blank=True, null=True)
    current_designation = models.CharField(max_length=150, blank=True, null=True)
    appointment_date = models.DateField(blank=True, null=True)
    promotion_date = models.DateField(blank=True, null=True)
    pension_date = models.DateField(blank=True, null=True)
    next_increment_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "employee_employee"

    def __str__(self):
        return f"{self.employee_id} - {self.name}"