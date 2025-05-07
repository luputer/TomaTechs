import numpy as np
from PIL import Image
import tensorflow as tf
from flask import Flask, request, jsonify
import os

# Configure TensorFlow
tf.keras.backend.clear_session()
tf.config.run_functions_eagerly(True)

# Mapping class hasil prediksi ke nama penyakit
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

# Inisialisasi Flask app
app = Flask(__name__)

# Load model sekali saja saat server start
MODEL_PATH = 'model_terbaik.h5'
try:
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model = None

def load_and_preprocess_image(file):
    """Load and preprocess image from uploaded file."""
    img = Image.open(file).convert('RGB')
    img = img.resize((128, 128))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/')
def home():
    return jsonify({"message": "Tomato Leaf Disease Detection API is running"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Preprocess image and predict
        image_array = load_and_preprocess_image(file)
        predictions = model.predict(image_array)
        predicted_class = int(np.argmax(predictions[0]))
        confidence = float(np.max(predictions[0]))
        label = CLASS_MAPPING.get(predicted_class, "Unknown")

        return jsonify({
            'label': label,
            'confidence': f"{confidence:.2%}"
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Untuk Cloud Run
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
