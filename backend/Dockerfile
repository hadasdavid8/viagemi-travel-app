FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    libssl-dev \
    libffi-dev \
    pkg-config \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /app/

RUN echo "echo \"Waiting for MySQL to be ready...\"" > /app/wait-for-db.sh && \
    echo "" >> /app/wait-for-db.sh && \
    echo "while ! nc -z viagemi-db.c9yik8gk2zvq.eu-north-1.rds.amazonaws.com 3306; do" >> /app/wait-for-db.sh && \
    echo "  echo \"Waiting for database connection...\"" >> /app/wait-for-db.sh && \
    echo "  sleep 1" >> /app/wait-for-db.sh && \
    echo "done" >> /app/wait-for-db.sh && \
    echo "" >> /app/wait-for-db.sh && \
    echo "echo \"Database is up, starting server...\"" >> /app/wait-for-db.sh && \
    echo "exec \"\$@\"" >> /app/wait-for-db.sh

RUN chmod +x /app/wait-for-db.sh


EXPOSE 8000

CMD ["/app/wait-for-db.sh", "python", "manage.py", "runserver", "0.0.0.0:8000"]
