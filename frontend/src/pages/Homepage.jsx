import { useEffect } from 'react';
import { Link } from 'react-router';
import { TypeAnimation } from 'react-type-animation';
import Navbar from '../components/navbar';
import { useAuth } from '../context/AuthContext';
import About from './About';
import Blog from './Blog';
import Guide from './Guide';

const Homepage = () => {
    const { user, login } = useAuth();

    useEffect(() => {
        if (window.location.hash === '#blog' || sessionStorage.getItem('scrollToBlog')) {
            setTimeout(() => {
                const blogSection = document.getElementById('blog');
                if (blogSection) {
                    blogSection.scrollIntoView({ behavior: 'smooth' });
                }
                sessionStorage.removeItem('scrollToBlog');
            }, 100);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-[#f3fbe9]">
            <Navbar />
            <div className="container mx-auto px-2 sm:px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 items-center py-6 sm:py-12">
                    {/* Left Column - Content */}
                    <div className="relative">
                        {/* Tomato top-right image */}
                        <img
                            src="/tomat.png"
                            alt="Tomato"
                            className="absolute right-0 -top-8 w-32 h-32 object-contain pointer-events-none select-none opacity-80"
                            style={{ zIndex: 1 }}
                        />
                        {/* Header */}
                        <div className="bg-white/30 backdrop-blur-sm border-2 border-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
                            <TypeAnimation
                                sequence={[
                                    ' Deteksi Penyakit Tomat Melalui Daun',
                                    1000,
                                    ' Deteksi Penyakit Tomat berbasis AI',
                                    1000,
                                    ' Deteksi Penyakit Tomat Dengan petani lain',
                                    1000,
                                    ' Deteksi Penyakit Tomat secara gratis',
                                    1000
                                ]}
                                wrapper="span"
                                speed={50}
                                style={{ fontSize: '2em', display: 'inline-block' }}
                                repeat={Infinity}
                                className="text-[#478800] text-4xl sm:text-4xl md:text-5xl font-bold text-left mb-4">
                            </TypeAnimation>
                            <p className="text-left text-base md:text-lg text-gray-700 mb-6">
                                Unggah foto daun tomat dan temukan solusinya secara otomatis dengan teknologi AI
                            </p>
                            {/* Button */}
                            <div className="flex items-center">
                                {user ? (
                                    <Link
                                        to="/deteksi"
                                        className="flex items-center gap-2 bg-[#478800] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow hover:bg-[#2e4a2f] transition-colors text-sm sm:text-base font-medium w-full sm:w-auto justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                        </svg>
                                        Mulai Deteksi
                                    </Link>
                                ) : (
                                    <button
                                        onClick={login}
                                        className="flex items-center gap-2 bg-[#478800] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow hover:bg-[#2e4a2f] transition-colors text-sm sm:text-base font-medium w-full sm:w-auto justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                        </svg>
                                        Mulai Deteksi
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="rounded-3xl overflow-hidden shadow-lg border border-[#cde7c1] bg-white">
                        <img
                            src="/HeroImage.png"
                            alt="Tomato Plant"
                            className="w-full h-40 sm:h-60 md:h-80 lg:h-[400px] object-cover"
                        />
                    </div>
                </div>
            </div>
            <About />
            <Guide/>
            <div id="blog">
                <Blog/>
            </div>

        </div>
    );
};

export default Homepage;