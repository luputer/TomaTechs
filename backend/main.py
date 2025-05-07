import numpy as np
from PIL import Image
import tensorflow as tf
from zipfile import ZipFile
import io
import os
from flask import Flask, request, jsonify

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

app = Flask(__name__)

@app.route('/')
def index():
    """Renders the HTML form for image upload."""
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Image Prediction</title>
    </head>
    <body>
        <h1>Upload an Image for Prediction</h1>
        <form action="/predict" method="post" enctype="multipart/form-data">
            <input type="file" name="file" accept="image/*" required>
            <button type="submit">Predict</button>
        </form>
    </body>
    </html>
    '''

def load_and_preprocess_image(file_path):
    """
    Loads and preprocesses an image from a file path.

    Args:
        file_path: Path to the image file

    Returns:
        Preprocessed image array ready for model input
    """
    img = Image.open(file_path).convert('RGB')

    # Resize to match model input shape
    img = img.resize((128, 128))

    # Convert to NumPy array and normalize
    img_array = np.array(img) / 255.0

    # Add batch dimension (shape becomes [1, 128, 128, 3])
    img_array = np.expand_dims(img_array, axis=0)

    return img_array

def load_model(model_path):
    """Loads a saved TensorFlow model."""
    return tf.keras.models.load_model(model_path)

def predict_image(model, image_array):
    """Makes prediction on a single image."""
    predictions = model.predict(image_array)
    return predictions

@app.route('/predict', methods=['POST'])
def predict():
    """Handles image upload and prediction."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        # Save the uploaded file to a temporary location
        file_path = 'uploaded_image.jpg'
        file.save(file_path)

        # Process the image and make predictions
        image_array = load_and_preprocess_image(file_path)
        predictions = predict_image(model, image_array)
        predicted_class = np.argmax(predictions[0])
        confidence = np.max(predictions[0])

        # Get the category name from the mapping
        category_name = CLASS_MAPPING.get(predicted_class, "Unknown")

        return jsonify({
            'predicted_class': category_name,
            'confidence': f"{confidence:.2%}"
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Deklarasi variabel global di luar fungsi
model = None

def main():
    global model  # Deklarasi global harus dilakukan sebelum digunakan

    # Path ke file model lokal
    model_path = 'model_terbaik.h5'

    # Verifikasi apakah file model ada
    if not os.path.exists(model_path):
        print(f"Error: Model file not found at {model_path}")
        return

    # Muat model lama jika ada
    model_lama_path = 'model_lama.h5'
    if os.path.exists(model_lama_path):
        temp_model = tf.keras.models.load_model(model_lama_path)
        temp_model.save(model_path)
        print(f"Model lama disimpan ulang sebagai {model_path}")

    # Muat model dan pastikan variabel global digunakan
    model = load_model(model_path)
    print("Model loaded successfully!")

    # Jalankan Flask app
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)

if __name__ == "__main__":
    main()
