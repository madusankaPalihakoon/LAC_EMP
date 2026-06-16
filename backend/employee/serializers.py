from rest_framework import serializers
from .models import Employee,EBSubject,EmployeeEBExam,EmployeePromotion

class EmployeeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Employee
        fields = '__all__'

class EBSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = EBSubject
        fields = "__all__"


class EmployeeEBExamSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(
        source="subject.subject_name",
        read_only=True
    )

    employee_name = serializers.CharField(
        source="employee.employee_name",
        read_only=True
    )

    class Meta:
        model = EmployeeEBExam
        fields = "__all__"


class EmployeePromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeePromotion
        fields = "__all__"

class EmployeeEBExamSerializer(serializers.ModelSerializer):

    employee_name = serializers.CharField(
        source="employee.employee_name",
        read_only=True
    )

    epf_no = serializers.CharField(
        source="employee.epf_no",
        read_only=True
    )

    subject_name = serializers.CharField(
        source="subject.subject_name",
        read_only=True
    )

    class Meta:
        model = EmployeeEBExam
        fields = "__all__"


class EmployeePromotionSerializer(serializers.ModelSerializer):

    employee_name = serializers.CharField(
        source="employee.employee_name",
        read_only=True
    )

    epf_no = serializers.CharField(
        source="employee.epf_no",
        read_only=True
    )

    class Meta:
        model = EmployeePromotion
        fields = "__all__"