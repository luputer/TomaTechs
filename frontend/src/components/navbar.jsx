import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { FloatingNav } from './ui/floating-navbar';

const Navbar = () => {
    const { user, login, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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

    const handleAboutClick = (e) => {
        e.preventDefault();
        if (location.pathname !== '/') {
            navigate('/');
            // Tunggu navigasi selesai baru scroll ke about
            setTimeout(() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsMobileMenuOpen(false);
    };

    const handleBlogClick = (e) => {
        e.preventDefault();
        if (location.pathname === '/') {
            const blogSection = document.getElementById('blog');
            if (blogSection) {
                blogSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            sessionStorage.setItem('scrollToBlog', '1');
            navigate('/');
        }
        setIsMobileMenuOpen(false);
    };

    // Mapping path ke judul dan ikon
    const getPageTitle = (pathname) => {
        if (pathname.startsWith('/dashboard')) return { title: 'Dashboard', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ) };
        if (pathname.startsWith('/deteksi')) return { title: 'Deteksi', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ) };
        if (pathname.startsWith('/history')) return { title: 'Riwayat', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ) };
        if (pathname.startsWith('/chats')) return { title: 'TomaChat', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A8.96 8.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        ) };
        if (pathname.startsWith('/forum')) return { title: 'Forum', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a4 4 0 00-3-3.87M6 10a4 4 0 00-3 3.87" />
            </svg>
        ) };
        if (pathname.startsWith('/team')) return { title: 'Team', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a4 4 0 00-3-3.87M6 10a4 4 0 00-3 3.87" />
            </svg>
        ) };
        if (pathname.startsWith('/contact')) return { title: 'Contact', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="8" r="1" fill="currentColor" />
            </svg>
        ) };
        return { title: 'TomaTech', icon: null };
    };
    const { title: pageTitle, icon: pageIcon } = getPageTitle(location.pathname);

    const navItems = [
        {
            name: "Beranda",
            link: "/",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: "Tentang",
            link: "/#about",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            name: "Blog",
            link: "/#blog",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M8 8h8M8 12h8M8 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            )
        },
        {
            name: "Team",
            link: "/team",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a4 4 0 00-3-3.87M6 10a4 4 0 00-3 3.87" />
                </svg>
            )
        },
        {
            name: "Contact",
            link: "/contact",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="8" r="1" fill="currentColor" />
                </svg>
            )
        }
    ];

    return (
        <>
            {isScrolled && !user && <FloatingNav navItems={navItems} />}
            <nav className={`shadow-md bg-[#D9D9D9] fixed w-full top-0 z-40 transition-all duration-300 ${isScrolled && !user ? '-translate-y-full' : 'translate-y-0'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo and Brand */}
                        <Link to="/" className="flex items-center">
                            <img src="/images/logos/logo.png" alt="TomaTech" className="h-16 w-16 md:h-20 md:w-20" />
                            <span className="text-xl md:text-2xl font-bold">{pageTitle}</span>
                        </Link>

                        {/* Mobile: Dashboard & Logout icon only if logged in */}
                        {user ? (
                            <>
                                <div className="flex md:hidden items-center gap-6">
                                    <Link to="/dashboard" aria-label="Dashboard" className="text-gray-700 hover:text-[#478800] p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        aria-label="Keluar"
                                        className="text-red-600 hover:text-red-800 p-2 rounded-full"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </button>
                                </div>
                                {/* Desktop Navigation for logged in user */}
                                <div className="hidden md:flex items-center gap-6">
                                    <Link to={location.pathname} className="text-gray-600 hover:text-green-700 flex items-center gap-2">
                                        {pageIcon}
                                        <span className="font-medium">{pageTitle}</span>
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
                                </div>
                                </>
                            ) : (
                            <>
                                {/* Mobile Menu Button */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    {isMobileMenuOpen ? (
                                        <X className="h-6 w-6" />
                                    ) : (
                                        <Menu className="h-6 w-6" />
                                    )}
                                </button>
                                {/* Desktop Navigation */}
                                <div className="hidden md:flex items-center gap-6">
                                    {navItems.map((item) => (
                                        item.name === "Tentang" ? (
                                            <button
                                                key={item.name}
                                                onClick={handleAboutClick}
                                                className="flex items-center gap-2 text-gray-800 font-medium hover:text-green-700"
                                            >
                                                {item.icon}
                                                {item.name}
                                            </button>
                                        ) : item.name === "Blog" ? (
                                            <button
                                                key={item.name}
                                                onClick={handleBlogClick}
                                                className="flex items-center gap-2 text-gray-800 font-medium hover:text-green-700"
                                            >
                                                {item.icon}
                                                Blog
                                            </button>
                                        ) : (
                                            <Link
                                                key={item.name}
                                                to={item.link}
                                                className="flex items-center gap-2 text-gray-800 font-medium hover:text-green-700"
                                            >
                                                {item.icon}
                                                {item.name}
                                            </Link>
                                        )
                                    ))}
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
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile Navigation */}
                    <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        <div className="py-4 space-y-4">
                            {user ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="block text-gray-700 hover:text-[#478800] transition-colors px-2 py-1 flex items-center gap-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {/* Dashboard icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                        className="block w-full text-left text-red-600 hover:text-red-800 transition-colors px-2 py-1 flex items-center gap-2"
                                    >
                                        {/* Logout icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Keluar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/"
                                        className="block text-gray-800 font-medium hover:text-green-700 px-2 py-1"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Beranda
                                    </Link>
                                    <button
                                        onClick={handleAboutClick}
                                        className="block text-gray-800 font-medium hover:text-green-700 px-2 py-1 w-full text-left"
                                    >
                                        Tentang
                                    </button>
                                    <Link
                                        to="/team"
                                        className="block text-gray-800 font-medium hover:text-green-700 px-2 py-1"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Team
                                    </Link>
                                    <button
                                        className="block text-gray-800 font-medium hover:text-green-700 px-2 py-1 w-full text-left"
                                        onClick={handleBlogClick}
                                    >
                                        Blog
                                    </button>
                                </>
                            )}
                            {!user && (
                                <Button
                                    onClick={() => {
                                        handleAuth();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    variant="default"
                                    className="w-full bg-[#478800] hover:bg-[#2e4a2f] text-white"
                                >
                                    Masuk
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
