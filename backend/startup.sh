
set -e 

SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR"

echo "--- Running Frontend Install & Build ---"

cd ..             
cd frontend       
npm install 
npm run build 

cd ..            
cd backend        


echo "--- Running Django Commands ---"

echo "Running Migrations..."
python manage.py migrate --noinput


echo "Collecting Static Files..."
python manage.py collectstatic --noinput


echo "--- Starting Gunicorn Server ---"
gunicorn planner.wsgi --bind 0.0.0.0:8000
