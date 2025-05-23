import os
from google import genai
from google.genai import types
from utils.logger import logger
from config import GEMINI_PROJECT, GEMINI_LOCATION, TOMA_CHAT_MODEL, CS_CHAT_MODEL

# Initialize Gemini client
client = genai.Client(
    vertexai=True,
    project=GEMINI_PROJECT,
    location=GEMINI_LOCATION
)

def generate_toma_chat_response(message):
    """Generate a response using the Toma chat model."""
    try:
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part(text=f"""
                    Kamu adalah asisten budidaya tomat yang sangat ahli. 
                    Jawablah pertanyaan pengguna berikut ini secara informatif:
                    {message}
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

        # Generate response
        full_response = ""
        for chunk in client.models.generate_content_stream(
            model=TOMA_CHAT_MODEL,
            contents=contents,
            config=generate_content_config,
        ):
            if chunk.text:
                full_response += chunk.text

        return full_response

    except Exception as e:
        logger.error(f"Error generating Toma chat response: {str(e)}")
        raise

def generate_cs_chat_response(messages):
    """Generate a response using the customer service chat model."""
    try:
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
            raise ValueError("No valid message content")

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
        full_response = ""
        for chunk in client.models.generate_content_stream(
            model=CS_CHAT_MODEL,
            contents=contents,
            config=generate_content_config,
        ):
            if chunk.text:
                full_response += chunk.text

        return full_response

    except Exception as e:
        logger.error(f"Error generating CS chat response: {str(e)}")
        raise 