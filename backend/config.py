import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Flask configuration
DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
HOST = os.getenv('FLASK_HOST', '0.0.0.0')
PORT = int(os.getenv('FLASK_PORT', '8080'))

# File upload configuration
UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

# Model configuration
MODEL_PATH = os.getenv('MODEL_PATH', 'model_terbaik.h5')
CLASS_MAPPING = {
    0: "Bacterial_spot",
    1: "Early_blight",
    2: "Late_blight",
    3: "Leaf_Mold",
    4: "Septoria_leaf_spot",
    5: "Spider_mites Two-spotted_spider_mite",
    6: "Target_Spot",
    7: "Tomato_Yellow_Leaf_Curl_Virus",
    8: "Tomato_mosaic_virus",
    9: "healthy"
}

# Supabase configuration
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
SUPABASE_BUCKET = os.getenv('SUPABASE_BUCKET')

# Google Gemini configuration
GEMINI_PROJECT = "231142263655"
GEMINI_LOCATION = "us-central1"
TOMA_CHAT_MODEL = "projects/231142263655/locations/us-central1/endpoints/7670743970690891776"
CS_CHAT_MODEL = "projects/231142263655/locations/us-central1/endpoints/7610789800651522048"

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True) 