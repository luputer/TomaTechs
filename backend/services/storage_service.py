import os
from datetime import datetime
from PIL import Image
from utils.logger import logger
from services.supabase_service import supabase, SUPABASE_BUCKET

def resize_image(image_file, max_size=(800, 800)):
    """Resize image while maintaining aspect ratio."""
    try:
        img = Image.open(image_file)
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        return img
    except Exception as e:
        logger.error(f"Error resizing image: {str(e)}")
        return None

def upload_image(image_file):
    """Upload an image to Supabase storage."""
    try:
        if supabase is None:
            logger.error("Supabase client not initialized")
            return None
            
        # Resize image before uploading
        resized_img = resize_image(image_file)
        if resized_img is None:
            return None
            
        # Save resized image to bytes
        from io import BytesIO
        img_byte_arr = BytesIO()
        resized_img.save(img_byte_arr, format='JPEG', quality=85)
        img_byte_arr.seek(0)
        
        # Generate a unique filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"public/{timestamp}_{image_file.filename}"
        
        # Upload to Supabase Storage
        upload_response = supabase.storage.from_(SUPABASE_BUCKET).upload(
            path=filename,
            file=img_byte_arr.getvalue(),
            file_options={"content-type": "image/jpeg"}
        )
        
        # Get the public URL
        image_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(filename)
        logger.info(f"Successfully uploaded image to Supabase storage: {image_url}")
        
        return image_url
        
    except Exception as e:
        logger.error(f"Error uploading image: {str(e)}")
        return None 