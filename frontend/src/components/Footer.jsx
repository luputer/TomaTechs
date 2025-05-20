import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Link } from 'react-router';

const Footer = () => {
    return (<>
        <div className="mt-4 sm:mt-8 md:mt-10 mb-2 sm:mb-4 bg-gray-200 border border-gray-300 rounded-lg flex flex-col md:flex-row items-center justify-between px-2 sm:px-4 md:px-8 py-2 sm:py-4 md:py-6 shadow">
            <div className="text-center md:text-left mb-2 sm:mb-4 md:mb-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#478800] drop-shadow-sm leading-tight">
                    Tanaman yang Sehat<br />Dimulai dari Daunnya
                </h2>
            </div>
            <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#478800] hover:bg-[#356600] text-white font-medium px-3 sm:px-4 md:px-6 py-1 sm:py-2 rounded-full shadow transition">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16 17a6 6 0 10-12 0" />
                </svg>
                Masuk
            </button>
        </div>
        <footer className="bg-[#3B5D3D] text-white py-8 relative z-40">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    {/* Logo and Description */}
                    <div className="max-w-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/src/assets/logo.png" alt="TomaTech" className="h-20 w-20" />
                            <h2 className="text-4xl font-bold">TomaTech</h2>
                        </div>
                        <p className="text-gray-200 mb-6">
                            Aplikasi ini dikembangkan untuk membantu petani Indonesia
                        </p>
                        {/* Social Media Links */}
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-gray-300 transition-colors">
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="hover:text-gray-300 transition-colors">
                                <Linkedin className="h-6 w-6" />
                            </a>
                            <a href="#" className="hover:text-gray-300 transition-colors">
                                <Youtube className="h-6 w-6" />
                            </a>
                            <a href="#" className="hover:text-gray-300 transition-colors">
                                <Instagram className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="block hover:text-gray-300 transition-colors">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="block hover:text-gray-300 transition-colors">
                                    Tentang
                                </Link>
                            </li>
                            <li>
                                <Link to="/team" className="block hover:text-gray-300 transition-colors">
                                    Team
                                </Link>
                            </li>
                        </ul>

                        {/* Contact Information */}
                        <ul className="space-y-2">
                            <li className="font-semibold mb-2">Kontak</li>
                            <li className="text-gray-200">
                                Email: info@tomatech.com
                            </li>
                            <li className="text-gray-200">
                                Telp: (021) 1234-5678
                            </li>
                            <li className="text-gray-200">
                                WhatsApp: +62 812-3456-7890
                            </li>
                        </ul>

                        {/* Address */}
                        <ul className="space-y-2">
                            <li className="font-semibold mb-2">Alamat</li>
                            <li className="text-gray-200">
                                Jl. Teknologi No. 123
                            </li>
                            <li className="text-gray-200">
                                Jakarta Selatan, 12345
                            </li>
                            <li className="text-gray-200">
                                Indonesia
                            </li>
                        </ul>

                        {/* Company Info */}
                        <ul className="space-y-2">
                            <li className="font-semibold mb-2">Perusahaan</li>
                            <li>
                                <Link to="/careers" className="block hover:text-gray-300 transition-colors">
                                    Karir
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="block hover:text-gray-300 transition-colors">
                                    Kebijakan Privasi
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="block hover:text-gray-300 transition-colors">
                                    Syarat & Ketentuan
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    </>
    );
};

export default Footer;