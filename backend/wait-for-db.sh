echo "Waiting for MySQL to be ready..."

while ! nc -z viagemi-db.c9yik8gk2zvq.eu-north-1.rds.amazonaws.com 3306; do
  echo "Waiting for database connection..."
  sleep 1
done

echo "Database is up, starting server..."
exec "$@"
