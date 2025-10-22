#!/bin/bash

# קובץ זה מבצע את כל שלבי ה-Build וההפעלה הנדרשים לפרויקט Django + React.

# 1. הגדרת סביבה בטוחה: עוצר מיד אם פקודה נכשלת
set -e 

# הנחה: פקודת האתחול של Azure היא ./backend/startup.sh והיא מורצת מתיקיית השורש.
# ה-Virtual Environment נמצא בנתיב היחסי: ./antenv/

# --- שלב 0: ניקוי Oryx (פותר בעיות cache ונתיב) ---
echo "--- Running Oryx Clean ---"
oryx clean

echo "--- Running Frontend Install & Build ---"

# --- שלב 1: טיפול בפרונטאנד (React) ---

# 1.1: ניווט לתיקיית הפרונטאנד (התיקייה הנוכחית היא השורש)
cd frontend

# 1.2: התקנה ובנייה של React
npm install
npm run build 

# 1.3: חזרה לתיקיית השורש (viagemi travel app/)
cd ..

# --- שלב 2: הרצת פקודות Django ---
echo "--- Running Django Commands ---"

# 2.1: ניווט לתיקיית הבקאנד (backend/)
cd backend

# 2.2: הרץ את המיגרציות של ג'אנגו
echo "Running Migrations..."
# הפניה לפייתון מתוך ה-VENV שנמצא ברמת השורש (../antenv/bin)
../antenv/bin/python manage.py migrate --noinput

# 2.3: הרץ את collectstatic
echo "Collecting Static Files..."
../antenv/bin/python manage.py collectstatic --noinput

# --- שלב 3: הפעלת שרת Gunicorn ---
echo "--- Starting Gunicorn Server ---"
# הפעלת Gunicorn באמצעות הפקודה המלאה
../antenv/bin/gunicorn planner.wsgi --bind 0.0.0.0:8000