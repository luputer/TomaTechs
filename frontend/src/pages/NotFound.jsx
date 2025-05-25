import { Link } from 'react-router';

const NotFound = () => {
    return (
        <div className="bg-white flex items-center justify-center min-h-screen h-screen w-full p-0 m-0 overflow-hidden">
            <div className="relative bg-white rounded-lg w-full h-[80vh] flex flex-col justify-center items-center overflow-hidden">
                {/* Leaf decoration - top right */}
                <img
                    src="/images/icons/daun12.png"
                    alt="Leaf"
                    className="absolute top-0 right-0 w-32 h-32 object-contain opacity-80 pointer-events-none select-none"
                />

                {/* Tomato decoration - bottom left */}
                <img
                    src="/images/icons/tomat2.png"
                    alt="Tomato"
                    className="absolute bottom-0 left-0 w-32 h-32 object-contain opacity-80 pointer-events-none select-none"
                />

                <div className="text-center relative z-10 flex flex-col items-center justify-center h-full">
                    {/* 404 Text */}
                    <h1 className="text-[#2e7d32] text-8xl font-bold mb-4">
                        404
                    </h1>

                    {/* Error Message */}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-8">
                        Halaman tidak ditemukan
                    </h2>

                    {/* Back Button */}
                    <Link to="/">
                        <button className="bg-[#2e7d32] text-white px-6 py-2 rounded-full hover:bg-[#1b5e20] transition-colors shadow-md">
                            Beranda
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;