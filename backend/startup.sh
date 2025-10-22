
set -e 

echo "--- Running Frontend Install & Build ---"

cd frontend
npm install 
npm run build 

cd ..

echo "--- Running Django Commands ---"

cd backend

echo "Running Migrations..."
python manage.py migrate --noinput

echo "Collecting Static Files..."
python manage.py collectstatic --noinput

echo "--- Starting Gunicorn Server ---"
gunicorn planner.wsgi --bind 0.0.0.0:8000