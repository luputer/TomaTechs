# Tomato Plant Disease Detection API

This API provides endpoints for tomato plant disease detection, chat functionality, and forum features.

## Base URL

```
http://localhost:8080
```

## Authentication

Currently, the API uses user_id for basic identification. Include the user_id in the request body or query parameters where required.

## Endpoints

### Prediction Endpoints

#### Predict Plant Disease
```http
POST /api/predict/predict
```

Upload an image of a tomato plant leaf for disease detection.

**Request:**
- Content-Type: multipart/form-data
- Body:
  - file: Image file (jpg, jpeg, png)
  - user_id: string

**Response:**
```json
{
    "predicted_class": 0,
    "label": "Bacterial_spot",
    "confidence": 0.95,
    "image_url": "https://..."
}
```

#### Get Prediction History
```http
GET /api/predict/history/{user_id}
```

Get prediction history for a specific user.

**Response:**
```json
[
    {
        "id": "uuid",
        "user_id": "string",
        "image_url": "string",
        "predicted_class": "string",
        "confidence": 0.95,
        "created_at": "timestamp"
    }
]
```

#### Delete Prediction
```http
DELETE /api/predict/delete/{prediction_id}
```

Delete a specific prediction.

**Request Body:**
```json
{
    "user_id": "string"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Data prediksi berhasil dihapus"
}
```

### Chat Endpoints

#### Tomato Chat
```http
POST /api/chat/toma_chat
```

Chat with the tomato plant expert AI.

**Request Body:**
```json
{
    "message": "string",
    "user_id": "string"
}
```

**Response:**
```json
{
    "response": "string"
}
```

#### Get Chat History
```http
GET /api/chat/chat_history/{user_id}
```

Get chat history for a specific user.

**Response:**
```json
[
    {
        "id": "uuid",
        "text": "string",
        "sender": "user|bot",
        "timestamp": "timestamp"
    }
]
```

#### Customer Service Chat
```http
POST /api/chat/cs_chat
```

Chat with the customer service AI.

**Request Body:**
```json
{
    "messages": [
        {
            "role": "user|assistant",
            "content": "string"
        }
    ]
}
```

**Response:**
```json
{
    "response": "string"
}
```

### Forum Endpoints

#### Create Post
```http
POST /api/forum/posts
```

Create a new forum post.

**Request Body:**
```json
{
    "user_id": "string",
    "title": "string",
    "content": "string",
    "image_url": "string" // optional
}
```

**Response:**
```json
{
    "message": "Post berhasil dibuat",
    "post": {
        "id": "uuid",
        "user_id": "string",
        "title": "string",
        "content": "string",
        "image_url": "string",
        "like_count": 0,
        "unlike_count": 0,
        "created_at": "timestamp"
    }
}
```

#### Get All Posts
```http
GET /api/forum/posts
```

Get all forum posts.

**Response:**
```json
[
    {
        "id": "uuid",
        "user_id": "string",
        "title": "string",
        "content": "string",
        "image_url": "string",
        "like_count": 0,
        "unlike_count": 0,
        "created_at": "timestamp"
    }
]
```

#### Get Post Details
```http
GET /api/forum/posts/{post_id}
```

Get details of a specific post including comments.

**Response:**
```json
{
    "post": {
        "id": "uuid",
        "user_id": "string",
        "title": "string",
        "content": "string",
        "image_url": "string",
        "like_count": 0,
        "unlike_count": 0,
        "created_at": "timestamp"
    },
    "comments": [
        {
            "id": "uuid",
            "post_id": "string",
            "user_id": "string",
            "content": "string",
            "username": "string",
            "created_at": "timestamp"
        }
    ]
}
```

#### Add Comment
```http
POST /api/forum/comments
```

Add a comment to a post.

**Request Body:**
```json
{
    "post_id": "string",
    "user_id": "string",
    "content": "string",
    "username": "string"
}
```

**Response:**
```json
{
    "message": "Komentar berhasil ditambahkan",
    "comment": {
        "id": "uuid",
        "post_id": "string",
        "user_id": "string",
        "content": "string",
        "username": "string",
        "created_at": "timestamp"
    }
}
```

#### Vote Post
```http
POST /api/forum/votes
```

Vote on a post (like/unlike).

**Request Body:**
```json
{
    "post_id": "string",
    "user_id": "string",
    "vote_type": "like|unlike"
}
```

**Response:**
```json
{
    "message": "Vote like/unlike berhasil",
    "like_count": 0,
    "unlike_count": 0
}
```

## Error Responses

All endpoints may return the following error responses:

```json
{
    "error": "Error message"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Setup and Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables in `.env`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_BUCKET=your_bucket_name
```

3. Run the application:
```bash
python app.py
```

The server will start on `http://localhost:8080`.

## Model Information

The API uses a TensorFlow model for plant disease detection. The model can classify tomato plant leaves into the following categories:

1. Bacterial_spot
2. Early_blight
3. Late_blight
4. Leaf_Mold
5. Septoria_leaf_spot
6. Spider_mites Two-spotted_spider_mite
7. Target_Spot
8. Tomato_Yellow_Leaf_Curl_Virus
9. Tomato_mosaic_virus
10. healthy

## CORS Support

The API supports Cross-Origin Resource Sharing (CORS) and allows requests from any origin. All responses include the necessary CORS headers. 