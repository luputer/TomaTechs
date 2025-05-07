import { Link } from "react-router";

const Navbar = () => {
    return (
        <nav className="bg-gray-50 p-4">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo and Brand */}
                <div className="flex items-center gap-2">
                    {/* <img src={logo} alt="Logo" className="h-12 w-12" /> */}
                    <span className="text-2xl font-bold">TomaTech</span>
                </div>
                {/* Navigation Links */}
                <div className="flex items-center gap-8">
                    <Link to="/" className="font-medium hover:text-green-700">Beranda</Link>
                    <Link to="/about" className="font-medium hover:text-green-700">Tentang</Link>
                    <Link to="/panduan" className="font-medium hover:text-green-700">Panduan</Link>
                    <Link
                        to="/login"
                        className="bg-green-600 text-white px-5 py-2 rounded-md font-medium hover:bg-green-700 transition"
                    >
                        Masuk
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
