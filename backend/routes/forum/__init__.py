from flask import Blueprint, request, jsonify
from utils.logger import logger
from services.supabase_service import supabase
from datetime import datetime
import uuid

forum_bp = Blueprint('forum', __name__)

@forum_bp.route("/create_post", methods=["POST", "OPTIONS"])
def create_post():
    if request.method == "OPTIONS":
        response = jsonify({"message": "preflight"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response

    try:
        data = request.json
        user_id = data.get("user_id")
        title = data.get("title")
        content = data.get("content")
        image_url = data.get("image_url")  # opsional

        if not user_id or not title or not content:
            return jsonify({"error": "Missing required fields"}), 400

        new_post = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "title": title,
            "content": content,
            "image_url": image_url,
            "like_count": 0,
            "unlike_count": 0,
            "created_at": datetime.now().isoformat()
        }

        supabase.table("forum_posts").insert(new_post).execute()
        response = jsonify({"message": "Post berhasil dibuat", "post": new_post})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 201

    except Exception as e:
        logger.error(f"Error creating post: {str(e)}")
        error_response = jsonify({"error": str(e)})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500

@forum_bp.route("/get_posts", methods=["GET"])
def get_posts():
    try:
        response = supabase.table("forum_posts") \
            .select("*") \
            .order("created_at", desc=True) \
            .execute()

        api_response = jsonify(response.data)
        api_response.headers.add('Access-Control-Allow-Origin', '*')
        return api_response, 200

    except Exception as e:
        logger.error(f"Error fetching posts: {str(e)}")
        error_response = jsonify({"error": "Gagal mengambil daftar posting"})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500

@forum_bp.route("/post/<post_id>", methods=["GET"])
def get_post(post_id):
    try:
        # Ambil detail posting
        post_response = supabase.table("forum_posts") \
            .select("*") \
            .eq("id", post_id) \
            .single() \
            .execute()

        # Ambil komentar
        comment_response = supabase.table("forum_comments") \
            .select("*") \
            .eq("post_id", post_id) \
            .order("created_at", desc=True) \
            .execute()

        response = jsonify({
            "post": post_response.data,
            "comments": comment_response.data
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

    except Exception as e:
        logger.error(f"Error fetching post details: {str(e)}")
        error_response = jsonify({"error": "Gagal mengambil detail posting"})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500

@forum_bp.route("/add_comment", methods=["POST", "OPTIONS"])
def add_comment():
    if request.method == "OPTIONS":
        response = jsonify({"message": "preflight"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response

    try:
        data = request.json
        post_id = data.get("post_id")
        user_id = data.get("user_id")
        content = data.get("content")
        username = data.get("username")

        if not all([post_id, user_id, content]):
            return jsonify({"error": "Missing required fields"}), 400

        comment_data = {
            "id": str(uuid.uuid4()),
            "post_id": post_id,
            "user_id": user_id,
            "content": content,
            "username": username,
            "created_at": datetime.now().isoformat()
        }

        supabase.table("forum_comments").insert(comment_data).execute()
        response = jsonify({"message": "Komentar berhasil ditambahkan", "comment": comment_data})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 201

    except Exception as e:
        logger.error(f"Error adding comment: {str(e)}")
        error_response = jsonify({"error": "Gagal menambahkan komentar"})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500

@forum_bp.route("/vote_post", methods=["POST", "OPTIONS"])
def vote_post():
    if request.method == "OPTIONS":
        response = jsonify({"message": "preflight"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response

    try:
        data = request.json
        post_id = data.get("post_id")
        user_id = data.get("user_id")
        vote_type = data.get("vote_type")  # 'like' atau 'unlike'

        if not all([post_id, user_id, vote_type]):
            return jsonify({"error": "Missing required fields"}), 400

        # Cek apakah user sudah pernah vote
        existing_vote = supabase.table("post_votes") \
            .select("*") \
            .eq("post_id", post_id) \
            .eq("user_id", user_id) \
            .execute()

        if existing_vote.data:
            # Jika sudah ada, update vote_type
            supabase.table("post_votes") \
                .update({"vote_type": vote_type}) \
                .eq("id", existing_vote.data[0]["id"]) \
                .execute()
        else:
            # Jika belum ada, insert baru
            supabase.table("post_votes").insert({
                "id": str(uuid.uuid4()),
                "post_id": post_id,
                "user_id": user_id,
                "vote_type": vote_type
            }).execute()

        # Hitung total like/unlike
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

        # Update jumlah like/unlike di forum_posts
        result = supabase.table("forum_posts") \
            .update({
                "like_count": like_count.count,
                "unlike_count": unlike_count.count
            }) \
            .eq("id", post_id) \
            .execute()

        response = jsonify({
            "message": f"Vote {vote_type} berhasil",
            "like_count": like_count.count,
            "unlike_count": unlike_count.count
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

    except Exception as e:
        logger.error(f"Error voting: {str(e)}")
        error_response = jsonify({"error": "Gagal melakukan voting"})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500 