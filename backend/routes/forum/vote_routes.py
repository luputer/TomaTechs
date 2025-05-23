from flask import Blueprint, request, jsonify
from utils.logger import logger
from services.forum_service import (
    create_vote,
    get_vote,
    update_vote,
    delete_vote
)

vote_bp = Blueprint('votes', __name__)

@vote_bp.route('/votes', methods=['POST'])
def create():
    """Create a new vote."""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_id', 'post_id', 'vote_type']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Validate vote_type
        if data['vote_type'] not in ['up', 'down']:
            return jsonify({
                'error': 'Invalid vote type. Must be either "up" or "down"'
            }), 400
        
        vote = create_vote(
            user_id=data['user_id'],
            post_id=data['post_id'],
            vote_type=data['vote_type']
        )
        
        return jsonify(vote), 201
        
    except Exception as e:
        logger.error(f"Error creating vote: {str(e)}")
        return jsonify({
            'error': 'Failed to create vote'
        }), 500

@vote_bp.route('/votes/<vote_id>', methods=['GET'])
def get_one(vote_id):
    """Get a specific vote."""
    try:
        vote = get_vote(vote_id)
        if not vote:
            return jsonify({
                'error': 'Vote not found'
            }), 404
            
        return jsonify(vote), 200
        
    except Exception as e:
        logger.error(f"Error getting vote: {str(e)}")
        return jsonify({
            'error': 'Failed to get vote'
        }), 500

@vote_bp.route('/votes/<vote_id>', methods=['PUT'])
def update(vote_id):
    """Update a vote."""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['user_id', 'vote_type']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Validate vote_type
        if data['vote_type'] not in ['up', 'down']:
            return jsonify({
                'error': 'Invalid vote type. Must be either "up" or "down"'
            }), 400
        
        vote = update_vote(
            vote_id=vote_id,
            user_id=data['user_id'],
            vote_type=data['vote_type']
        )
        
        return jsonify(vote), 200
        
    except ValueError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except Exception as e:
        logger.error(f"Error updating vote: {str(e)}")
        return jsonify({
            'error': 'Failed to update vote'
        }), 500

@vote_bp.route('/votes/<vote_id>', methods=['DELETE'])
def delete(vote_id):
    """Delete a vote."""
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'user_id' not in data:
            return jsonify({
                'error': 'Missing required field: user_id'
            }), 400
        
        vote = delete_vote(
            vote_id=vote_id,
            user_id=data['user_id']
        )
        
        return jsonify(vote), 200
        
    except ValueError as e:
        return jsonify({
            'error': str(e)
        }), 400
    except Exception as e:
        logger.error(f"Error deleting vote: {str(e)}")
        return jsonify({
            'error': 'Failed to delete vote'
        }), 500 