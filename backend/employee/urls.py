from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    EmployeeViewSet,
    EBSubjectViewSet,
    EmployeeEBExamViewSet,
    EmployeePromotionViewSet,
    login_view,
    signup_view,
    change_password,
)

router = DefaultRouter()

router.register(r'employees', EmployeeViewSet)

router.register(
    r'eb-subjects',
    EBSubjectViewSet
)

router.register(
    r'eb-exams',
    EmployeeEBExamViewSet
)

router.register(
    r'promotions',
    EmployeePromotionViewSet
)

urlpatterns = [
    path('login/', login_view),
    path('signup/', signup_view),
    path('change-password/', change_password),

    path('', include(router.urls)),
]