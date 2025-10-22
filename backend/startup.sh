set -e 

echo "--- Running Frontend Install & Build ---"

cd frontend

npm install
npm run build 

cd ..

echo "--- Running Django Commands ---"

cd backend

echo "Running Migrations..."
../antenv/bin/python manage.py migrate --noinput

echo "Collecting Static Files..."
../antenv/bin/python manage.py collectstatic --noinput

echo "--- Starting Gunicorn Server ---"
../antenv/bin/gunicorn planner.wsgi --bind 0.0.0.0:8000