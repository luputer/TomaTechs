# Aplikasi Deteksi Penyakit Daun Tomat

Aplikasi web untuk mendeteksi penyakit pada daun tomat menggunakan teknologi machine learning. Aplikasi ini membantu petani dan pengguna untuk mengidentifikasi penyakit pada tanaman tomat secara cepat dan akurat.

## 🚀 Fitur Utama

- 📸 Deteksi penyakit daun tomat melalui upload gambar atau kamera
- 🔍 Analisis gambar dengan tingkat kepercayaan tinggi
- 📱 Responsive design untuk desktop dan mobile
- 📊 Informasi detail tentang penyakit dan cara penanganannya
- 👤 Sistem autentikasi pengguna
- 💬 Forum diskusi untuk berbagi pengalaman
- 📝 Riwayat deteksi untuk setiap pengguna

## 🛠️ Teknologi yang Digunakan

### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- Axios
- React Router
- Supabase Client

### Backend
- Python
- Flask
- TensorFlow/Keras
- Supabase
- Google Cloud Run

## 📋 Prasyarat

- Node.js (v14 atau lebih baru)
- Python 3.8+
- pip
- Git

## 🚀 Cara Menjalankan Aplikasi

### Frontend

1. Masuk ke direktori frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Buat file .env dan isi dengan konfigurasi yang diperlukan:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# API Configuration
VITE_API_URL=https://your-backend-url.run.app
# Untuk development lokal:
# VITE_API_URL=http://127.0.0.1:8080
```

4. Jalankan aplikasi dalam mode development:
```bash
npm run dev
```

### Backend

1. Masuk ke direktori backend:
```bash
cd backend
```

2. Buat virtual environment:
```bash
python -m venv venv
```

3. Aktifkan virtual environment:
```bash
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Buat file .env dan isi dengan konfigurasi yang diperlukan:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_BUCKET=predicted-images

# Google Cloud Configuration
GOOGLE_API_KEY=your_google_api_key
GOOGLE_APPLICATION_CREDENTIALS=vertexai-key.json
```

6. Jalankan server:
```bash
python run.py
```

## 📁 Struktur Proyek

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── lib/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── requirements.txt
│
└── README.md
```

## 📡 Dokumentasi API

### Base URL
```
https://tomato-app-231142263655.asia-southeast1.run.app
```

### Endpoints

#### 1. Deteksi Penyakit
```http
POST /predict
```
Mendeteksi penyakit pada gambar daun tomat yang diunggah.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  ```json
  {
    "file": "image_file",
    "user_id": "string"
  }
  ```

**Response:**
```json
{
  "label": "string",
  "confidence": "float",
  "image_url": "string"
}
```

#### 2. Forum Posts

##### Mendapatkan Semua Post
```http
GET /forum/get_posts
```
Mendapatkan daftar semua postingan forum.

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "user_id": "string",
      "title": "string",
      "content": "string",
      "image_url": "string",
      "like_count": "integer",
      "unlike_count": "integer",
      "created_at": "string"
    }
  ]
}
```

##### Membuat Post Baru
```http
POST /forum/create_post
```
Membuat postingan forum baru.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  ```json
  {
    "user_id": "string",
    "title": "string",
    "content": "string",
    "image": "file (optional)"
  }
  ```

**Response:**
```json
{
  "message": "Post berhasil dibuat",
  "post": {
    "id": "string",
    "user_id": "string",
    "title": "string",
    "content": "string",
    "image_url": "string",
    "like_count": 0,
    "unlike_count": 0,
    "created_at": "string"
  }
}
```

##### Mendapatkan Detail Post
```http
GET /forum/post/{post_id}
```
Mendapatkan detail postingan dan komentarnya.

**Response:**
```json
{
  "post": {
    "id": "string",
    "user_id": "string",
    "title": "string",
    "content": "string",
    "image_url": "string",
    "like_count": "integer",
    "unlike_count": "integer",
    "created_at": "string"
  },
  "comments": [
    {
      "id": "string",
      "post_id": "string",
      "user_id": "string",
      "content": "string",
      "created_at": "string"
    }
  ]
}
```

##### Menambahkan Komentar
```http
POST /forum/add_comment
```
Menambahkan komentar pada postingan.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:
  ```json
  {
    "post_id": "string",
    "user_id": "string",
    "content": "string"
  }
  ```

**Response:**
```json
{
  "message": "Komentar berhasil ditambahkan",
  "comment": {
    "id": "string",
    "post_id": "string",
    "user_id": "string",
    "content": "string",
    "created_at": "string"
  }
}
```

##### Vote Post
```http
POST /forum/vote_post
```
Memberikan vote (like/unlike) pada postingan.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:
  ```json
  {
    "post_id": "string",
    "user_id": "string",
    "vote_type": "string" // 'like' atau 'unlike'
  }
  ```

**Response:**
```json
{
  "message": "Vote berhasil",
  "like_count": "integer",
  "unlike_count": "integer"
}
```

##### Mendapatkan Status Vote User
```http
POST /forum/get_vote
```
Mendapatkan status vote user pada postingan tertentu.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:
  ```json
  {
    "post_id": "string",
    "user_id": "string"
  }
  ```

**Response:**
```json
{
  "vote_type": "string" // 'like', 'unlike', atau 'none'
}
```

#### 3. Chatbot

##### Chat Budidaya Tomat
```http
POST /toma_chat
```
Mengirim pesan ke chatbot budidaya tomat dan mendapatkan respons.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:
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

##### Chat Customer Service
```http
POST /cs_chat
```
Mengirim pesan ke chatbot customer service dan mendapatkan respons.

**Request:**
- Method: `POST`
- Content-Type: `application/json`
- Body:
  ```json
  {
    "messages": [
      {
        "role": "string",
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

##### Riwayat Chat
```http
GET /chat_history/{user_id}
```
Mendapatkan riwayat chat untuk user tertentu.

**Response:**
```json
[
  {
    "id": "string",
    "text": "string",
    "sender": "string", // 'bot' atau 'user'
    "timestamp": "string"
  }
]
```

### Error Responses

Semua endpoint dapat mengembalikan error dengan format berikut:

```json
{
  "error": "string"
}
```

Status code error yang umum:
- `400`: Bad Request - Data yang dikirim tidak valid
- `401`: Unauthorized - Tidak terautentikasi
- `403`: Forbidden - Tidak memiliki akses
- `404`: Not Found - Resource tidak ditemukan
- `500`: Internal Server Error - Kesalahan server

## 🔒 Keamanan

- Autentikasi pengguna menggunakan Supabase
- Validasi input di sisi client dan server
- Pembatasan ukuran file upload
- Sanitasi data
- Penggunaan environment variables untuk data sensitif

## 🤝 Kontribusi

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detailnya.

## 📞 Kontak

Untuk pertanyaan dan dukungan, silakan hubungi:
- Email: [your-email@example.com]
- GitHub: [your-github-username]

## 🙏 Ucapan Terima Kasih

- Tim pengembang
- Kontributor
- Komunitas open source
- Semua pihak yang telah membantu dalam pengembangan aplikasi ini 