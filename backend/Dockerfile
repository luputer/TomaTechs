FROM py

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir --timeout 1000 -r requirements.txt

# Copy only necessary files
COPY main.py .
COPY model_terbaik.h5 .

# Verify model file exists and show its size
RUN ls -lh model_terbaik.h5

ENV PORT=8080
ENV PYTHONUNBUFFERED=1

EXPOSE 8080

CMD ["gunicorn", "--bind", ":8080", "--workers", "1", "--threads", "8", "--timeout", "0", "main:app"]
