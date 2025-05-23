from flask import Blueprint, request, jsonify
from utils.logger import logger
from services.supabase_service import supabase
from datetime import datetime
from google import genai
from google.genai import types

chat_bp = Blueprint('chat', __name__)

@chat_bp.route("/toma_chat", methods=["POST", "OPTIONS"])
def toma_chat():
    if request.method == "OPTIONS":
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
            location="us-central1",
        )
        model = "projects/231142263655/locations/us-central1/endpoints/7670743970690891776"
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

        response = jsonify({"response": full_response})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    except Exception as e:
        logger.error(f"Error in toma_chat: {str(e)}")
        error_response = jsonify({"error": str(e)})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500

@chat_bp.route("/chat_history/<user_id>", methods=["GET"])
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

        response = jsonify(messages)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

    except Exception as e:
        logger.error(f"Error fetching chat history: {str(e)}")
        error_response = jsonify({"error": str(e)})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500

@chat_bp.route("/cs_chat", methods=["POST", "OPTIONS"])
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

        model = "projects/231142263655/locations/us-central1/endpoints/7610789800651522048"
        
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