import os
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import tensorflow as tf
from werkzeug.utils import secure_filename
import logging
from supabase import create_client
from datetime import datetime
import base64
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase_bucket = os.getenv("SUPABASE_BUCKET")

logger.info(f"Supabase URL: {supabase_url}")    
logger.info(f"Supabase bucket: {supabase_bucket}")

# Only initialize Supabase client if environment variables are available
if supabase_url and supabase_key:
    try:
        supabase = create_client(supabase_url, supabase_key)
        logger.info("Supabase client initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {str(e)}")
        supabase = None
else:
    logger.warning("Supabase environment variables not found. Supabase functionality will be disabled.")
    supabase = None

# Mapping dictionary for numeric predictions to categories
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

MODEL_PATH = "model_terbaik.h5"
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

# Initialize Flask app first
app = Flask(__name__)

# Then configure CORS - allow all origins for testing
CORS(app, resources={
    r"/*": {
        "origins": "*",  # Allow all origins
        "methods": ["GET", "POST", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
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
    img = img.resize((128, 128))  # Changed to match model input size
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    logger.info(f"Processed image shape: {img_array.shape}")
    return img_array

# @app.route("/")
# def home():
#     return render_template('index.html')

# @app.route("/result")
# def result():
#     return render_template('result.html')

@app.route("/predict", methods=["POST", "OPTIONS"])
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
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
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
                    
                    logger.info(f"Uploading file with content-type: {content_type}")
                    
                    # Generate a unique filename with timestamp and ensure it's in the public folder
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    supabase_filename = f"public/{timestamp}_{os.path.splitext(filename)[0]}.jpg"
                    
                    logger.info(f"Supabase filename: {supabase_filename}")
                    
                    # Check if bucket exists, create if not
                    try:
                        buckets = supabase.storage.list_buckets()
                        bucket_exists = any(bucket['name'] == supabase_bucket for bucket in buckets)
                        
                        if not bucket_exists:
                            logger.info(f"Bucket {supabase_bucket} does not exist, creating it")
                            supabase.storage.create_bucket(supabase_bucket)
                    except Exception as bucket_error:
                        logger.error(f"Error checking/creating bucket: {str(bucket_error)}")
                    
                    # Upload to Supabase Storage
                    logger.info(f"Uploading to bucket: {supabase_bucket}, path: {supabase_filename}")
                    upload_response = supabase.storage.from_(supabase_bucket).upload(
                        path=supabase_filename,
                        file=file_data,
                        file_options={"content-type": content_type}
                    )
                    logger.info(f"Upload response: {upload_response}")
                    
                    # Get the public URL
                    try:
                        image_url = supabase.storage.from_(supabase_bucket).get_public_url(supabase_filename)
                        logger.info(f"Successfully uploaded image to Supabase storage: {image_url}")
                    except Exception as url_error:
                        logger.error(f"Error getting public URL: {str(url_error)}")
                        # Try alternative method to construct URL
                        image_url = f"https://oemzshnztwhntfdadafb.supabase.co/storage/v1/object/public/{supabase_bucket}/{supabase_filename}"
                        logger.info(f"Constructed fallback URL: {image_url}")
                    
                    # Try to store prediction data in Supabase database
                    try:
                        prediction_data = {
                            "user_id": user_id,
                            "image_url": image_url,
                            "predicted_class": label,   
                            "confidence": confidence,
                            "created_at": datetime.now().isoformat()
                        }
                        
                        # Insert into predictions table
                        supabase.table("predictions").insert(prediction_data).execute()
                        logger.info("Successfully inserted prediction data into Supabase database")
                    except Exception as db_error:
                        logger.error(f"Error inserting into Supabase database: {str(db_error)}")
                        logger.info("Continuing with image URL only")
                        # We can continue even if database insert fails, as we still have the image URL
                    
                except Exception as e:
                    logger.error("Error uploading to Supabase: %s", str(e))
            else:
                logger.warning("Skipping Supabase upload as client is not initialized")
            
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
                "image_url": image_url if 'image_url' in locals() else None
            }
            logger.info("Sending response: %s", response_data)
            
            # Set CORS headers explicitly
            response = jsonify(response_data)
            response.headers.add('Access-Control-Allow-Origin', '*')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
            response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
            
            return response
        except Exception as e:
            logger.error("Error during prediction: %s", str(e))
            error_response = jsonify({"error": str(e)})
            error_response.headers.add('Access-Control-Allow-Origin', '*')
            return error_response, 500
    else:
        logger.error("File type not allowed: %s", file.filename)
        error_response = jsonify({"error": "File type not allowed"})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 400

@app.route("/history/<user_id>", methods=["GET"])
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

        data = response.data

        resp = jsonify(data)
        resp.headers.add('Access-Control-Allow-Origin', '*')
        return resp, 200

    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}")
        error_response = jsonify({"error": "Failed to fetch history"})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500


@app.route("/delete/<prediction_id>", methods=["DELETE", "OPTIONS"])
def delete_prediction(prediction_id):
    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Accept')
        return response, 200
        
    logger.info(f"DELETE request received for prediction ID: {prediction_id}")
    
    if supabase is None:
        logger.error("Supabase client not initialized")
        return jsonify({"error": "Database tidak tersedia"}), 500

    try:
        # Convert prediction_id to integer
        try:
            prediction_id = int(prediction_id)
        except ValueError:
            logger.error(f"Invalid prediction ID format: {prediction_id}")
            return jsonify({"error": "Format ID prediksi tidak valid"}), 400

        # Get user_id from request body
        try:
            data = request.get_json()
            user_id = data.get('user_id') if data else None
            logger.info(f"Request user_id: {user_id}")
        except Exception as e:
            logger.error(f"Error parsing request JSON: {str(e)}")
            return jsonify({"error": "Format request tidak valid"}), 400

        # First check if prediction exists
        get_result = supabase.table("predictions") \
            .select("*") \
            .eq("id", prediction_id) \
            .execute()
            
        if not get_result.data:
            logger.warning(f"No prediction found with ID {prediction_id}")
            return jsonify({"error": "Data prediksi tidak ditemukan"}), 404
            
        prediction = get_result.data[0]
        stored_user_id = prediction.get("user_id")
        logger.info(f"Found prediction. Stored user_id: {stored_user_id}")

        # If stored_user_id is not NULL, verify ownership
        if stored_user_id is not None and stored_user_id != user_id:
            logger.warning(f"Unauthorized access: stored_user_id={stored_user_id}, request_user_id={user_id}")
            return jsonify({"error": "Anda tidak memiliki akses ke data ini"}), 403

        # Handle image deletion if exists
        image_url = prediction.get("image_url")
        if image_url and "supabase" in image_url:
            try:
                bucket_pos = image_url.find(supabase_bucket)
                if bucket_pos != -1:
                    path = image_url[bucket_pos + len(supabase_bucket) + 1:]
                    logger.info(f"Deleting image from storage: {path}")
                    supabase.storage.from_(supabase_bucket).remove([path])
            except Exception as e:
                logger.error(f"Error deleting image: {str(e)}")
                # Continue with database deletion

        # Delete the database record
        try:
            delete_query = supabase.table("predictions").delete().eq("id", prediction_id)
            
            # Add user_id condition only if the stored prediction has a user_id
            if stored_user_id is not None:
                delete_query = delete_query.eq("user_id", user_id)
            
            result = delete_query.execute()
            
            if result.data:
                response = jsonify({
                    "success": True,
                    "message": "Data prediksi berhasil dihapus"
                })
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response, 200
            else:
                logger.error("Delete operation returned no data")
                return jsonify({"error": "Gagal menghapus data"}), 500

        except Exception as e:
            logger.error(f"Database delete error: {str(e)}")
            return jsonify({"error": "Gagal menghapus dari database"}), 500

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        error_response = jsonify({"error": "Terjadi kesalahan saat menghapus prediksi"})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500

# Set API Key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))



@app.route("/toma_chat", methods=["POST"])
def toma_chat():
    data = request.json
    user_message = data.get("message")
    
    # Optional: prompt kontekstual
    prompt = f"""
    Kamu adalah asisten budidaya tomat. Jawablah pertanyaan pengguna berikut ini secara informatif:
    "{user_message}"
    """

    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    reply = response.text

    return jsonify({"response": reply})


if __name__ == "__main__":
    logger.info("Starting server on port 8080")
    app.run(host="0.0.0.0", port=8080, debug=True) 