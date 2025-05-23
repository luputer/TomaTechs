# This file marks the directory as a Python package 

from flask import Flask
from flask_cors import CORS
import os
import sys

# Add project root to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

from config import *
from utils.logger import logger
from services.supabase_service import ensure_bucket_exists

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Configure app
    app.config['DEBUG'] = DEBUG
    app.config['HOST'] = HOST
    app.config['PORT'] = PORT
    
    # Enable CORS
    CORS(app)
    
    # Ensure upload folder exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    
    # Ensure Supabase bucket exists
    if not ensure_bucket_exists():
        logger.error("Failed to ensure Supabase bucket exists")
    
    # Register blueprints
    from routes.predict import predict_bp
    from routes.chat import chat_bp
    from routes.forum import forum_bp
    
    app.register_blueprint(predict_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(forum_bp)
    
    logger.info("Application initialized successfully")
    return app 