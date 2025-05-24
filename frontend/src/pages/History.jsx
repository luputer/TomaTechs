import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AxiosInstance from "@/lib/axios";
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import Sidebar from "../components/Sidebar";
import { useAuth } from '../context/AuthContext';
import { diseaseInfo } from '../data/diseaseInfo';



// Add animation delay style
import "./styles.css";

const History = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedPrediction, setSelectedPrediction] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);

    // Mapping penyakit ke deskripsi dan penanganan
  

    useEffect(() => {
        if (user?.id) {
            fetchHistory();
        } else {
            setLoading(false);
        }
    }, [user?.id]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const { data } = await AxiosInstance.get(`/history/${user.id}`);
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
            toast.error('User tidak terautentikasi');
            return;
        }
        setSelectedDeleteId(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedDeleteId) return;

        try {
            const res = await AxiosInstance.delete(`/delete/${selectedDeleteId}`, {
                data: { user_id: user.id }
            });
            const data = res.data;

            if (res.status !== 200) {
                throw new Error(data.error || 'Gagal menghapus prediksi');
            }

            setPredictions(predictions.filter(pred => pred.id !== selectedDeleteId));
            toast.success(data.message || 'Data berhasil dihapus');

        } catch (err) {
            console.error('Error deleting prediction:', err);
            toast.error(err.message);
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

    if (error) {
        toast.error(error);
        return (
            <div className="relative min-h-screen flex bg-[#3B5D3D]">
                <Sidebar user={user} />
                <div className="flex-1 p-4">
                    <div className="bg-white h-[calc(100vh-2rem)] rounded-3xl shadow-lg p-6">
                        <div className="text-red-500 text-center p-4">Terjadi kesalahan saat memuat data</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-[#3B5D3D] min-h-screen">
            <Sidebar user={user} />
            <div className="flex-1">
                <div className="bg-white h-[calc(100vh-2rem)] m-4 rounded-3xl shadow-lg">
                    <div className="relative pt-4 pb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent opacity-50 rounded-t-3xl"></div>
                        <div className="relative">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7 }}
                                className="text-4xl lg:text-5xl font-bold text-center"
                            >
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">
                                    Riwayat Deteksi
                                </span>
                            </motion.h1>
                            <p className="text-center text-gray-600 mt-2">
                                Lihat dan kelola hasil deteksi penyakit tomat Anda
                            </p>
                        </div>
                    </div>

                    {predictions.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <p className="text-gray-600">Belum ada riwayat deteksi.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col h-[calc(85%-2rem)]">
                            <div className="flex-grow overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                                    {currentItems.map((prediction) => (
                                        <div key={prediction.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                                            <div className="relative aspect-[5/4]">
                                                <img
                                                    src={prediction.image_url}
                                                    alt="Prediction Result"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-3 right-3 flex gap-2">
                                                    <button
                                                        onClick={() => handlePreview(prediction)}
                                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                                                        title="Preview"
                                                    >
                                                        <Eye className="w-4 h-4 text-blue-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(prediction.id)}
                                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="mb-3">
                                                    <h3 className="text-lg font-semibold text-green-700 mb-2">
                                                        {diseaseInfo[prediction.predicted_class]?.name || prediction.predicted_class}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-green-600 rounded-full transition-all duration-300"
                                                                style={{ width: `${prediction.confidence * 100}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-600 min-w-[45px] text-right">
                                                            {(prediction.confidence * 100).toFixed(2)}%
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {diseaseInfo[prediction.predicted_class]?.description}
                                                    </p>
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

            {/* Preview Modal */}
            <AlertDialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <AlertDialogContent className="bg-white max-w-screen-lg md:max-w-screen-xl w-full max-h-[90vh] overflow-y-auto p-4 md:p-8">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl md:text-3xl text-center text-[#3B5D3D] font-bold mb-4 md:mb-6">
                            Hasil Deteksi Penyakit Tomat
                        </AlertDialogTitle>
                    </AlertDialogHeader>

                    {selectedPrediction && (
                        <div className="mt-2 md:mt-4 border border-gray-200 rounded-lg p-4 md:p-6 shadow-md">
                            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                {/* Image Section - Left Side */}
                                <div className="w-full md:w-1/2 flex justify-center items-start p-2">
                                    <img
                                        src={selectedPrediction.image_url}
                                        alt="Hasil Deteksi"
                                        className="w-full h-auto rounded-lg object-contain max-h-[40vh] md:max-h-[50vh] shadow"
                                    />
                                </div>

                                {/* Content Section - Right Side */}
                                <div className="w-full md:w-1/2 bg-white p-4 md:p-6 rounded-lg space-y-4 md:space-y-6 shadow-inner">
                                    <div>
                                        <h3 className="text-lg md:text-xl font-semibold text-[#3B5D3D] mb-2 border-b border-gray-200 pb-2">
                                            Penyakit:
                                        </h3>
                                        <p className="text-xl md:text-2xl font-bold text-green-700">
                                            {diseaseInfo[selectedPrediction.predicted_class]?.name || selectedPrediction.predicted_class}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg md:text-xl font-semibold text-[#3B5D3D] mb-2 border-b border-gray-200 pb-2">
                                            Tingkat Akurasi:
                                        </h3>
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div className="w-full bg-gray-200 rounded-full h-4">
                                                    <div
                                                        className="h-full bg-green-600 rounded-full transition-all duration-300"
                                                        style={{ width: `${(selectedPrediction.confidence * 100).toFixed(0)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-lg md:text-xl font-semibold text-[#3B5D3D] ml-4">
                                                    {(selectedPrediction.confidence * 100).toFixed(2)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg md:text-xl font-semibold text-[#3B5D3D] mb-2 border-b border-gray-200 pb-2">
                                            Deskripsi:
                                        </h3>
                                        <p className="text-gray-700 text-sm md:text-base">
                                            {diseaseInfo[selectedPrediction.predicted_class]?.description || 'Deskripsi tidak tersedia'}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg md:text-xl font-semibold text-[#3B5D3D] mb-2 border-b border-gray-200 pb-2">
                                            Penanganan:
                                        </h3>
                                        <p className="text-gray-700 whitespace-pre-line text-sm md:text-base">
                                            {diseaseInfo[selectedPrediction.predicted_class]?.treatment || 'Informasi penanganan tidak tersedia'}
                                        </p>
                                    </div>

                                    <div className="text-right text-xs md:text-sm text-gray-600 mt-4 pt-4 border-t border-gray-200">
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