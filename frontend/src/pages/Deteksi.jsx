import AxiosInstance from "@/lib/axios";
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import Webcam from 'react-webcam';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const Deteksi = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const webcamRef = useRef(null);
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

  const handleDevices = useCallback(
    mediaDevices => {
      const videoDevices = mediaDevices.filter(({ kind }) => kind === "videoinput");
      setDevices(videoDevices);
      // Automatically select the back camera if available
      const backCamera = videoDevices.find(device =>
        device.label.toLowerCase().includes('back') ||
        device.label.toLowerCase().includes('rear')
      );
      setSelectedDevice(backCamera || videoDevices[0]);
    },
    []
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(handleDevices)
      .catch(err => {
        console.error("Error getting devices:", err);
        setError("Tidak dapat mengakses daftar kamera. Pastikan Anda telah memberikan izin.");
      });
  }, [handleDevices]);

  const videoConstraints = selectedDevice ? {
    width: 1280,
    height: 720,
    deviceId: selectedDevice.deviceId
  } : {
    width: 1280,
    height: 720,
    facingMode: "environment"
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
        setIsCameraOpen(false);
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
    const response = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
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

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Convert base64 to blob
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
          if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file terlalu besar. Maksimal 5MB.');
            return;
          }
          setSelectedImage(file);
          setPreviewUrl(imageSrc);
          setIsCameraOpen(false);
        })
        .catch(error => {
          console.error('Error capturing image:', error);
          setError('Gagal mengambil foto. Silakan coba lagi.');
        });
    }
  };

  return (
    <div className="relative min-h-screen flex bg-[#3B5D3D]">
      <Sidebar user={user} />
      <div className="flex-1 p-2 sm:p-4">
        <div className="bg-white min-h-[calc(100vh-2rem)] rounded-3xl shadow-lg p-3 sm:p-4">
          <div className="max-w-4xl mx-auto pb-4">
            <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 mb-4 relative overflow-hidden">
              {/* Background dekoratif */}
              <div className="absolute -top-16 -left-24 w-64 sm:w-96 h-32 sm:h-40 bg-gradient-to-tr from-green-200 to-green-400 opacity-20 rounded-full blur-2xl z-0"></div>
              <div className="absolute -bottom-16 -right-24 w-64 sm:w-96 h-32 sm:h-40 bg-gradient-to-tr from-blue-200 to-blue-400 opacity-20 rounded-full blur-2xl z-0"></div>

              {/* Judul dan subjudul animasi */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-center mb-2 bg-gradient-to-r from-green-700 via-green-500 to-green-700 bg-clip-text text-transparent drop-shadow-lg z-10"
              >
                Mulai Deteksi Sekarang!
              </motion.h2>
              <motion.h3
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-[#2e7d32] mb-4 sm:mb-6 text-center z-10"
              >
                Pastikan gambar yang diambil terlihat jelas
              </motion.h3>

              {/* Tombol utama animasi */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 z-10"
              >
                {!isCameraOpen && (
                  <button
                    onClick={() => setIsCameraOpen(true)}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-6 sm:px-8 lg:px-10 py-2 sm:py-3 lg:py-4 rounded-full shadow-lg text-base sm:text-lg lg:text-xl flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553 2.276A2 2 0 0121 14.09V17a2 2 0 01-2 2H5a2 2 0 01-2-2v-2.91a2 2 0 01.447-1.814L8 10m7 0V7a5 5 0 00-10 0v3m10 0H8" />
                    </svg>
                    Buka Kamera
                  </button>
                )}
                <label
                  htmlFor="file-upload"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 sm:px-8 lg:px-10 py-2 sm:py-3 lg:py-4 rounded-full shadow-lg text-base sm:text-lg lg:text-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                >
                  <FaCloudUploadAlt className="h-5 w-5 sm:h-6 sm:w-6" />
                  Upload Gambar
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                {isCameraOpen && (
                  <button
                    onClick={() => setIsCameraOpen(false)}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold px-6 sm:px-8 lg:px-10 py-2 sm:py-3 lg:py-4 rounded-full shadow-lg text-base sm:text-lg lg:text-xl flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Tutup Kamera
                  </button>
                )}
              </motion.div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-sm sm:text-base text-red-700">
                  {error}
                </div>
              )}

              {/* Camera Section */}
              <div className="mb-4 sm:mb-8">
                {/* Camera Selection Dropdown */}
                {isCameraOpen && devices.length > 1 && (
                  <div className="flex justify-center gap-4 mb-4">
                    <select
                      value={selectedDevice?.deviceId || ''}
                      onChange={(e) => {
                        const device = devices.find(d => d.deviceId === e.target.value);
                        setSelectedDevice(device);
                      }}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-sm sm:text-base"
                    >
                      {devices.map((device, index) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label || `Kamera ${index + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Camera View */}
                {isCameraOpen && (
                  <div className="mb-4 relative aspect-video max-w-2xl mx-auto">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      className="w-full h-full object-cover rounded-lg border border-gray-300"
                    />
                    <div className="flex justify-center gap-4 mt-2">
                      <motion.button
                        whileHover={{ scale: 1.08, boxShadow: '0 4px 24px 0 rgba(16,185,129,0.25)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleCapture}
                        className="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg transition-all duration-200"
                      >
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                        Ambil Foto
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* File Upload Area */}
                {!isCameraOpen && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 lg:p-8 text-center max-w-2xl mx-auto">
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
                      <FaCloudUploadAlt className="text-3xl sm:text-4xl lg:text-5xl text-[#2e7d32] mb-3 sm:mb-4" />
                      <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Preview Section */}
                {previewUrl && (
                  <div className="mb-4 sm:mb-8">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4">Preview Gambar:</h3>
                    <div className="relative max-w-2xl mx-auto">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-auto rounded-lg border border-gray-200"
                      />
                    </div>
                  </div>
                )}

                {/* Detection Result */}
                {detectionResult && (
                  <div className="mb-4 sm:mb-8">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4 text-[#2e7d32]">
                      Hasil Deteksi:
                    </h3>
                    <div className="bg-[#f8f9fa] p-3 sm:p-4 lg:p-6 rounded-lg border border-[#2e7d32]">
                      <p className="mb-2 text-xs sm:text-sm lg:text-base">
                        <span className="font-semibold">Penyakit:</span>{' '}
                        {diseaseInfo[detectionResult.label]?.name || detectionResult.label}
                      </p>
                      <p className="mb-2 text-xs sm:text-sm lg:text-base">
                        <span className="font-semibold">Tingkat Kepercayaan:</span>{' '}
                        {(detectionResult.confidence * 100).toFixed(2)}%
                      </p>
                      <div className="mt-3 sm:mt-4">
                        <h4 className="font-semibold mb-2 text-xs sm:text-sm lg:text-base">Deskripsi:</h4>
                        <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
                          {diseaseInfo[detectionResult.label]?.description}
                        </p>
                        <h4 className="font-semibold mb-2 text-xs sm:text-sm lg:text-base">Rekomendasi Penanganan:</h4>
                        <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-line">
                          {diseaseInfo[detectionResult.label]?.treatment}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewUrl(null);
                    setDetectionResult(null);
                    setError(null);
                    if (isCameraOpen) setIsCameraOpen(false);
                  }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-white border-2 border-[#2e7d32] text-[#2e7d32] rounded-full hover:bg-[#f0f9f0] text-sm sm:text-base lg:text-lg font-semibold shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpload}
                  disabled={(!selectedImage && !isCameraOpen) || isLoading}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 rounded-full flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg font-semibold shadow-md transition-all duration-200 ${
                    (!selectedImage && !isCameraOpen) || isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#2e7d32] text-white hover:bg-[#1b5e20]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      Mulai Deteksi
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-[#2e7d32] mb-3 sm:mb-4">
                Panduan Penggunaan:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm lg:text-base text-gray-700">
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