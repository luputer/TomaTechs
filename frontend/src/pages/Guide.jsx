import React from 'react';
import Navbar from '../components/navbar';

const Guide = () => {
    return (
        <div className=" bg-gradient-to-b from-white to-[#f3fbe9]">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                {/* Panduan Section */}
                <div className="bg-white/30 backdrop-blur-sm border-2 border-white shadow-lg rounded-xl p-8 relative mb-12">
                    {/* Label Panduan */}
                    <div className="absolute -top-5 left-8 bg-[#eafbe2] px-6 py-2 rounded-full border border-[#b7e2a6] shadow-md text-[#478800] font-bold text-xl flex items-center gap-2">
                        <span className="text-[#478800]">Panduan Penggunaan Aplikasi</span>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <img
                                src="/src/assets/panduan1.png"
                                alt="Ambil atau Unggah Foto"
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-[#478800] mb-2">1. Ambil atau Unggah Foto</h3>
                                <ul className="text-gray-700 space-y-2 text-sm">
                                    <li>• Gunakan kamera perangkat Anda untuk mengambil foto daun tomat yang ingin diperiksa, atau unggah gambar yang sudah ada di galeri Anda.</li>
                                    <li>• Pastikan gambar diambil dengan pencahayaan yang baik dan fokus pada daun untuk hasil deteksi yang lebih akurat.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <img
                                src="/src/assets/panduan2.png"
                                alt="Analisis Otomatis"
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-[#478800] mb-2">2. Analisis Otomatis</h3>
                                <ul className="text-gray-700 space-y-2 text-sm">
                                    <li>• Setelah foto diunggah, sistem akan secara otomatis menganalisis gambar menggunakan teknologi kecerdasan buatan (AI).</li>
                                    <li>• Tunggu beberapa detik hingga proses selesai. Indikator akan menunjukkan status analisis berjalan.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <img
                                src="/src/assets/panduan3.png"
                                alt="Lihat Hasil dan Saran"
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-[#478800] mb-2">3. Lihat Hasil dan Saran</h3>
                                <ul className="text-gray-700 space-y-2 text-sm">
                                    <li>• Hasil deteksi akan menampilkan Nama Penyakit (jika ditemukan) atau status Sehat.</li>
                                    <li>• Saran Penanganan yang spesifik untuk mengobati atau mencegah penyakit tersebut.</li>
                                    <li>• Ikuti rekomendasi yang diberikan untuk menjaga kesehatan tanaman Anda.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dampak Positif Section */}
                <div className="bg-white/30 backdrop-blur-sm border-2 border-white shadow-lg rounded-xl p-8 relative">
                    {/* Label Dampak */}
                    <div className="absolute -top-5 left-8 bg-[#eafbe2] px-6 py-2 rounded-full border border-[#b7e2a6] shadow-md text-[#478800] font-bold text-xl flex items-center gap-2">
                        <span className="text-[#478800]">Dampak Positif</span>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Impact 1 */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <img
                                src="/src/assets/dampak1.png"
                                alt="Meningkatkan Produktivitas Petani"
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-[#478800] mb-3">Meningkatkan Produktivitas Petani</h3>
                                <p className="text-gray-700">
                                    Dengan deteksi penyakit yang cepat dan akurat, petani dapat segera menentukan langkah pencegahan dan pengobatan, sehingga mengurangi risiko gagal panen dan meningkatkan hasil produksi secara signifikan.
                                </p>
                            </div>
                        </div>

                        {/* Impact 2 */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <img
                                src="/src/assets/dampak2.png"
                                alt="Mengurangi Penggunaan Pestisida Berlebihan"
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-[#478800] mb-3">Mengurangi Penggunaan Pestisida Berlebihan</h3>
                                <p className="text-gray-700">
                                    Sistem ini membantu petani menerapkan penanganan tanaman secara lebih tepat sasaran, sehingga mengurangi penggunaan pestisida berlebihan yang dapat merusak lingkungan dan meningkatkan biaya produksi.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 mb-4  bg-gray-200 border border-gray-300 rounded-lg flex flex-col md:flex-row items-center justify-between px-8 py-6 shadow">
                        <div>
                            <h2 className="text-2xl font-bold text-[#478800] drop-shadow-sm leading-tight">
                                Tanaman yang Sehat<br />Dimulai dari Daunnya
                            </h2>
                        </div>
                        <button className="mt-4 md:mt-0 flex items-center gap-2 bg-[#478800] hover:bg-[#356600] text-white font-medium px-6 py-2 rounded-full shadow transition">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="8" r="4" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16 17a6 6 0 10-12 0" />
                            </svg>
                            Masuk
                        </button>
                    </div>
                </div>

                {/* Banner: Tanaman yang Sehat Dimulai dari Daunnya */}

            </div>
        </div>
    );
};

export default Guide; 