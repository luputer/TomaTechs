import os
import sys
from flask import Flask, request, send_from_directory
from flask_cors import CORS
from utils.logger import logger
from flask_swagger_ui import get_swaggerui_blueprint

# Add project root to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    
    # Request logging middleware
    @app.before_request
    def log_request_info():
        logger.info('Headers: %s', request.headers)
        logger.info('Body: %s', request.get_data())
        logger.info('URL: %s %s', request.method, request.url)
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        logger.error(f"404 error: {request.url} - {error}")
        return {'error': f'Not found: {request.url}'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"500 error: {request.url} - {str(error)}")
        return {'error': 'Internal server error'}, 500
    
    # Swagger configuration
    SWAGGER_URL = '/swagger'  # URL for exposing Swagger UI
    API_URL = '/static/swagger.yaml'  # Our API url (can of course be a local resource)

    # Call factory function to create our blueprint
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,  # Swagger UI static files will be mapped to '{SWAGGER_URL}/dist/'
        API_URL,
        config={  # Swagger UI config overrides
            'app_name': "Tomato Disease Detection API"
        }
    )

    # Register blueprint at URL
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

    return app

if __name__ == '__main__':
    logger.info("Starting application...")
    app = create_app()
    
    # Import routes after app creation
    from routes.predict import predict_bp
    from routes.chat import chat_bp
    from routes.forum import forum_bp
    
    # Register blueprints without prefixes
    app.register_blueprint(predict_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(forum_bp)
    
    # Create static directory if it doesn't exist
    os.makedirs('static', exist_ok=True)

    # Copy swagger.yaml to static directory
    import shutil
    shutil.copy('swagger.yaml', 'static/swagger.yaml')
    
    logger.info("Application configured, starting server...")
    app.run(host="0.0.0.0", port=8080, debug=True) 