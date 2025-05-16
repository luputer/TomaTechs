import Sidebar from '@/components/Sidebar';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="relative min-h-screen flex bg-[#3B5D3D]">
            <Sidebar user={user} />
            <div className="flex-1 p-4">
                <div className="bg-white h-[calc(100vh-2rem)] rounded-3xl shadow-lg p-6">
                    <div className="max-w-4xl mx-auto pb-8">
                        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-6 md:mb-8">
                            <h1 className="text-2xl md:text-6xl font-bold text-[#2e7d32] mb-2 text-center">
                                Selamat Datang
                            </h1>
                            <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mb-6 md:mb-12 text-center">
                                {user?.user_metadata?.full_name || 'User'}
                            </h2>
                            {/* Hero Section */}
                            <div className="bg-gray-100 rounded-xl py-4 md:py-8 px-2 md:px-4 mb-6 md:mb-8 flex flex-col items-center shadow">
                                <h2 className="text-lg md:text-2xl font-bold text-green-700 mb-2 md:mb-4 text-center">
                                    Deteksi Penyakit Daun Tomat dengan AI
                                </h2>
                                <p className="text-sm md:text-lg text-gray-700 text-center max-w-xs md:max-w-xl">
                                    Unggah foto daun tomat dan temukan
                                </p>
                                <p className="text-sm md:text-lg text-gray-700 text-center max-w-xs md:max-w-xl">
                                    solusinya secara otomatis dengan
                                </p>
                                <p className="text-sm md:text-lg text-gray-700 mb-4 md:mb-6 text-center max-w-xs md:max-w-xl">
                                    teknologi AI
                                </p>
                                <a
                                    href="/deteksi"
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 md:px-8 py-2 md:py-3 rounded-full shadow transition text-base md:text-lg"
                                >
                                    Mulai Deteksi
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;