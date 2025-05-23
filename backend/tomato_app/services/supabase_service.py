from supabase import create_client
from utils.logger import logger
from config import SUPABASE_URL, SUPABASE_KEY, SUPABASE_BUCKET

# Log configuration
logger.info(f"Supabase URL: {SUPABASE_URL}")
logger.info(f"Supabase Bucket: {SUPABASE_BUCKET}")
logger.info(f"Supabase Key exists: {bool(SUPABASE_KEY)}")

# Initialize Supabase client
try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    logger.info("Supabase client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Supabase client: {str(e)}")
    supabase = None

def ensure_bucket_exists():
    """Ensure the storage bucket exists."""
    if supabase is None:
        return False
        
    try:
        # First check if bucket exists
        buckets = supabase.storage.list_buckets()
        bucket_exists = any(bucket['name'] == SUPABASE_BUCKET for bucket in buckets)
        
        if not bucket_exists:
            logger.info(f"Bucket {SUPABASE_BUCKET} does not exist, creating it")
            try:
                # Create bucket with public access
                supabase.storage.create_bucket(
                    id=SUPABASE_BUCKET,
                    options={
                        "public": True,
                        "allowed_mime_types": ["image/jpeg", "image/png"],
                        "file_size_limit": 5242880  # 5MB
                    }
                )
                logger.info(f"Successfully created bucket {SUPABASE_BUCKET}")
            except Exception as create_error:
                logger.error(f"Error creating bucket: {str(create_error)}")
                # If bucket creation fails, try to use existing bucket
                return any(bucket['name'] == SUPABASE_BUCKET for bucket in buckets)
            
        return True
    except Exception as e:
        logger.error(f"Error checking/creating bucket: {str(e)}")
        return False 