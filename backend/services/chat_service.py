from datetime import datetime
from utils.logger import logger
from services.supabase_service import supabase
from services.gemini_service import generate_toma_chat_response, generate_cs_chat_response

def get_chat_response(message, user_id=None):
    """Get a response from the chat model."""
    try:
        # Generate response
        response = generate_toma_chat_response(message)
        
        # Store in database if user_id is provided
        if user_id:
            try:
                # Store user message
                user_message_data = {
                    "user_id": user_id,
                    "message": message,
                    "is_bot": False,
                    "role": "user"
                }
                supabase.table("chats").insert(user_message_data).execute()
                
                # Store bot response
                bot_response_data = {
                    "user_id": user_id,
                    "message": response,
                    "is_bot": True,
                    "role": "assistant"
                }
                supabase.table("chats").insert(bot_response_data).execute()
            except Exception as db_error:
                logger.error(f"Error storing chat messages: {str(db_error)}")
        
        return response
    except Exception as e:
        logger.error(f"Error getting chat response: {str(e)}")
        raise

def get_cs_chat_response(messages):
    """Get a response from the customer service chat model."""
    try:
        # Generate response
        response = generate_cs_chat_response(messages)
        
        # Store in database
        try:
            # Store last user message
            last_message = messages[-1]
            user_message_data = {
                "message": last_message["content"],
                "is_bot": False,
                "created_at": datetime.now().isoformat()
            }
            supabase.table("chat_history").insert(user_message_data).execute()
            
            # Store bot response
            bot_message_data = {
                "message": response,
                "is_bot": True,
                "created_at": datetime.now().isoformat()
            }
            supabase.table("chat_history").insert(bot_message_data).execute()
        except Exception as db_error:
            logger.error(f"Error storing CS chat messages: {str(db_error)}")
        
        return response
    except Exception as e:
        logger.error(f"Error getting CS chat response: {str(e)}")
        raise

def get_chat_history(user_id):
    """Get chat history for a user."""
    try:
        response = supabase.table("chats") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=False) \
            .execute()
            
        messages = []
        for record in response.data:
            messages.append({
                "id": record["id"],
                "text": record["message"],
                "sender": "bot" if record["is_bot"] else "user",
                "timestamp": record["created_at"]
            })
                
        return messages

    except Exception as e:
        logger.error(f"Error fetching chat history: {str(e)}")
        raise 