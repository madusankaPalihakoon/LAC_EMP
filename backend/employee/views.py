from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth.models import User
from .models import *

@api_view(['POST'])
def signup_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    center = request.data.get('center')

    # Validation
    if not username or not password or not center:
        return Response({
            'status': 'error',
            'message': 'All fields are required (username, password, center)'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Check existing user
    if User.objects.filter(username=username).exists():
        return Response({
            'status': 'error',
            'message': 'Username already exists'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Create user
    user = User.objects.create_user(
        username=username,
        password=password
    )

    # Save profile (with role)
    profile = UserProfile.objects.create(
        user=user,
        center=center,
        role='user'
    )

    token = Token.objects.create(user=user)

    return Response({
        'status': 'success',
        'message': 'User created successfully',
        'token': token.key,
        'username': user.username,
        'role': profile.role,   # ✅ FIXED
        'center': profile.center
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)

        profile, _ = UserProfile.objects.get_or_create(
            user=user,
            defaults={'center': '', 'role': 'user'}
        )

        return Response({
            'status': 'success',
            'token': token.key,
            'user_id': user.id,
            'role': profile.role,
            'username': user.username,
            'center': profile.center
        })

    return Response({
        'status': 'error',
        'message': 'Invalid credentials'
    }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user

    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    # Validation
    if not old_password or not new_password:
        return Response({
            'status': 'error',
            'message': 'Both old and new passwords are required'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Check old password
    if not user.check_password(old_password):
        return Response({
            'status': 'error',
            'message': 'Old password is incorrect'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Set new password
    user.set_password(new_password)
    user.save()

    return Response({
        'status': 'success',
        'message': 'Password changed successfully'
    })

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    lookup_field = 'employee_id'
    permission_classes = [IsAuthenticated]

class EBSubjectViewSet(viewsets.ModelViewSet):
    queryset = EBSubject.objects.all()
    serializer_class = EBSubjectSerializer


class EmployeeEBExamViewSet(viewsets.ModelViewSet):
    queryset = EmployeeEBExam.objects.select_related(
        "employee",
        "subject"
    )
    serializer_class = EmployeeEBExamSerializer

class EmployeeEBExamViewSet(viewsets.ModelViewSet):

    queryset = EmployeeEBExam.objects.select_related(
        "employee",
        "subject"
    )

    serializer_class = EmployeeEBExamSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        epf = self.request.query_params.get("epf")

        if epf:
            queryset = queryset.filter(
                employee__epf_no=epf
            )

        return queryset.order_by(
            "exam_date",
            "subject__subject_name"
        )


class EmployeePromotionViewSet(viewsets.ModelViewSet):
    queryset = EmployeePromotion.objects.select_related(
        "employee"
    )
    serializer_class = EmployeePromotionSerializer