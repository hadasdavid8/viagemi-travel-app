echo "Running Frontend Install & Build..."
cd frontend
npm install 
npm run build 
cd .. 

echo "Navigating to backend directory (for manage.py)..."
cd backend

echo "Running Migrations..."
python manage.py migrate

echo "Collecting Static Files..."

python manage.py collectstatic --noinput


echo "Starting Gunicorn..."

gunicorn planner.wsgi --bind 0.0.0.0:8000
