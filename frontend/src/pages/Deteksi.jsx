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
    'Tomato_mosaic_virus': {
      name: 'Virus Mosaik Tomat (ToMV)',
      description: 'Penyakit yang disebabkan oleh Tomato Mosaic Virus, ditularkan melalui benih, tangan manusia, alat pertanian, dan tanaman inang lain. Virus dapat bertahan lama di tanah dan sisa tanaman.',
      treatment: 'Penanganan yang disarankan:\n' +
        '1. Gunakan benih bebas virus (bersertifikat)\n' +
        '2. Disinfeksi alat dan tangan sebelum menyentuh tanaman\n' +
        '3. Singkirkan dan bakar tanaman yang terinfeksi\n' +
        '4. Hindari merokok saat menangani tanaman\n' +
        '5. Rotasi tanaman dengan non-inang'
    },
    'Target_Spot': {
      name: 'Bercak Target (Target Spot)',
      description: 'Penyakit yang disebabkan oleh jamur Corynespora cassiicola, menyebar melalui udara, percikan air hujan, dan alat yang terkontaminasi. Menyebabkan bercak coklat dengan lingkaran konsentris pada daun.',
      treatment: 'Penanganan yang disarankan:\n' +
        '1. Gunakan varietas tahan penyakit jika tersedia\n' +
        '2. Pangkas dan buang daun yang terinfeksi\n' +
        '3. Tingkatkan sirkulasi udara\n' +
        '4. Semprot fungisida yang sesuai\n' +
        '5. Lakukan rotasi tanaman'
    },
    'Bacterial_spot': {
      name: 'Bercak Bakteri (Bacterial Spot)',
      description: 'Penyakit yang disebabkan oleh bakteri Xanthomonas campestris pv. vesicatoria, menyebar melalui benih, air, dan kontak alat/pekerja. Menyebabkan bercak kecil berwarna coklat kehitaman pada daun dan buah.',
      treatment: 'Penanganan yang disarankan:\n' +
        '1. Gunakan benih bebas patogen\n' +
        '2. Semprot bakterisida berbahan dasar tembaga\n' +
        '3. Hindari penyiraman dari atas\n' +
        '4. Rotasi tanaman minimal 2 tahun\n' +
        '5. Bakar sisa tanaman setelah panen'
    },
    'Early_blight': {
      name: 'Hawar Daun Dini (Early Blight)',
      description: 'Penyakit yang disebabkan oleh jamur Alternaria solani. Umum terjadi pada kondisi lembap dan suhu hangat. Menyebar melalui cipratan air hujan/irigrasi dari tanah dan residu tanaman yang terinfeksi. Menyebabkan bercak coklat tua dengan lingkaran konsentris seperti target di daun tua.',
      treatment: 'Penanganan yang disarankan:\n' +
        '1. Sanitasi: Buang daun yang terinfeksi dan sisa tanaman setelah panen\n' +
        '2. Rotasi tanaman: Hindari menanam tomat atau kentang di tempat yang sama selama 2–3 tahun\n' +
        '3. Mulsa tanah: Cegah cipratan air tanah ke daun\n' +
        '4. Fungisida: Gunakan fungisida berbahan aktif seperti chlorothalonil, mancozeb, atau copper-based fungicides\n' +
        '5. Varietas tahan: Gunakan varietas tomat yang tahan terhadap Early Blight jika tersedia'
    },
    'Spider_mites': {
      name: 'Tungau Laba-laba (Two-Spotted Spider Mite)',
      description: 'Hama tungau kecil yang hidup di bawah daun dan mengisap cairan sel tanaman. Menyukai kondisi panas dan kering. Menyebabkan bercak kuning kecil (stippling) di daun dan jaring halus (webbing) di bawah daun.',
      treatment: 'Penanganan yang disarankan:\n' +
        '1. Air semprot: Semprotkan air tekanan tinggi ke daun bagian bawah\n' +
        '2. Predator alami: Gunakan musuh alami seperti Phytoseiulus persimilis\n' +
        '3. Insektisida selektif: Gunakan mitisida seperti abamectin, spinosad, atau neem oil\n' +
        '4. Pengelolaan lingkungan: Jaga kelembapan agar tidak terlalu kering'
    },
    'Septoria_leaf_spot': {
      name: 'Bercak Daun Septoria (Septoria Leaf Spot)',
      description: 'Penyakit yang disebabkan oleh jamur Septoria lycopersici. Menyukai lingkungan lembap dan hangat, sering muncul saat tanaman mulai berbunga. Menyebabkan bercak kecil bulat, coklat keabu-abuan dengan tepi gelap di daun bagian bawah.',
      treatment: 'Penanganan yang disarankan:\n' +
        '1. Sanitasi: Buang daun yang terinfeksi dan sisa tanaman secara menyeluruh\n' +
        '2. Penyiraman tepat: Hindari membasahi daun saat menyiram\n' +
        '3. Rotasi tanaman: Hindari menanam tomat di lokasi yang sama setiap tahun\n' +
        '4. Fungisida: Gunakan fungisida seperti chlorothalonil, copper fungicides, atau mancozeb\n' +
        '5. Ventilasi baik: Beri jarak antar tanaman untuk meningkatkan sirkulasi udara'
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
                    className={`px-4 sm:px-6 py-2 rounded-full flex items-center gap-2 text-sm sm:text-base ${isCameraOpen
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-[#2e7d32] hover:bg-[#1b5e20] text-white'
                      }`}
                  >
                    {isCameraOpen ? 'Tutup Kamera' : 'Buka Kamera'}
                  </button>
                </div>

                {/* Camera View */}
                {isCameraOpen && (
                  <div className="mb-4 relative aspect-video">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover rounded-lg border border-gray-300 mb-2"
                      style={{ transform: 'scaleX(-1)' }} // Mirror the camera feed
                    ></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    <div className="flex justify-center gap-4 mt-2">
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
                  className={`px-6 py-2 rounded-full flex items-center gap-2 ${(!selectedImage && !isCameraOpen) || isLoading
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