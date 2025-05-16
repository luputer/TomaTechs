import { useRef, useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const Deteksi = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
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
      if (isCameraOpen) {
        stopCamera();
      }
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

  // New functions for camera
  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOpen(true);
        setSelectedImage(null);
        setPreviewUrl(null);
        setDetectionResult(null);
        setError(null);
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setError("Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin.");
        setIsCameraOpen(false);
      }
    } else {
      setError("Kamera tidak didukung oleh browser ini.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob.size > 5 * 1024 * 1024) { // 5MB limit
          alert('Ukuran file terlalu besar. Maksimal 5MB.');
          return;
        }
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        stopCamera();
      }, 'image/jpeg');
    }
  };

  const toggleCamera = () => {
    if (isCameraOpen) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <div className="relative min-h-screen flex bg-[#3B5D3D]">
      <Sidebar user={user} />
      <div className="flex-1 p-2 sm:p-4">
        <div className="bg-white min-h-[calc(100vh-2rem)] rounded-3xl shadow-lg p-3 sm:p-6">
          <div className="max-w-4xl mx-auto pb-4 sm:pb-8">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 mb-4 sm:mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#2e7d32] mb-2 text-center">
                Mulai Deteksi Sekarang!
              </h2>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#2e7d32] mb-4 sm:mb-6 text-center">
                Pastikan gambar yang diambil terlihat jelas
              </h3>

              {/* Error Message */}
              {error && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-sm sm:text-base text-red-700">
                  {error}
                </div>
              )}

              {/* Camera Section */}
              <div className="mb-4 sm:mb-8">
                <div className="flex justify-center mb-4">
                  <button
                    onClick={toggleCamera}
                    className={`px-4 sm:px-6 py-2 rounded-full flex items-center gap-2 text-sm sm:text-base ${
                      isCameraOpen
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-[#2e7d32] hover:bg-[#1b5e20] text-white'
                    }`}
                  >
                    {isCameraOpen ? 'Tutup Kamera' : 'Buka Kamera'}
                  </button>
                </div>

                {/* Camera View */}
                {isCameraOpen && (
                  <div className="relative mb-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover rounded-lg"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <button
                      onClick={handleCapture}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 hover:bg-white text-[#2e7d32] px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Ambil Foto
                    </button>
                  </div>
                )}

                {/* File Upload Area */}
                {!isCameraOpen && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center">
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
                      <FaCloudUploadAlt className="text-4xl sm:text-5xl text-[#2e7d32] mb-3 sm:mb-4" />
                      <p className="text-sm sm:text-base text-gray-600 mb-2">
                        Klik untuk memilih atau seret foto daun tomat ke sini
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Format yang didukung: JPG, PNG (Max 5MB)
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">
                        Atau, gunakan kamera di atas untuk mengambil foto baru.
                      </p>
                    </label>
                  </div>
                )}
              </div>

              {/* Preview and Result Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                {/* Preview Section */}
                {previewUrl && (
                  <div className="mb-4 sm:mb-8">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Preview Gambar:</h3>
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
                  <div className="mb-4 sm:mb-8">
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-[#2e7d32]">
                      Hasil Deteksi:
                    </h3>
                    <div className="bg-[#f8f9fa] p-3 sm:p-4 rounded-lg border border-[#2e7d32]">
                      <p className="mb-2 text-sm sm:text-base">
                        <span className="font-semibold">Penyakit:</span>{' '}
                        {diseaseInfo[detectionResult.label]?.name || detectionResult.label}
                      </p>
                      <p className="mb-2 text-sm sm:text-base">
                        <span className="font-semibold">Tingkat Kepercayaan:</span>{' '}
                        {(detectionResult.confidence * 100).toFixed(2)}%
                      </p>
                      <div className="mt-3 sm:mt-4">
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Deskripsi:</h4>
                        <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
                          {diseaseInfo[detectionResult.label]?.description}
                        </p>
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Rekomendasi Penanganan:</h4>
                        <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-line">
                          {diseaseInfo[detectionResult.label]?.treatment}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewUrl(null);
                    setDetectionResult(null);
                    setError(null);
                    if (isCameraOpen) stopCamera();
                  }}
                  className="px-4 sm:px-6 py-2 border border-[#2e7d32] text-[#2e7d32] rounded-full hover:bg-[#f0f9f0] text-sm sm:text-base"
                >
                  Reset
                </button>
                <button
                  onClick={handleUpload}
                  disabled={(!selectedImage && !isCameraOpen) || isLoading}
                  className={`px-4 sm:px-6 py-2 rounded-full flex items-center justify-center gap-2 text-sm sm:text-base ${
                    (!selectedImage && !isCameraOpen) || isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#2e7d32] text-white hover:bg-[#1b5e20]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    'Mulai Deteksi'
                  )}
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-[#2e7d32] mb-3 sm:mb-4">
                Panduan Penggunaan:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-gray-700">
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