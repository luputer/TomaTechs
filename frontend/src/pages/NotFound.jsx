import React from 'react';
import { Link } from 'react-router';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#f0f9f0] flex items-center justify-center p-4">
            <div className="max-w-xl w-full relative bg-white rounded-lg shadow-lg p-8">
                {/* Leaf decoration - top right */}
                <img
                    src="/leaf.png"
                    alt="Leaf"
                    className="absolute -top-10 -right-10 w-32 h-32 object-contain transform rotate-45"
                />

                {/* Tomato decoration - bottom left */}
                <img
                    src="/tomato.png"
                    alt="Tomato"
                    className="absolute -bottom-8 -left-8 w-24 h-24 object-contain opacity-80"
                />

                <div className="text-center relative z-10">
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
                        <button className="bg-[#2e7d32] text-white px-6 py-2 rounded-full hover:bg-[#1b5e20] transition-colors">
                            Beranda
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound; 