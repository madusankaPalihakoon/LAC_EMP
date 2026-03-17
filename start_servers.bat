@echo off

echo Starting Django Backend...
cd /d F:\LAC_EMP\backend
start cmd /k python manage.py runserver 0.0.0.0:8000

echo Starting React Frontend...
cd /d F:\LAC_EMP\frontend
start cmd /k npm run dev -- --host

echo Servers Started