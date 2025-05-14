import Sidebar from '@/components/Sidebar';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="relative min-h-screen flex">
            <Sidebar user={user} />
            <div className="container mx-auto px-4 py-8 flex-1">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <h1 className="text-2xl font-bold mb-4 text-gray-800">
                            Selamat Datang, {user?.email}
                        </h1>
                        <p className="text-gray-600">
                            Pilih salah satu menu di bawah untuk memulai:
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <Link
                            to="/deteksi"
                            className="block bg-white hover:bg-gray-50 transition-colors rounded-lg shadow-md p-6"
                        >
                            <h2 className="text-xl font-semibold text-green-700 mb-3">
                                Deteksi Penyakit
                            </h2>
                            <p className="text-gray-600">
                                Unggah foto daun tomat untuk mendeteksi penyakit dan dapatkan rekomendasi penanganan.
                            </p>
                        </Link>

                        <Link
                            to="/history"
                            className="block bg-white hover:bg-gray-50 transition-colors rounded-lg shadow-md p-6"
                        >
                            <h2 className="text-xl font-semibold text-green-700 mb-3">
                                Riwayat Deteksi
                            </h2>
                            <p className="text-gray-600">
                                Lihat riwayat deteksi penyakit yang telah Anda lakukan sebelumnya.
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;