import tensorflow as tf
import numpy as np
from ..config import MODEL_PATH, CLASS_MAPPING
from ..utils.logger import logger

def load_model():
    try:
        logger.info(f"Loading model from {MODEL_PATH}")
        model = tf.keras.models.load_model(MODEL_PATH)
        logger.info("Model loaded successfully")
        return model
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        return None

def predict_image(model, image_array):
    try:
        predictions = model.predict(image_array)
        predicted_class = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]))
        label = CLASS_MAPPING.get(predicted_class, "Unknown")
        
        logger.info(f"Prediction: {label} (confidence: {confidence:.2f})")
        
        return {
            "predicted_class": predicted_class,
            "label": label,
            "confidence": confidence
        }
    except Exception as e:
        logger.error(f"Error making prediction: {str(e)}")
        return None

# Load model at module level
model = load_model() 