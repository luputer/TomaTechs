import uuid
from datetime import datetime
from services.supabase_service import supabase
from utils.logger import logger
from supabase import create_client
from config import SUPABASE_URL, SUPABASE_KEY

# Initialize Supabase client
try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    logger.info("Supabase client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Supabase client: {str(e)}")
    supabase = None

def create_post(title, content, user_id):
    """Create a new forum post."""
    try:
        post_data = {
            "title": title,
            "content": content,
            "user_id": user_id,
            "created_at": datetime.now().isoformat()
        }
        
        response = supabase.table("posts").insert(post_data).execute()
        return response.data[0]
    except Exception as e:
        logger.error(f"Error creating post: {str(e)}")
        raise

def get_all_posts():
    """Get all forum posts."""
    try:
        response = supabase.table("posts") \
            .select("*") \
            .order("created_at", desc=True) \
            .execute()
        return response.data
    except Exception as e:
        logger.error(f"Error getting posts: {str(e)}")
        raise

def get_post(post_id):
    """Get a specific post by ID."""
    try:
        response = supabase.table("posts") \
            .select("*") \
            .eq("id", post_id) \
            .single() \
            .execute()
        return response.data
    except Exception as e:
        logger.error(f"Error getting post: {str(e)}")
        raise

def update_post(post_id, title, content, user_id):
    """Update a forum post."""
    try:
        # Verify post exists and belongs to user
        post = get_post(post_id)
        if not post:
            raise ValueError("Post not found")
        if post["user_id"] != user_id:
            raise ValueError("Unauthorized to update this post")
            
        update_data = {
            "title": title,
            "content": content,
            "updated_at": datetime.now().isoformat()
        }
        
        response = supabase.table("posts") \
            .update(update_data) \
            .eq("id", post_id) \
            .execute()
        return response.data[0]
    except Exception as e:
        logger.error(f"Error updating post: {str(e)}")
        raise

def delete_post(post_id, user_id):
    """Delete a forum post."""
    try:
        # Verify post exists and belongs to user
        post = get_post(post_id)
        if not post:
            raise ValueError("Post not found")
        if post["user_id"] != user_id:
            raise ValueError("Unauthorized to delete this post")
            
        response = supabase.table("posts") \
            .delete() \
            .eq("id", post_id) \
            .execute()
        return response.data[0]
    except Exception as e:
        logger.error(f"Error deleting post: {str(e)}")
        raise

def create_comment(content, post_id, user_id):
    """Create a new comment on a post."""
    try:
        comment_data = {
            "content": content,
            "post_id": post_id,
            "user_id": user_id,
            "created_at": datetime.now().isoformat()
        }
        
        response = supabase.table("comments").insert(comment_data).execute()
        return response.data[0]
    except Exception as e:
        logger.error(f"Error creating comment: {str(e)}")
        raise

def get_post_comments(post_id):
    """Get all comments for a post."""
    try:
        response = supabase.table("comments") \
            .select("*") \
            .eq("post_id", post_id) \
            .order("created_at", desc=False) \
            .execute()
        return response.data
    except Exception as e:
        logger.error(f"Error getting comments: {str(e)}")
        raise

def update_comment(comment_id, content, user_id):
    """Update a comment."""
    try:
        # Verify comment exists and belongs to user
        response = supabase.table("comments") \
            .select("*") \
            .eq("id", comment_id) \
            .single() \
            .execute()
            
        comment = response.data
        if not comment:
            raise ValueError("Comment not found")
        if comment["user_id"] != user_id:
            raise ValueError("Unauthorized to update this comment")
            
        update_data = {
            "content": content,
            "updated_at": datetime.now().isoformat()
        }
        
        response = supabase.table("comments") \
            .update(update_data) \
            .eq("id", comment_id) \
            .execute()
        return response.data[0]
    except Exception as e:
        logger.error(f"Error updating comment: {str(e)}")
        raise

def delete_comment(comment_id, user_id):
    """Delete a comment."""
    try:
        # Verify comment exists and belongs to user
        response = supabase.table("comments") \
            .select("*") \
            .eq("id", comment_id) \
            .single() \
            .execute()
            
        comment = response.data
        if not comment:
            raise ValueError("Comment not found")
        if comment["user_id"] != user_id:
            raise ValueError("Unauthorized to delete this comment")
            
        response = supabase.table("comments") \
            .delete() \
            .eq("id", comment_id) \
            .execute()
        return response.data[0]
    except Exception as e:
        logger.error(f"Error deleting comment: {str(e)}")
        raise

def vote_post(post_id, user_id, vote_type):
    """Vote on a post (like/unlike)."""
    try:
        # Check if user has already voted
        existing_vote = supabase.table("post_votes") \
            .select("*") \
            .eq("post_id", post_id) \
            .eq("user_id", user_id) \
            .execute()
            
        if existing_vote.data:
            # Update existing vote
            supabase.table("post_votes") \
                .update({"vote_type": vote_type}) \
                .eq("id", existing_vote.data[0]["id"]) \
                .execute()
        else:
            # Create new vote
            vote_data = {
                "id": str(uuid.uuid4()),
                "post_id": post_id,
                "user_id": user_id,
                "vote_type": vote_type
            }
            supabase.table("post_votes").insert(vote_data).execute()
            
        # Update post vote counts
        like_count = supabase.table("post_votes") \
            .select("*", count="exact") \
            .eq("post_id", post_id) \
            .eq("vote_type", "like") \
            .execute(count_only=True)
            
        unlike_count = supabase.table("post_votes") \
            .select("*", count="exact") \
            .eq("post_id", post_id) \
            .eq("vote_type", "unlike") \
            .execute(count_only=True)
            
        # Update post
        supabase.table("posts") \
            .update({
                "like_count": like_count.count,
                "unlike_count": unlike_count.count
            }) \
            .eq("id", post_id) \
            .execute()
            
        return {
            "like_count": like_count.count,
            "unlike_count": unlike_count.count
        }
    except Exception as e:
        logger.error(f"Error voting on post: {str(e)}")
        raise

def get_all_comments():
    """Get all comments."""
    try:
        result = supabase.table('comments').select('*').execute()
        return result.data
    except Exception as e:
        logger.error(f"Error getting comments: {str(e)}")
        raise

def get_comment(comment_id):
    """Get a specific comment."""
    try:
        result = supabase.table('comments').select('*').eq('id', comment_id).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        logger.error(f"Error getting comment: {str(e)}")
        raise

def update_comment(comment_id, content, user_id):
    """Update a comment."""
    try:
        # First check if comment exists and belongs to user
        comment = get_comment(comment_id)
        if not comment:
            raise ValueError("Comment not found")
        if comment['user_id'] != user_id:
            raise ValueError("Not authorized to update this comment")
            
        data = {
            'content': content
        }
        result = supabase.table('comments').update(data).eq('id', comment_id).execute()
        return result.data[0]
    except Exception as e:
        logger.error(f"Error updating comment: {str(e)}")
        raise

def delete_comment(comment_id, user_id):
    """Delete a comment."""
    try:
        # First check if comment exists and belongs to user
        comment = get_comment(comment_id)
        if not comment:
            raise ValueError("Comment not found")
        if comment['user_id'] != user_id:
            raise ValueError("Not authorized to delete this comment")
            
        result = supabase.table('comments').delete().eq('id', comment_id).execute()
        return result.data[0]
    except Exception as e:
        logger.error(f"Error deleting comment: {str(e)}")
        raise

def create_vote(user_id, post_id, vote_type):
    """Create a new vote."""
    try:
        data = {
            'user_id': user_id,
            'post_id': post_id,
            'vote_type': vote_type
        }
        result = supabase.table('votes').insert(data).execute()
        return result.data[0]
    except Exception as e:
        logger.error(f"Error creating vote: {str(e)}")
        raise

def get_vote(vote_id):
    """Get a specific vote."""
    try:
        result = supabase.table('votes').select('*').eq('id', vote_id).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        logger.error(f"Error getting vote: {str(e)}")
        raise

def update_vote(vote_id, user_id, vote_type):
    """Update a vote."""
    try:
        # First check if vote exists and belongs to user
        vote = get_vote(vote_id)
        if not vote:
            raise ValueError("Vote not found")
        if vote['user_id'] != user_id:
            raise ValueError("Not authorized to update this vote")
            
        data = {
            'vote_type': vote_type
        }
        result = supabase.table('votes').update(data).eq('id', vote_id).execute()
        return result.data[0]
    except Exception as e:
        logger.error(f"Error updating vote: {str(e)}")
        raise

def delete_vote(vote_id, user_id):
    """Delete a vote."""
    try:
        # First check if vote exists and belongs to user
        vote = get_vote(vote_id)
        if not vote:
            raise ValueError("Vote not found")
        if vote['user_id'] != user_id:
            raise ValueError("Not authorized to delete this vote")
            
        result = supabase.table('votes').delete().eq('id', vote_id).execute()
        return result.data[0]
    except Exception as e:
        logger.error(f"Error deleting vote: {str(e)}")
        raise 