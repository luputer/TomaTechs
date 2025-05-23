# Use the official Python image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy only the tomato_app directory
COPY tomato_app/ .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy only the tomato_app directory
COPY tomato_app/ ./tomato_app/

# Set environment variables
ENV PORT=8080
ENV PYTHONPATH=/app

# Expose port
EXPOSE 8080

# Run the application
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 tomato_app:create_app()
