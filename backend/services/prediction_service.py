import os
import numpy as np
from PIL import Image
import tensorflow as tf
from utils.logger import logger
from services.storage_service import upload_image
from services.supabase_service import supabase
from datetime import datetime
from config import MODEL_PATH, CLASS_MAPPING

# Load model once at startup
logger.info(f"Loading model from: {MODEL_PATH}")
model = tf.keras.models.load_model(MODEL_PATH)

def load_and_preprocess_image(image_file):
    """Load and preprocess the image for prediction."""
    try:
        img = Image.open(image_file).convert('RGB')
        img = img.resize((128, 128))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        raise

def predict_disease(image_file):
    """Predict the disease from the image."""
    try:
        # Preprocess image
        image_array = load_and_preprocess_image(image_file)
        
        # Make prediction
        predictions = model.predict(image_array)
        predicted_class = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]))
        label = CLASS_MAPPING.get(predicted_class, "Unknown")
        
        return {
            "predicted_class": predicted_class,
            "label": label,
            "confidence": confidence
        }
    except Exception as e:
        logger.error(f"Error making prediction: {str(e)}")
        raise

def save_prediction(image_file, prediction, user_id):
    """Save the prediction to the database."""
    try:
        # Upload image to storage
        image_url = upload_image(image_file)
        
        # Save prediction to database
        prediction_data = {
            "user_id": user_id,
            "image_url": image_url,
            "predicted_class": prediction["label"],
            "confidence": prediction["confidence"],
            "created_at": datetime.now().isoformat()
        }
        
        result = supabase.table("predictions").insert(prediction_data).execute()
        return result.data[0] if result.data else None
        
    except Exception as e:
        logger.error(f"Error saving prediction: {str(e)}")
        raise 