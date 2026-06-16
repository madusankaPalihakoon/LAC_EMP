import pandas as pd
from datetime import datetime

from django.core.management.base import BaseCommand

from employee.models import (
    Employee,
    EBSubject,
    EmployeeEBExam,
)


class Command(BaseCommand):

    def handle(self, *args, **kwargs):

        file_path = "eb.xlsx"

        df = pd.read_excel(file_path)

        df.columns = (
            df.columns.astype(str)
            .str.replace("\n", " ", regex=False)
            .str.strip()
        )

        print(df.columns.tolist())

        def clean_marks(value):
            if pd.isna(value):
                return None

            value = str(value).strip()

            if value in ["", "-", "--", "N/A", "nan"]:
                return None

            try:
                return float(value)
            except:
                return None

        def clean_date(value):
            if pd.isna(value):
                return None

            if isinstance(value, pd.Timestamp):
                return value.date()

            value = str(value).strip()

            if value in ["", "-", "--"]:
                return None

            formats = [
                "%d/%m/%Y",
                "%d/%m/%y",
                "%Y-%m-%d",
            ]

            for fmt in formats:
                try:
                    return datetime.strptime(
                        value,
                        fmt
                    ).date()
                except:
                    pass

            print(f"Invalid date: {value}")
            return None

        admin = EBSubject.objects.get(
            subject_name="Administration and Public Policy"
        )

        finance = EBSubject.objects.get(
            subject_name="Public Finance Management"
        )

        management = EBSubject.objects.get(
            subject_name="Management (General)"
        )

        count = 0

        for _, row in df.iterrows():

            epf = str(
                row["EPF No"]
            ).strip()

            try:
                employee = Employee.objects.get(
                    epf_no=epf
                )

            except Employee.DoesNotExist:
                print(
                    f"Employee {epf} not found"
                )
                continue

            exam_date = clean_date(
                row["Promotion Date"]
            )

            result = str(
                row["1 EB"]
            ).upper().strip()

            admin_marks = clean_marks(
                row["Administration and Public Policy"]
            )

            finance_marks = clean_marks(
                row["Public Finance Management"]
            )

            management_marks = clean_marks(
                row["Management (General)"]
            )

            # Administration
            EmployeeEBExam.objects.get_or_create(
                employee=employee,
                subject=admin,
                exam_date=exam_date,
                defaults={
                    "result": result,
                    "marks": admin_marks,
                },
            )

            # Finance
            EmployeeEBExam.objects.get_or_create(
                employee=employee,
                subject=finance,
                exam_date=exam_date,
                defaults={
                    "result": result,
                    "marks": finance_marks,
                },
            )

            # Management
            EmployeeEBExam.objects.get_or_create(
                employee=employee,
                subject=management,
                exam_date=exam_date,
                defaults={
                    "result": result,
                    "marks": management_marks,
                },
            )

            count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"{count} employee EB records imported successfully."
            )
        )