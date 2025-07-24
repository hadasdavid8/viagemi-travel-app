#!/bin/sh

echo "Waiting for MySQL to be ready..."

while ! nc -z db 3306; do
  echo "Waiting for database connection..."
  sleep 1
done

echo "Database is up, starting server..."
exec "$@"
