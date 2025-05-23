# This file marks the directory as a Python package 

from flask import Flask
from flask_cors import CORS
import os
import sys

# Add project root to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

from tomato_app.config import *
from tomato_app.utils.logger import logger
from tomato_app.services.supabase_service import ensure_bucket_exists

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
    from tomato_app.routes import api_bp
    app.register_blueprint(api_bp)
    
    logger.info("Application initialized successfully")
    return app 