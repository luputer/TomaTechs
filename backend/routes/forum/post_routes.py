from flask import Blueprint, request, jsonify
from utils.logger import logger
from services.forum_service import (
    create_post,
    get_all_posts,
    get_post,
    update_post,
    delete_post
)

post_bp = Blueprint('posts', __name__)

@post_bp.route('/posts', methods=['POST'])
def create():
    """Create a new post."""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'content', 'user_id']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        post = create_post(
            title=data['title'],
            content=data['content'],
            user_id=data['user_id']
        )
        
        return jsonify(post), 201
        
    except Exception as e:
        logger.error(f"Error creating post: {str(e)}")
        return jsonify({
            'error': 'Failed to create post'
        }), 500

@post_bp.route('/posts', methods=['GET'])
def get_all():
    """Get all posts."""
    try:
        posts = get_all_posts()
        return jsonify(posts), 200
        
    except Exception as e:
        logger.error(f"Error getting posts: {str(e)}")
        return jsonify({
            'error': 'Failed to get posts'
        }), 500

@post_bp.route('/posts/<post_id>', methods=['GET'])
def get_one(post_id):
    """Get a specific post."""
    try:
        post = get_post(post_id)
        if not post:
            return jsonify({
                'error': 'Post not found'
            }), 404
            
        return jsonify(post), 200
        
    except Exception as e:
        logger.error(f"Error getting post: {str(e)}")
        return jsonify({
            'error': 'Failed to get post'
        }), 500

@post_bp.route('/posts/<post_id>', methods=['PUT'])
def update(post_id):
    """Update a post."""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'content', 'user_id']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        post = update_post(
            post_id=post_id,
            title=data['title'],
            content=data['content'],
            user_id=data['user_id']
        )
        
        return jsonify(post), 200
        
    except ValueError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except Exception as e:
        logger.error(f"Error updating post: {str(e)}")
        return jsonify({
            'error': 'Failed to update post'
        }), 500

@post_bp.route('/posts/<post_id>', methods=['DELETE'])
def delete(post_id):
    """Delete a post."""
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'user_id' not in data:
            return jsonify({
                'error': 'Missing required field: user_id'
            }), 400
        
        post = delete_post(
            post_id=post_id,
            user_id=data['user_id']
        )
        
        return jsonify(post), 200
        
    except ValueError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except Exception as e:
        logger.error(f"Error deleting post: {str(e)}")
        return jsonify({
            'error': 'Failed to delete post'
        }), 500 