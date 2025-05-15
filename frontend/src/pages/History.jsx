import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";
import { useAuth } from '../context/AuthContext';

const History = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    useEffect(() => {
        if (user?.id) {
            fetchHistory();
        } else {
            setLoading(false);
        }
    }, [user?.id]);

    const fetchHistory = async () => {
        try {
            console.log('Fetching history for user:', user.id);
            const apiUrl = 'http://localhost:8080';
            console.log('Using API URL:', apiUrl);

            const response = await fetch(`${apiUrl}/history/${user.id}`);

            if (!response.ok) {
                if (response.status === 404) {
                    console.log('No history found for user');
                    setPredictions([]);
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received data:', data);

            if (Array.isArray(data)) {
                setPredictions(data);
            } else if (data.error) {
                throw new Error(data.message || 'Server error');
            } else {
                console.error('Invalid data format received:', data);
                throw new Error('Invalid data format received from server');
            }
        } catch (err) {
            console.error('Error fetching history:', err);
            if (err.message === 'Failed to fetch') {
                setError('Tidak dapat terhubung ke server. Pastikan backend berjalan di http://localhost:8080');
            } else {
                setError(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // const handleDelete = async (id) => {
    //     if (!user?.id) {
    //         setError('User tidak terautentikasi');
    //         return;
    //     }

    //     try {
    //         console.log(`Attempting to delete prediction ${id} for user ${user.id}`);
    //         const apiUrl = 'http://localhost:8080';
    //         const response = await fetch(`${apiUrl}/delete/${id}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Accept': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 user_id: user.id
    //             })
    //         });

    //         console.log('Delete response status:', response.status);
    //         const data = await response.json();
    //         console.log('Delete response data:', data);

    //         if (!response.ok) {
    //             if (response.status === 404) {
    //                 setError('Data prediksi tidak ditemukan');
    //             } else {
    //                 throw new Error(data.error || 'Gagal menghapus prediksi');
    //             }
    //             return;
    //         }

    //         // Jika berhasil, update state untuk menghapus item dari tampilan
    //         setPredictions(predictions.filter(pred => pred.id !== id));
    //         setError(null); // Clear any existing errors

    //         // Tampilkan pesan sukses jika ada
    //         if (data.message) {
    //             console.log('Success:', data.message);
    //         }
    //     } catch (err) {
    //         console.error('Error deleting prediction:', err);
    //         setError(err.message || 'Gagal menghapus prediksi');
    //     }
    // };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = predictions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(predictions.length / itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0);
        }
    };

    const PaginationButton = ({ onClick, disabled, children }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-3 py-1 rounded-md ${disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-green-700 hover:bg-green-50'
                } border border-gray-200 transition-colors`}
        >
            {children}
        </button>
    );

    const Pagination = () => (
        <div className="flex justify-center items-center gap-2 mt-6">
            <PaginationButton
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-5 w-5" />
            </PaginationButton>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <PaginationButton
                    key={number}
                    onClick={() => paginate(number)}
                    disabled={currentPage === number}
                >
                    {number}
                </PaginationButton>
            ))}

            <PaginationButton
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-5 w-5" />
            </PaginationButton>
        </div>
    );

    const diseaseInfo = {
        'Early_blight': {
            name: 'Hawar Daun Dini (Early Blight)',
            description: 'Penyakit yang disebabkan oleh jamur Alternaria solani.',
            treatment: 'Rotasi tanaman, pemangkasan daun terinfeksi, aplikasi fungisida.'
        },
        'Late_blight': {
            name: 'Hawar Daun Akhir (Late Blight)',
            description: 'Penyakit yang disebabkan oleh Phytophthora infestans.',
            treatment: 'Fungisida preventif, hindari kelembaban tinggi, buang tanaman terinfeksi.'
        },
        'Healthy': {
            name: 'Daun Sehat',
            description: 'Daun dalam kondisi sehat.',
            treatment: 'Pertahankan perawatan rutin dan pemantauan.'
        }
    };

    if (loading) return (
        <div className="relative min-h-screen flex bg-[#3B5D3D]">
            <Sidebar user={user} />
            <div className="flex-1 p-4">
                <div className="bg-white h-[calc(100vh-2rem)] rounded-3xl shadow-lg p-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700"></div>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="relative min-h-screen flex bg-[#3B5D3D]">
            <Sidebar user={user} />
            <div className="flex-1 p-4">
                <div className="bg-white h-[calc(100vh-2rem)] rounded-3xl shadow-lg p-6">
                    <div className="text-red-500 text-center p-4">{error}</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen flex bg-[#3B5D3D]">
            <Sidebar user={user} />
            <div className="flex-1 p-4">
                <div className="bg-white h-[calc(100vh-2rem)] rounded-3xl shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-green-700 mb-6">Riwayat Deteksi</h1>

                    {predictions.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <p className="text-gray-600">Belum ada riwayat deteksi.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentItems.map((prediction) => (
                                    <div key={prediction.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="relative">
                                            <img
                                                src={prediction.image_url}
                                                alt="Prediction Result"
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <div className="mb-3">
                                                <h3 className="text-lg font-semibold text-green-700">
                                                    {prediction.label === 'Healthy' ? 'Sehat' :
                                                        prediction.label === 'Early_blight' ? 'Hawar Daun Dini' :
                                                            prediction.label === 'Late_blight' ? 'Hawar Daun Akhir' : prediction.label}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-green-600 rounded-full"
                                                            style={{ width: `${prediction.confidence * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600">
                                                        {(prediction.confidence * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {new Date(prediction.created_at).toLocaleDateString('id-ID', {
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
                            <Pagination />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;