import os
import numpy as np
from PIL import Image
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from utils.logger import logger
import tensorflow as tf
from services.supabase_service import supabase
from datetime import datetime
import uuid
from config import CLASS_MAPPING, SUPABASE_BUCKET

predict_bp = Blueprint('predict', __name__)

# Load model
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "model_terbaik.h5")
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load model once at startup
logger.info("Loading model from %s", MODEL_PATH)
model = tf.keras.models.load_model(MODEL_PATH)
logger.info("Model loaded successfully")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    
def load_and_preprocess_image(file_path):
    logger.info("Processing image: %s", file_path)
    img = Image.open(file_path).convert('RGB')
    img = img.resize((128, 128))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    logger.info(f"Processed image shape: {img_array.shape}")
    return img_array

@predict_bp.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return "", 200
        
    logger.info("Received prediction request")
    
    if 'file' not in request.files:
        logger.error("No file part in request")
        return jsonify({"error": "No file part in the request"}), 400
        
    user_id = request.form.get('user_id')
    if not user_id:
        logger.error("No user_id provided")
        return jsonify({"error": "No user_id provided"}), 400
        
    file = request.files['file']
    if file.filename == '':
        logger.error("No file selected")
        return jsonify({"error": "No file selected"}), 400
        
    if file and allowed_file(file.filename):
        try:
            # Save file
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)
            logger.info("File saved to %s", file_path)
            
            # Process image
            image_array = load_and_preprocess_image(file_path)
            logger.info("Image preprocessed successfully")
            
            # Make prediction
            predictions = model.predict(image_array)
            logger.info("Raw predictions: %s", predictions[0])
            
            predicted_class = int(np.argmax(predictions[0]))
            confidence = float(np.max(predictions[0]))
            label = CLASS_MAPPING.get(predicted_class, "Unknown")
            
            logger.info("Prediction: %s (confidence: %.2f)", label, confidence)
            
            # Upload to Supabase
            image_url = None
            if supabase is not None:
                try:
                    # Read the image file
                    with open(file_path, 'rb') as f:
                        file_data = f.read()
                    
                    # Get file extension and set correct content-type
                    file_ext = os.path.splitext(filename)[1].lower()
                    
                    # Convert image to jpg if it's not already
                    if file_ext != '.jpg':
                        logger.info("Converting image to jpg format")
                        img = Image.open(file_path)
                        jpg_path = os.path.splitext(file_path)[0] + '.jpg'
                        img.convert('RGB').save(jpg_path, 'JPEG')
                        file_path = jpg_path
                        with open(file_path, 'rb') as f:
                            file_data = f.read()
                        filename = os.path.basename(file_path)
                        file_ext = '.jpg'
                    
                    content_type = 'image/jpeg'
                    
                    # Generate a unique filename with timestamp
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    supabase_filename = f"public/{timestamp}_{os.path.splitext(filename)[0]}.jpg"
                    
                    # Upload to Supabase Storage
                    upload_response = supabase.storage.from_(SUPABASE_BUCKET).upload(
                        path=supabase_filename,
                        file=file_data,
                        file_options={"content-type": content_type}
                    )
                    
                    # Get the public URL
                    image_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(supabase_filename)
                    
                    # Store prediction data in Supabase database
                    prediction_data = {
                        "user_id": user_id,
                        "image_url": image_url,
                        "predicted_class": label,
                        "confidence": confidence,
                        "created_at": datetime.now().isoformat()
                    }
                    
                    supabase.table("predictions").insert(prediction_data).execute()
                    
                except Exception as e:
                    logger.error("Error uploading to Supabase: %s", str(e))
            
            # Clean up uploaded file
            try:
                os.remove(file_path)
                logger.info("Temporary file removed: %s", file_path)
            except Exception as e:
                logger.warning("Failed to remove temporary file: %s", str(e))
            
            response_data = {
                "predicted_class": predicted_class,
                "label": label,
                "confidence": confidence,
                "image_url": image_url
            }
            
            return jsonify(response_data)
            
        except Exception as e:
            logger.error("Error during prediction: %s", str(e))
            return jsonify({"error": str(e)}), 500
    else:
        logger.error("File type not allowed: %s", file.filename)
        return jsonify({"error": "File type not allowed"}), 400

@predict_bp.route("/history/<user_id>", methods=["GET"])
def user_history(user_id):
    if supabase is None:
        return jsonify({"error": "Supabase not configured"}), 500

    try:
        response = supabase.table("predictions") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .limit(50) \
            .execute()

        return jsonify(response.data), 200

    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}")
        return jsonify({"error": "Failed to fetch history"}), 500

@predict_bp.route("/delete/<prediction_id>", methods=["DELETE", "OPTIONS"])
def delete_prediction(prediction_id):
    if request.method == "OPTIONS":
        return "", 200
        
    if supabase is None:
        return jsonify({"error": "Database tidak tersedia"}), 500

    try:
        data = request.get_json()
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID diperlukan"}), 400

        # First check if prediction exists
        get_result = supabase.table("predictions") \
            .select("*") \
            .eq("id", prediction_id) \
            .eq("user_id", user_id) \
            .execute()
            
        if not get_result.data:
            return jsonify({"error": "Data prediksi tidak ditemukan"}), 404
            
        prediction = get_result.data[0]

        # Handle image deletion if exists
        image_url = prediction.get("image_url")
        if image_url and 'images' in image_url:
            try:
                file_path = image_url.split('images/')[-1]
                supabase.storage.from_('images').remove([file_path])
            except Exception as e:
                logger.error(f"Error deleting image: {str(e)}")

        # Delete the database record
        delete_result = supabase.table("predictions") \
            .delete() \
            .eq("id", prediction_id) \
            .eq("user_id", user_id) \
            .execute()
            
        return jsonify({
            "success": True,
            "message": "Data prediksi berhasil dihapus"
        }), 200

    except Exception as e:
        logger.error(f"Error deleting prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500 