import { ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Add animation delay style
import "./styles.css";

const History = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const [showAlert, setShowAlert] = useState({ show: false, message: '', type: '' });
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);

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

    const handleDeleteClick = (id) => {
        if (!user?.id) {
            setShowAlert({
                show: true,
                message: 'User tidak terautentikasi',
                type: 'error'
            });
            return;
        }
        setSelectedDeleteId(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedDeleteId) return;

        try {
            const apiUrl = 'http://localhost:8080';
            const response = await fetch(`${apiUrl}/delete/${selectedDeleteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user.id
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Gagal menghapus prediksi');
            }

            // Update state to remove deleted item
            setPredictions(predictions.filter(pred => pred.id !== selectedDeleteId));
            setShowAlert({
                show: true,
                message: data.message || 'Data berhasil dihapus',
                type: 'success'
            });

            // Hide alert after 3 seconds
            setTimeout(() => {
                setShowAlert({ show: false, message: '', type: '' });
            }, 3000);

        } catch (err) {
            console.error('Error deleting prediction:', err);
            setShowAlert({
                show: true,
                message: err.message,
                type: 'error'
            });
        } finally {
            setDeleteDialogOpen(false);
            setSelectedDeleteId(null);
        }
    };

    const handlePreview = (prediction) => {
        setSelectedPrediction(prediction);
        setIsPreviewOpen(true);
    };

    const handleEdit = (id) => {
        // Navigate to edit page
        navigate(`/edit/${id}`);
    };

    // Add Alert component at the top of the content
    const Alert = ({ message, type }) => (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}>
            {message}
        </div>
    );

    if (loading) return (
        <div className="relative min-h-screen flex bg-[#3B5D3D]">
            <Sidebar user={user} />
            <div className="flex-1 p-4">
                <div className="bg-white h-[calc(100vh-2rem)] rounded-3xl shadow-lg p-6 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-[#3B5D3D] border-t-transparent rounded-full animate-spin"></div>
                            <div className="w-16 h-16 border-4 border-[#3B5D3D] border-l-transparent rounded-full animate-spin absolute top-0 left-0 animation-delay-150"></div>
                        </div>
                        <p className="text-[#3B5D3D] text-lg font-medium">Memuat Data...</p>
                    </div>
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
        <div className="relative min-h-screen ml-2 flex bg-[#3B5D3D]">
            <Sidebar user={user} />
            <div className="flex-1 p-4">
                {showAlert.show && (
                    <Alert message={showAlert.message} type={showAlert.type} />
                )}
                <div className="bg-white h-[calc(100vh-2rem)]  rounded-3xl shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-green-700 mb-6">Riwayat Deteksi</h1>

                    {predictions.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <p className="text-gray-600">Belum ada riwayat deteksi.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-[calc(85%-2rem)]">
                            <div className="flex-grow overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {currentItems.map((prediction) => (
                                        <div key={prediction.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="relative">
                                                <img
                                                    src={prediction.image_url}
                                                    alt="Prediction Result"
                                                    className="w-full h-48 object-cover"
                                                />
                                                <div className="absolute top-2 right-2 flex gap-2">
                                                    <button
                                                        onClick={() => handlePreview(prediction)}
                                                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                                        title="Preview"
                                                    >
                                                        <Eye className="w-4 h-4 text-blue-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(prediction.id)}
                                                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="mb-3">
                                                    <h3 className="text-lg font-semibold text-green-700">
                                                        {prediction.predicted_class}
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
                            </div>
                            <div className="mt-auto pt-6 border-t">
                                <Pagination />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className={"bg-white"}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus data ini?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <AlertDialogContent className="max-w-3xl bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl text-center text-[#3B5D3D]">
                            Hasil Deteksi Penyakit Tomat
                        </AlertDialogTitle>
                    </AlertDialogHeader>

                    {selectedPrediction && (
                        <div className="mt-4">
                            <div className="text-center mb-6">
                                <img
                                    src={selectedPrediction.image_url}
                                    alt="Hasil Deteksi"
                                    className="max-w-full h-auto rounded-lg mx-auto"
                                />
                            </div>

                            <div className="bg-blac p-6 rounded-lg">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-[#3B5D3D] mb-2">
                                        Hasil Deteksi:
                                    </h3>
                                    <p className="text-xl font-bold text-[#3B5D3D]">
                                        {selectedPrediction.predicted_class}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-[#3B5D3D] mb-2">
                                        Tingkat Akurasi:
                                    </h3>
                                    <div className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div className="w-full bg-gray-200 rounded-full h-4">
                                                <div
                                                    className="h-full bg-[#3B5D3D] rounded-full transition-all duration-300"
                                                    style={{ width: `${(selectedPrediction.confidence * 100).toFixed(0)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-lg font-semibold text-[#3B5D3D] ml-4">
                                                {(selectedPrediction.confidence * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right text-sm text-gray-600">
                                    Waktu Deteksi: {new Date(selectedPrediction.created_at).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-800">
                            Tutup
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default History;