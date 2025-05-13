import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Sidebar from '../components/Sidebar';
import { FaCloudUploadAlt, FaHome, FaPowerOff } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Deteksi = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mapping penyakit ke deskripsi dan penanganan
  const diseaseInfo = {
    'Early_blight': {
      name: 'Hawar Daun Dini (Early Blight)',
      description: 'Penyakit yang disebabkan oleh jamur Alternaria solani, menyebabkan bercak coklat berbentuk konsentris pada daun.',
      treatment: 'Penanganan yang disarankan:\n' +
        '1. Rotasi tanaman dengan tanaman non-solanaceae\n' +
        '2. Pemangkasan daun yang terinfeksi\n' +
        '3. Aplikasi fungisida yang sesuai\n' +
        '4. Menjaga sirkulasi udara yang baik\n' +
        '5. Hindari penyiraman dari atas tanaman'
    },
    'Late_blight': {
      name: 'Hawar Daun Akhir (Late Blight)',
      description: 'Penyakit yang disebabkan oleh Phytophthora infestans, menyebabkan bercak coklat kehitaman dengan tepian berwarna hijau pucat.',
      treatment: 'Penanganan yang disarankan:\n' +
        '1. Gunakan fungisida preventif\n' +
        '2. Hindari kelembaban tinggi\n' +
        '3. Buang tanaman yang terinfeksi\n' +
        '4. Pastikan drainase yang baik\n' +
        '5. Gunakan varietas tahan penyakit'
    },
    'Healthy': {
      name: 'Daun Sehat',
      description: 'Daun tomat dalam kondisi sehat tanpa gejala penyakit.',
      treatment: 'Pertahankan perawatan yang baik:\n' +
        '1. Penyiraman teratur\n' +
        '2. Pemupukan seimbang\n' +
        '3. Pemangkasan rutin\n' +
        '4. Pengendalian hama preventif\n' +
        '5. Menjaga kebersihan kebun'
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Ukuran file terlalu besar. Maksimal 5MB.');
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDetectionResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append('user_id', user.id);

    try {
      const response = await fetch('http://127.0.0.1:8080/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setDetectionResult(result);
    } catch (error) {
      console.error('Error:', error);
      setError(
        'Terjadi kesalahan saat melakukan deteksi. ' +
        'Pastikan server backend berjalan di http://127.0.0.1:8080'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gray-100 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Deteksi Penyakit</h1>
          <div className="flex items-center gap-4">
            <FaHome
              className="text-gray-600 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            />
            <FaPowerOff className="text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 bg-[#f0f9f0]">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#2e7d32] mb-6 text-center">
                Deteksi Penyakit Daun Tomat
              </h2>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              {/* Upload Section */}
              <div className="mb-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="imageInput"
                  />
                  <label
                    htmlFor="imageInput"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FaCloudUploadAlt className="text-5xl text-[#2e7d32] mb-4" />
                    <p className="text-gray-600 mb-2">
                      Klik untuk memilih atau seret foto daun tomat ke sini
                    </p>
                    <p className="text-sm text-gray-500">
                      Format yang didukung: JPG, PNG (Max 5MB)
                    </p>
                  </label>
                </div>
              </div>

              {/* Preview and Result Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Preview Section */}
                {previewUrl && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Preview Gambar:</h3>
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full h-auto rounded-lg border border-gray-200"
                      />
                    </div>
                  </div>
                )}

                {/* Detection Result */}
                {detectionResult && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-[#2e7d32]">
                      Hasil Deteksi:
                    </h3>
                    <div className="bg-[#f8f9fa] p-4 rounded-lg border border-[#2e7d32]">
                      <p className="mb-2">
                        <span className="font-semibold">Penyakit:</span>{' '}
                        {diseaseInfo[detectionResult.label]?.name || detectionResult.label}
                      </p>
                      <p className="mb-2">
                        <span className="font-semibold">Tingkat Kepercayaan:</span>{' '}
                        {(detectionResult.confidence * 100).toFixed(2)}%
                      </p>
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Deskripsi:</h4>
                        <p className="text-sm text-gray-700 mb-4">
                          {diseaseInfo[detectionResult.label]?.description}
                        </p>
                        <h4 className="font-semibold mb-2">Rekomendasi Penanganan:</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {diseaseInfo[detectionResult.label]?.treatment}
                        </p>
                      </div>
                      {detectionResult.image_url && (
                        <div className="mt-4">
                          <a
                            href={detectionResult.image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2e7d32] hover:underline text-sm"
                          >
                            Lihat Gambar Tersimpan
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewUrl(null);
                    setDetectionResult(null);
                    setError(null);
                  }}
                  className="px-6 py-2 border border-[#2e7d32] text-[#2e7d32] rounded-full hover:bg-[#f0f9f0]"
                >
                  Reset
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedImage || isLoading}
                  className={`px-6 py-2 rounded-full flex items-center gap-2 ${!selectedImage || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#2e7d32] text-white hover:bg-[#1b5e20]'
                    }`}
                >
                  {isLoading ? (
                    <>
                      <span className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    'Mulai Deteksi'
                  )}
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-[#2e7d32] mb-4">
                Panduan Penggunaan:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Pilih atau seret foto daun tomat yang ingin dideteksi</li>
                <li>Pastikan foto jelas dan fokus pada area daun yang terinfeksi</li>
                <li>Klik tombol "Mulai Deteksi" untuk memulai proses analisis</li>
                <li>Tunggu beberapa saat hingga hasil analisis ditampilkan</li>
                <li>Sistem akan menampilkan jenis penyakit dan rekomendasi penanganan</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deteksi; 