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
VITE_API_URL=http://localhost:8080
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
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

5. Jalankan server:
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

## 🔒 Keamanan

- Autentikasi pengguna menggunakan Supabase
- Validasi input di sisi client dan server
- Pembatasan ukuran file upload
- Sanitasi data

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