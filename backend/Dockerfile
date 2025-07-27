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

RUN sed -i 's/\r$//' /app/wait-for-db.sh
RUN chmod +x /app/wait-for-db.sh

EXPOSE 8000

CMD ["/bin/bash", "-c", "/app/wait-for-db.sh python manage.py runserver 0.0.0.0:8000"]
