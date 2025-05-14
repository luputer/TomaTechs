import React from 'react';

const About = () => {
    return (
        <div id='about' className=" bg-gradient-to-b from-white to-[#f3fbe9]">
            <div className="container mx-auto px-4 py-12">
                <div className="bg-white/30 backdrop-blur-sm border-2 border-white shadow-lg rounded-xl p-8 relative">
                    {/* Label Tentang */}
                    <div className="absolute -top-5 left-8 bg-[#eafbe2] px-6 py-2 rounded-full border border-[#b7e2a6] shadow-md text-[#478800] font-bold text-xl flex items-center gap-2">
                        <span className="text-[#478800]">Tentang</span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-6">
                            <div className="text-gray-700 space-y-4">
                                <p className="text-lg">
                                    <span className="font-semibold text-[#478800]">TomaTech</span> adalah aplikasi yang membantu mendeteksi penyakit daun tomat secara cepat dan akurat dengan teknologi AI. Dirancang untuk mendukung petani dalam meningkatkan hasil panen dan mengurangi penggunaan pestisida berlebihan.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-xl text-[#478800]">Highlight Fitur Utama:</h3>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start gap-3">
                                        <div className="min-w-[24px] mt-1">
                                            <svg className="w-6 h-6 text-[#478800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>Deteksi Akurat dan Cepat: Unggah foto, dan biarkan AI bekerja untuk Anda!</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="min-w-[24px] mt-1">
                                            <svg className="w-6 h-6 text-[#478800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>Solusi Tepat Sasaran: Berikan saran penanganan berbasis data.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="min-w-[24px] mt-1">
                                            <svg className="w-6 h-6 text-[#478800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>Ramah Pengguna: Aplikasi ini dirancang untuk kemudahan petani.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Content - Logo Shield */}
                        <div className="flex justify-center">
                            <div className="relative w-[500px] h-[500px]">
                                <div className="absolute inset-0 rounded-full opacity-10"></div>
                                <img
                                    src="/src/assets/logos.png"
                                    alt="TomaTech Shield"
                                    className="relative z-10 w-full h-full object-contain p-6"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};
                 

export default About;
