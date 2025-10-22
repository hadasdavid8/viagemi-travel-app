set -e 

SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR"

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

cd ..

echo "--- Starting Gunicorn Server ---"
cd backend
gunicorn planner.wsgi --bind 0.0.0.0:8000

