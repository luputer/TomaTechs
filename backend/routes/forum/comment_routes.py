from flask import Blueprint, request, jsonify
from utils.logger import logger
from services.forum_service import (
    create_comment,
    get_all_comments,
    get_comment,
    update_comment,
    delete_comment
)

comment_bp = Blueprint('comments', __name__)

@comment_bp.route('/comments', methods=['POST'])
def create():
    """Create a new comment."""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['content', 'user_id', 'post_id']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        comment = create_comment(
            content=data['content'],
            user_id=data['user_id'],
            post_id=data['post_id']
        )
        
        return jsonify(comment), 201
        
    except Exception as e:
        logger.error(f"Error creating comment: {str(e)}")
        return jsonify({
            'error': 'Failed to create comment'
        }), 500

@comment_bp.route('/comments', methods=['GET'])
def get_all():
    """Get all comments."""
    try:
        comments = get_all_comments()
        return jsonify(comments), 200
        
    except Exception as e:
        logger.error(f"Error getting comments: {str(e)}")
        return jsonify({
            'error': 'Failed to get comments'
        }), 500

@comment_bp.route('/comments/<comment_id>', methods=['GET'])
def get_one(comment_id):
    """Get a specific comment."""
    try:
        comment = get_comment(comment_id)
        if not comment:
            return jsonify({
                'error': 'Comment not found'
            }), 404
            
        return jsonify(comment), 200
        
    except Exception as e:
        logger.error(f"Error getting comment: {str(e)}")
        return jsonify({
            'error': 'Failed to get comment'
        }), 500

@comment_bp.route('/comments/<comment_id>', methods=['PUT'])
def update(comment_id):
    """Update a comment."""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['content', 'user_id']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        comment = update_comment(
            comment_id=comment_id,
            content=data['content'],
            user_id=data['user_id']
        )
        
        return jsonify(comment), 200
        
    except ValueError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except Exception as e:
        logger.error(f"Error updating comment: {str(e)}")
        return jsonify({
            'error': 'Failed to update comment'
        }), 500

@comment_bp.route('/comments/<comment_id>', methods=['DELETE'])
def delete(comment_id):
    """Delete a comment."""
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'user_id' not in data:
            return jsonify({
                'error': 'Missing required field: user_id'
            }), 400
        
        comment = delete_comment(
            comment_id=comment_id,
            user_id=data['user_id']
        )
        
        return jsonify(comment), 200
        
    except ValueError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except Exception as e:
        logger.error(f"Error deleting comment: {str(e)}")
        return jsonify({
            'error': 'Failed to delete comment'
        }), 500 