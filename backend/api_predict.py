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
from google import genai
from google.genai import types
import uuid


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

# Configure CORS to allow requests from your frontend
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000"],  # Add your frontend URLs
        "methods": ["GET", "POST", "OPTIONS"],
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
        # Get user_id from request body
        try:
            data = request.get_json()
            user_id = data.get('user_id')
            if not user_id:
                return jsonify({"error": "User ID diperlukan"}), 400
            logger.info(f"Request user_id: {user_id}")
        except Exception as e:
            logger.error(f"Error parsing request JSON: {str(e)}")
            return jsonify({"error": "Format request tidak valid"}), 400

        # First check if prediction exists
        get_result = supabase.table("predictions") \
            .select("*") \
            .eq("id", prediction_id) \
            .eq("user_id", user_id) \
            .execute()
            
        logger.info(f"Get result: {get_result.data}")
            
        if not get_result.data:
            logger.warning(f"No prediction found with ID {prediction_id}")
            return jsonify({"error": "Data prediksi tidak ditemukan"}), 404
            
        prediction = get_result.data[0]

        # Handle image deletion if exists
        image_url = prediction.get("image_url")
        if image_url and supabase_bucket in image_url:
            try:
                # Extract the file path from the URL
                file_path = image_url.split(f"{supabase_bucket}/")[-1]
                logger.info(f"Attempting to delete image: {file_path}")
                supabase.storage.from_(supabase_bucket).remove([file_path])
                logger.info("Successfully deleted image from storage")
            except Exception as e:
                logger.error(f"Error deleting image: {str(e)}")
                # Continue with database deletion even if image deletion fails

        # Delete the database record
        try:
            delete_result = supabase.table("predictions") \
                .delete() \
                .eq("id", prediction_id) \
                .eq("user_id", user_id) \
                .execute()
            
            logger.info(f"Delete result: {delete_result}")
            
            # Check if we got a valid response from Supabase
            if delete_result and hasattr(delete_result, 'data') and isinstance(delete_result.data, list):
                response = jsonify({
                    "success": True,
                    "message": "Data prediksi berhasil dihapus"
                })
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response, 200
            else:
                logger.error("Invalid delete response format")
                return jsonify({"error": "Format respons tidak valid"}), 500

        except Exception as e:
            logger.error(f"Database delete error: {str(e)}")
            return jsonify({"error": f"Gagal menghapus dari database: {str(e)}"}), 500

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        error_response = jsonify({"error": f"Terjadi kesalahan saat menghapus prediksi: {str(e)}"})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500

@app.route("/toma_chat", methods=["POST", "OPTIONS"])
def toma_chat():
    if request.method == "OPTIONS":
        # Handle preflight request
        response = jsonify({"message": "preflight"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    try:
        data = request.json
        user_message = data.get("message")
        user_id = data.get("user_id")

        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        client = genai.Client(
            vertexai=True,
            project="231142263655",
            location="europe-central2",
        )
        model = "projects/231142263655/locations/europe-central2/endpoints/965551529094283264"
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part(text=f"""
                    Kamu adalah asisten budidaya tomat yang sangat ahli. 
                    Jawablah pertanyaan pengguna berikut ini secara informatif:
    "{user_message}"
                    """)
                ]
            )
        ]

        generate_content_config = types.GenerateContentConfig(
            temperature=1,
            top_p=0.95,
            max_output_tokens=8192,
            safety_settings=[
                types.SafetySetting(
                    category="HARM_CATEGORY_HATE_SPEECH",
                    threshold="OFF"
                ),
                types.SafetySetting(
                    category="HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold="OFF"
                ),
                types.SafetySetting(
                    category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold="OFF"
                ),
                types.SafetySetting(
                    category="HARM_CATEGORY_HARASSMENT",
                    threshold="OFF"
                )
            ],
        )

        # Store user message in database
        try:
            user_message_data = {
                "user_id": user_id,
                "message": user_message,
                "is_bot": False,
                "role": "user"
            }
            supabase.table("chats").insert(user_message_data).execute()
        except Exception as db_error:
            logger.error(f"Error storing user message: {str(db_error)}")

        # Generate response and collect all chunks
        full_response = ""
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            if chunk.text:
                full_response += chunk.text

        # Store bot response in database
        try:
            bot_response_data = {
                "user_id": user_id,
                "message": full_response,
                "is_bot": True,
                "role": "assistant"
            }
            supabase.table("chats").insert(bot_response_data).execute()
        except Exception as db_error:
            logger.error(f"Error storing bot response: {str(db_error)}")

        # Create the response with CORS headers
        api_response = jsonify({"response": full_response})
        api_response.headers.add('Access-Control-Allow-Origin', '*')
        return api_response

    except Exception as e:
        logger.error(f"Error in toma_chat: {str(e)}")
        error_response = jsonify({"error": str(e)})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500

@app.route("/chat_history/<user_id>", methods=["GET"])
def chat_history(user_id):
    try:
        logger.info(f"Fetching chat history for user: {user_id}")
        
        # Fetch chat history for the user
        response = supabase.table("chats") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=False) \
            .execute()
            
        logger.info(f"Raw Supabase response: {response.data}")

        messages = []
        for record in response.data:
            messages.append({
                "id": record["id"],
                "text": record["message"],
                "sender": "bot" if record["is_bot"] else "user",
                "timestamp": record["created_at"]
            })
                
        logger.info(f"Formatted messages: {messages}")

        # Add CORS headers
        response = jsonify(messages)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

    except Exception as e:
        logger.error(f"Error fetching chat history: {str(e)}")
        error_response = jsonify({"error": str(e)})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500

@app.route("/cs_chat", methods=["POST", "OPTIONS"])
def cs_chat():


    if request.method == "OPTIONS":
        response = jsonify({"message": "preflight"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response

    try:
        data = request.json
        if not data or 'messages' not in data:
            return jsonify({"error": "No messages provided"}), 400
            
        messages = data.get("messages", [])
        if not messages:
            return jsonify({"error": "Empty messages array"}), 400

        # Initialize Vertex AI client
        client = genai.Client(
            vertexai=True,
            project="231142263655",
            location="us-central1",
        )

        model = "projects/231142263655/locations/us-central1/endpoints/5311842928367239168"
        
        # Convert messages to Vertex AI format
        contents = []
        for msg in messages:
            if msg.get("content"):
                contents.append(
                    types.Content(
                        role=msg["role"],
                        parts=[types.Part(text=msg["content"])]
                    )
                )

        if not contents:
            return jsonify({"error": "No valid message content"}), 400

        # Store user's last message in database
        try:
            last_message = messages[-1]
            user_message_data = {
                "message": last_message["content"],
                "is_bot": False,
                "created_at": datetime.now().isoformat()
            }
            supabase.table("chat_history").insert(user_message_data).execute()
        except Exception as db_error:
            logger.error(f"Error storing user message: {str(db_error)}")

        # Set up generation config
        generate_content_config = types.GenerateContentConfig(
            temperature=1,
            top_p=0.95,
            max_output_tokens=8192,
            safety_settings=[
                types.SafetySetting(
                    category="HARM_CATEGORY_HATE_SPEECH",
                    threshold="OFF"
                ),
                types.SafetySetting(
                    category="HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold="OFF"
                ),
                types.SafetySetting(
                    category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold="OFF"
                ),
                types.SafetySetting(
                    category="HARM_CATEGORY_HARASSMENT",
                    threshold="OFF"
                )
            ],
        )

        # Generate response
        try:
            full_response = ""
            for chunk in client.models.generate_content_stream(
                model=model,
                contents=contents,
                config=generate_content_config,
            ):
                if chunk.text:
                    full_response += chunk.text

            # Store bot response in database
            try:
                bot_message_data = {
                    "message": full_response,
                    "is_bot": True,
                    "created_at": datetime.now().isoformat()
                }
                supabase.table("chat_history").insert(bot_message_data).execute()
            except Exception as db_error:
                logger.error(f"Error storing bot response: {str(db_error)}")

            response = jsonify({"response": full_response})
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

        except Exception as vertex_error:
            logger.error(f"Vertex AI error: {str(vertex_error)}")
            return jsonify({"error": "Failed to generate response"}), 500

    except Exception as e:
        logger.error(f"Error in cs_chat: {str(e)}")
        error_response = jsonify({"error": str(e)})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500



#route forum
@app.route("/create_post", methods=["POST", "OPTIONS"])
def create_post():
    if request.method == "OPTIONS":
        return "", 200
    try:
        data = request.json
        user_id = data.get("user_id")
        title = data.get("title")
        content = data.get("content")
        image_url = data.get("image_url")  # opsional

        if not user_id or not title or not content:
            return jsonify({"error": "Missing required fields"}), 400

        new_post = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "title": title,
            "content": content,
            "image_url": image_url,
            "like_count": 0,
            "unlike_count": 0,
            "created_at": datetime.now().isoformat()
        }

        supabase.table("forum_posts").insert(new_post).execute()
        return jsonify({"message": "Post berhasil dibuat", "post": new_post}), 201

    except Exception as e:
        logger.error(f"Error creating post: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/get_posts", methods=["GET"])
def get_posts():
    try:
        response = supabase.table("forum_posts") \
            .select("*") \
            .order("created_at", desc=True) \
            .execute()

        return jsonify(response.data), 200

    except Exception as e:
        logger.error(f"Error fetching posts: {str(e)}")
        return jsonify({"error": "Gagal mengambil daftar posting"}), 500

@app.route("/post/<post_id>", methods=["GET"])
def get_post(post_id):
    try:
        # Ambil detail posting
        post_response = supabase.table("forum_posts") \
            .select("*") \
            .eq("id", post_id) \
            .single() \
            .execute()

        # Ambil komentar
        comment_response = supabase.table("forum_comments") \
            .select("*") \
            .eq("post_id", post_id) \
            .order("created_at", desc=True) \
            .execute()

        return jsonify({
            "post": post_response.data,
            "comments": comment_response.data
        }), 200

    except Exception as e:
        logger.error(f"Error fetching post details: {str(e)}")
        return jsonify({"error": "Gagal mengambil detail posting"}), 500

@app.route("/add_comment", methods=["POST", "OPTIONS"])
def add_comment():
    if request.method == "OPTIONS":
        return "", 200

    try:
        data = request.json
        post_id = data.get("post_id")
        user_id = data.get("user_id")
        content = data.get("content")
        username = data.get("username")

        if not all([post_id, user_id, content]):
            return jsonify({"error": "Missing required fields"}), 400

        comment_data = {
            "id": str(uuid.uuid4()),
            "post_id": post_id,
            "user_id": user_id,
            "content": content,
            "username": username,
            "created_at": datetime.now().isoformat()
        }

        supabase.table("forum_comments").insert(comment_data).execute()
        return jsonify({"message": "Komentar berhasil ditambahkan", "comment": comment_data}), 201

    except Exception as e:
        logger.error(f"Error adding comment: {str(e)}")
        return jsonify({"error": "Gagal menambahkan komentar"}), 500

@app.route("/vote_post", methods=["POST", "OPTIONS"])
def vote_post():
    if request.method == "OPTIONS":
        return "", 200

    try:
        data = request.json
        post_id = data.get("post_id")
        user_id = data.get("user_id")
        vote_type = data.get("vote_type")  # 'like' atau 'unlike'

        if not all([post_id, user_id, vote_type]):
            return jsonify({"error": "Missing required fields"}), 400

        # Cek apakah user sudah pernah vote
        existing_vote = supabase.table("post_votes") \
            .select("*") \
            .eq("post_id", post_id) \
            .eq("user_id", user_id) \
            .execute()

        if existing_vote.data:
            # Jika sudah ada, update vote_type
            supabase.table("post_votes") \
                .update({"vote_type": vote_type}) \
                .eq("id", existing_vote.data[0]["id"]) \
                .execute()
        else:
            # Jika belum ada, insert baru
            supabase.table("post_votes").insert({
                "id": str(uuid.uuid4()),
                "post_id": post_id,
                "user_id": user_id,
                "vote_type": vote_type
            }).execute()

        # Hitung total like/unlike
        like_count = supabase.table("post_votes") \
            .select("*", count="exact") \
            .eq("post_id", post_id) \
            .eq("vote_type", "like") \
            .execute(count_only=True)

        unlike_count = supabase.table("post_votes") \
            .select("*", count="exact") \
            .eq("post_id", post_id) \
            .eq("vote_type", "unlike") \
            .execute(count_only=True)

        # Update jumlah like/unlike di forum_posts
        print("Updating forum_posts with like_count:", like_count.count, "unlike_count:", unlike_count.count)
        result = supabase.table("forum_posts") \
            .update({
                "like_count": like_count.count,
                "unlike_count": unlike_count.count
            }) \
            .eq("id", post_id) \
            .execute()
        print("Update result:", result)

        return jsonify({
            "message": f"Vote {vote_type} berhasil",
            "like_count": like_count.count,
            "unlike_count": unlike_count.count
        }), 200

    except Exception as e:
        logger.error(f"Error voting: {str(e)}")
        return jsonify({"error": "Gagal melakukan voting"}), 500

if __name__ == "__main__":
    logger.info("Starting server on port 8080")
    app.run(host="0.0.0.0", port=8080, debug=True) 