import os
from datetime import datetime
from PIL import Image
from utils.logger import logger
from services.supabase_service import supabase, SUPABASE_BUCKET

def upload_image(image_file):
    """Upload an image to Supabase storage."""
    try:
        if supabase is None:
            logger.error("Supabase client not initialized")
            return None
            
        # Read the image file
        file_data = image_file.read()
        
        # Generate a unique filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"public/{timestamp}_{image_file.filename}"
        
        # Upload to Supabase Storage
        upload_response = supabase.storage.from_(SUPABASE_BUCKET).upload(
            path=filename,
            file=file_data,
            file_options={"content-type": "image/jpeg"}
        )
        
        # Get the public URL
        image_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(filename)
        logger.info(f"Successfully uploaded image to Supabase storage: {image_url}")
        
        return image_url
        
    except Exception as e:
        logger.error(f"Error uploading image: {str(e)}")
        return None 