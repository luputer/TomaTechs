import numpy as np
from PIL import Image
import tensorflow as tf
from zipfile import ZipFile
import io
import os
import ipywidgets as widgets
from IPython.display import display
from google.colab import drive
import gdown

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

def load_and_preprocess_image(file_path, zip_ref=None):
    """
    Loads and preprocesses an image either from a file path or from a zip file.

    Args:
        file_path: Path to the image file or path within zip file
        zip_ref: Optional zip file reference if loading from zip

    Returns:
        Preprocessed image array ready for model input
    """
    if zip_ref is not None:
        # Load from zip file
        with zip_ref.open(file_path) as file:
            img = Image.open(io.BytesIO(file.read())).convert('RGB')
    else:
        # Load from local file
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

def on_upload_change(change):
    """Handles file upload and prediction."""
    uploaded_filename = next(iter(change['new'].keys()))  # Get the uploaded filename
    uploaded_file_content = change['new'][uploaded_filename]['content']  # Get the file content

    # Write file content to temporary file
    with open('uploaded_image.jpg', 'wb') as f:
        f.write(uploaded_file_content)

    global image_path  # Update image_path with temporary file
    image_path = 'uploaded_image.jpg'

    # Process the image and make predictions
    try:
        image_array = load_and_preprocess_image(image_path)
        predictions = predict_image(model, image_array)
        predicted_class = np.argmax(predictions[0])
        confidence = np.max(predictions[0])

        # Get the category name from the mapping
        category_name = CLASS_MAPPING.get(predicted_class, "Unknown")

        print(f"Predicted class: {category_name} (Class {predicted_class})")
        print(f"Confidence: {confidence:.2%}")  # Display as percentage

    except Exception as e:
        print(f"Error processing image: {e}")

def download_model_from_drive():
    """Downloads the model file from Google Drive."""
    # Google Drive file ID from the shareable link
    file_id = '1YWhsKnFTnprf15qiIaq3aXmh4UuesXqv'

    # URL for downloading the file
    url = f'https://drive.google.com/uc?id={file_id}'

    # Output file path
    output = 'model_terbaik.h5'

    # Download the file
    gdown.download(url, output, quiet=False)

    return output

def main():
    # Download the model from Google Drive
    print("Downloading model from Google Drive...")
    model_path = download_model_from_drive()
    print(f"Model downloaded to: {model_path}")

    # Verify model file exists and has expected size
    if not os.path.exists(model_path):
        print(f"Error: Model file not found at {model_path}")
        return

    # Replace 'expected_size' with your model's actual expected size in bytes
    expected_size = 10000000  # Example: 10MB
    actual_size = os.path.getsize(model_path)
    if actual_size < expected_size:
        print(f"Warning: Model file size is smaller than expected ({actual_size} bytes vs {expected_size} bytes). It might be corrupted.")
        print("Try re-downloading or re-transferring the model file.")
        return

    global model  # Declare model as global for on_upload_change function
    model = load_model(model_path)
    print("Model loaded successfully!")

    # Create file upload widget and display it
    uploader = widgets.FileUpload(accept='image/*', multiple=False)  # Allow image uploads
    display(uploader)

    # Observe changes in the file upload widget and trigger prediction
    uploader.observe(on_upload_change, names='value')  # Observe changes in uploaded files
    global image_path  # Declare image_path as global for on_upload_change function
    image_path = None  # Initialize to None

if __name__ == "__main__":
    main()