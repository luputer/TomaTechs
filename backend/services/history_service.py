from services.supabase_service import supabase
from utils.logger import logger

def get_user_history(user_id):
    """Get prediction history for a user."""
    try:
        response = supabase.table("predictions") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .limit(50) \
            .execute()
            
        return response.data
        
    except Exception as e:
        logger.error(f"Error fetching user history: {str(e)}")
        raise

def delete_prediction(prediction_id, user_id):
    """Delete a prediction from history."""
    try:
        # First check if prediction exists and belongs to user
        get_result = supabase.table("predictions") \
            .select("*") \
            .eq("id", prediction_id) \
            .eq("user_id", user_id) \
            .execute()
            
        if not get_result.data:
            return False
            
        # Delete the prediction
        delete_result = supabase.table("predictions") \
            .delete() \
            .eq("id", prediction_id) \
            .eq("user_id", user_id) \
            .execute()
            
        return bool(delete_result.data)
        
    except Exception as e:
        logger.error(f"Error deleting prediction: {str(e)}")
        raise 