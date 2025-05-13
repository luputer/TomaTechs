import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { FloatingNav } from './ui/floating-navbar';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, login, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAuth = async () => {
        if (user) {
            await logout();
        } else {
            await login();
        }
    };

    const navItems = [
        {
            name: "Beranda",
            link: "/",
        },
        {
            name: "Tentang",
            link: "#about",
        },
        {
            name: "Team",
            link: "/team",
        },
        {
            name: "Kontak",
            link: "/contact",
        }
    ];

    return (
        <>
            {isScrolled && <FloatingNav navItems={navItems} />}
            <nav className={`shadow-md bg-[#D9D9D9] fixed w-full top-0 z-40 transition-all duration-300 ${isScrolled ? '-translate-y-full' : 'translate-y-0'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo and Brand */}
                        <Link to="/" className="flex items-center">
                            <img src="/src/assets/logo.png" alt="TomaTech" className="h-20 w-20" />
                            <span className="text-2xl font-bold">TomaTech</span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="flex items-center gap-6">
                            {!user && (
                                <>
                                    <Link to="/" className="flex items-center gap-2 text-gray-800 font-medium hover:text-green-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Beranda
                                    </Link>
                                    <a href="#about" className="flex items-center gap-2 text-gray-800 font-medium hover:text-green-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                            <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <circle cx="12" cy="8" r="1" fill="currentColor" />
                                        </svg>
                                        Tentang
                                    </a>
                                    <Link to="/team" className="flex items-center gap-2 text-gray-800 font-medium hover:text-green-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a4 4 0 00-3-3.87M6 10a4 4 0 00-3 3.87" />
                                        </svg>
                                        Team
                                    </Link>
                                </>
                            )}
                            {user ? (
                                <>
                                    <Link to="/dashboard" className="text-gray-600 hover:text-green-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Keluar
                                    </button>
                                </>
                            ) : (
                                <Button
                                    variant={"default"}
                                    onClick={handleAuth}
                                    className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex items-center gap-2 border-2 border-white shadow-xl"
                                >
                                    <span className="font-semibold">Masuk</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <circle cx="12" cy="9" r="4" stroke="white" strokeWidth="2" fill="none" />
                                        <path d="M4 19c0-2.5 3.5-4.5 8-4.5s8 2 8 4.5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                                    </svg>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
