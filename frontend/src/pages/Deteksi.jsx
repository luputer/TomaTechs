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

  return (
    <div className="relative min-h-screen flex bg-[#3B5D3D]">
      <Sidebar user={user} />
      <div className="flex-1 p-4">
        <div className="bg-white min-h-[calc(100vh-2rem)] rounded-3xl shadow-lg p-6">
          <div className="max-w-4xl mx-auto pb-8">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-6xl font-bold text-[#2e7d32] mb-2 text-center">
                Mulai Deteksi Sekarang!
              </h2>
              <h3 className="text-xl font-semibold text-[#2e7d32] mb-6 text-center">
                Pastikan gambar yang diambil terlihat jelas
              </h3>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              {/* Upload Section */}
              <div className="mb-8">
                {/* Camera Button */}
                {!isCameraOpen && (
                  <div className="mb-4 text-center">
                    <button
                      onClick={startCamera}
                      className="px-6 py-3 bg-[#4CAF50] text-white rounded-full hover:bg-[#388E3C] transition duration-150 ease-in-out flex items-center justify-center mx-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Ambil Foto dengan Kamera
                    </button>
                  </div>
                )}

                {/* Camera View */}
                {isCameraOpen && (
                  <div className="mb-4">
                    <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg border border-gray-300 mb-2"></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    <div className="flex justify-center gap-4">
                       <button
                        onClick={handleCapture}
                        className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      >
                        Ambil Gambar
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        Tutup Kamera
                      </button>
                    </div>
                  </div>
                )}

                {/* File Upload Area - Conditionally render if camera is not open */}
                {!isCameraOpen && (
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
                      <p className="text-sm text-gray-500 mt-2">
                        Atau, gunakan kamera di atas untuk mengambil foto baru.
                      </p>
                    </label>
                  </div>
                )}
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
                    if (isCameraOpen) stopCamera();
                  }}
                  className="px-6 py-2 border border-[#2e7d32] text-[#2e7d32] rounded-full hover:bg-[#f0f9f0]"
                >
                  Reset
                </button>
                <button
                  onClick={handleUpload}
                  disabled={(!selectedImage && !isCameraOpen) || isLoading}
                  className={`px-6 py-2 rounded-full flex items-center gap-2 ${
                    (!selectedImage && !isCameraOpen) || isLoading
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
            <div className="bg-white rounded-lg shadow-lg p-8">
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