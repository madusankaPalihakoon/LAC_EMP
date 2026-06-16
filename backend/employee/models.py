from django.db import models
from django.contrib.auth.models import User

class Employee(models.Model):
    id = models.AutoField(primary_key=True)

    epf_no = models.CharField(
        max_length=50,
        unique=True
    )

    center = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    employee_name = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    designation = models.CharField(
        max_length=150,
        null=True,
        blank=True
    )

    date_joined = models.DateField(
        null=True,
        blank=True
    )

    identity_card_number = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )

    date_of_birth = models.DateField(
        null=True,
        blank=True
    )

    class Meta:
        db_table = "employees"

    def __str__(self):
        return f"{self.employee_name} ({self.epf_no})"
    

class EBSubject(models.Model):

    id = models.AutoField(primary_key=True)

    exam_type = models.CharField(
        max_length=20
    )

    subject_name = models.CharField(
        max_length=255
    )

    class Meta:
        db_table = "eb_subjects"

    def __str__(self):
        return self.subject_name
    
class EmployeeEBExam(models.Model):

    id = models.AutoField(primary_key=True)

    employee = models.ForeignKey(
        Employee,
        to_field='epf_no',
        db_column='epf_no',
        on_delete=models.CASCADE,
        related_name='eb_exams'
    )

    subject = models.ForeignKey(
        EBSubject,
        on_delete=models.CASCADE
    )

    exam_date = models.DateField(
        null=True,
        blank=True
    )

    result = models.CharField(
        max_length=50
    )

    marks = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )

    class Meta:
        db_table = "employee_eb_exams"

        unique_together = (
            "employee",
            "subject",
            "exam_date",
        )

class EmployeePromotion(models.Model):

    id = models.AutoField(primary_key=True)

    employee = models.ForeignKey(
        Employee,
        to_field='epf_no',
        db_column='epf_no',
        on_delete=models.CASCADE,
        related_name='promotions'
    )

    promotion_date = models.DateField()

    promotion_type = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    remarks = models.TextField(
        null=True,
        blank=True
    )

    class Meta:
        db_table = "employee_promotions"


# database name = lac_employee
class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('admin', 'Admin'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    center = models.CharField(max_length=255)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    def __str__(self):
        return self.user.username