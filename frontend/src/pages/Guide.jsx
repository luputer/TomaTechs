const Guide = () => {
    return (
        <div className="mt-2 bg-gradient-to-b from-white to-[#f3fbe9]">
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Panduan Section */}
                <div className="bg-white/30 backdrop-blur-sm border-2 border-white shadow-lg rounded-xl p-4 md:p-8 relative mb-8 md:mb-12">
                    {/* Label Panduan */}
                    <div className="absolute -top-4 md:-top-5 left-4 md:left-8 bg-[#eafbe2] px-4 md:px-6 py-1.5 md:py-2 rounded-full border border-[#b7e2a6] shadow-md text-[#478800] font-bold text-lg md:text-xl flex items-center gap-2">
                        <span className="text-[#478800]">Panduan Penggunaan Aplikasi</span>
                    </div>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                        {/* Step 1 */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <img
                                src="/src/assets/panduan1.png"
                                alt="Ambil atau Unggah Foto"
                                className="w-full h-32 sm:h-40 md:h-48 object-cover"
                            />
                            <div className="p-3 md:p-4">
                                <h3 className="text-base md:text-lg font-semibold text-[#478800] mb-2">1. Ambil atau Unggah Foto</h3>
                                <ul className="text-gray-700 space-y-1.5 md:space-y-2 text-xs md:text-sm">
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
                                className="w-full h-40 sm:h-48 object-cover"
                            />
                            <div className="p-3 md:p-4">
                                <h3 className="text-base md:text-lg font-semibold text-[#478800] mb-2">2. Analisis Otomatis</h3>
                                <ul className="text-gray-700 space-y-1.5 md:space-y-2 text-xs md:text-sm">
                                    <li>• Setelah foto diunggah, sistem akan secara otomatis menganalisis gambar menggunakan teknologi kecerdasan buatan (AI).</li>
                                    <li>• Tunggu beberapa detik hingga proses selesai. Indikator akan menunjukkan status analisis berjalan.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden sm:col-span-2 md:col-span-1">
                            <img
                                src="/src/assets/panduan3.png"
                                alt="Lihat Hasil dan Saran"
                                className="w-full h-40 sm:h-48 object-cover"
                            />
                            <div className="p-3 md:p-4">
                                <h3 className="text-base md:text-lg font-semibold text-[#478800] mb-2">3. Lihat Hasil dan Saran</h3>
                                <ul className="text-gray-700 space-y-1.5 md:space-y-2 text-xs md:text-sm">
                                    <li>• Hasil deteksi akan menampilkan Nama Penyakit (jika ditemukan) atau status Sehat.</li>
                                    <li>• Saran Penanganan yang spesifik untuk mengobati atau mencegah penyakit tersebut.</li>
                                    <li>• Ikuti rekomendasi yang diberikan untuk menjaga kesehatan tanaman Anda.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dampak Positif Section */}
                <div className="bg-white/30 backdrop-blur-sm border-2 border-white shadow-lg rounded-xl p-4 md:p-8 relative">
                    {/* Label Dampak */}
                    <div className="absolute -top-4 md:-top-5 left-4 md:left-8 bg-[#eafbe2] px-4 md:px-6 py-1.5 md:py-2 rounded-full border border-[#b7e2a6] shadow-md text-[#478800] font-bold text-lg md:text-xl flex items-center gap-2">
                        <span className="text-[#478800]">Dampak Positif</span>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        {/* Impact 1 */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <img
                                src="/src/assets/dampak1.png"
                                alt="Meningkatkan Produktivitas Petani"
                                className="w-full h-32 sm:h-40 md:h-48 object-cover"
                            />
                            <div className="p-4 md:p-6">
                                <h3 className="text-lg md:text-xl font-semibold text-[#478800] mb-2 md:mb-3">Meningkatkan Produktivitas Petani</h3>
                                <p className="text-sm md:text-base text-gray-700">
                                    Dengan deteksi penyakit yang cepat dan akurat, petani dapat segera menentukan langkah pencegahan dan pengobatan, sehingga mengurangi risiko gagal panen dan meningkatkan hasil produksi secara signifikan.
                                </p>
                            </div>
                        </div>

                        {/* Impact 2 */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <img
                                src="/src/assets/dampak2.png"
                                alt="Mengurangi Penggunaan Pestisida Berlebihan"
                                className="w-full h-48 sm:h-56 md:h-64 object-cover"
                            />
                            <div className="p-4 md:p-6">
                                <h3 className="text-lg md:text-xl font-semibold text-[#478800] mb-2 md:mb-3">Mengurangi Penggunaan Pestisida Berlebihan</h3>
                                <p className="text-sm md:text-base text-gray-700">
                                    Sistem ini membantu petani menerapkan penanganan tanaman secara lebih tepat sasaran, sehingga mengurangi penggunaan pestisida berlebihan yang dapat merusak lingkungan dan meningkatkan biaya produksi.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Guide;