# This file marks the directory as a Python package 

from flask import Blueprint
from .forum.post_routes import post_bp
from .forum.comment_routes import comment_bp
from .forum.vote_routes import vote_bp

# Create main blueprint
main_bp = Blueprint('main', __name__)

# Register forum blueprints
main_bp.register_blueprint(post_bp)
main_bp.register_blueprint(comment_bp)
main_bp.register_blueprint(vote_bp) 