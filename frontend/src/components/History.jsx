import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const History = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserHistory = async () => {
            if (!user) return;

            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/history/${user.id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch history');
                }

                const data = await response.json();
                setHistory(data);
            } catch (error) {
                console.error('Error fetching history:', error);
                setError('Gagal mengambil data riwayat');
            } finally {
                setLoading(false);
            }
        };

        fetchUserHistory();
    }, [user]);

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Akses Terbatas</h2>
                    <p className="text-gray-600">Silakan login untuk melihat riwayat deteksi Anda</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                    <p className="text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Riwayat Deteksi</h2>
            {history.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600">Belum ada riwayat deteksi</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                        >
                            {item.image_url && (
                                <img
                                    src={item.image_url}
                                    alt="Detected Plant"
                                    className="w-full h-48 object-cover rounded-md mb-4"
                                />
                            )}
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg">{item.predicted_class}</h3>
                                <p className="text-gray-600">
                                    Confidence: {(item.confidence * 100).toFixed(2)}%
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History; 