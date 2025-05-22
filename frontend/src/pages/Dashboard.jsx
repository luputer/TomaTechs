import Sidebar from '@/components/Sidebar';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, AlertCircle, BarChart2, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../context/AuthContext';

// Dummy data for summary cards
const summaryDummy = {
  total: 156,
  today: 12,
  types: 6,
  serious: 27,
};

// Dummy data for trend chart
const trendDummy = [
  { date: '2025-03-10', value: 8 },
  { date: '2025-03-11', value: 10 },
  { date: '2025-03-12', value: 12 },
  { date: '2025-03-13', value: 9 },
  { date: '2025-03-14', value: 15 },
  { date: '2025-03-15', value: 12 },
];

// Dummy data for disease distribution
const distributionDummy = [
  { name: 'Busuk Daun Awal', value: 43 },
  { name: 'Busuk Daun Akhir', value: 31 },
  { name: 'Bercak Daun', value: 28 },
  { name: 'Virus Mosaik', value: 19 },
  { name: 'Busuk Buah', value: 15 },
  { name: 'Lainnya', value: 20 },
];

// Dummy data for latest detections
const latestDummy = [
  { id: 1, disease: 'Busuk Daun Awal', certainty: 96, date: '2025-03-15 14:23', status: 'Tinggi' },
  { id: 2, disease: 'Bercak Daun', certainty: 85, date: '2025-03-14 09:45', status: 'Sedang' },
  { id: 3, disease: 'Busuk Daun Akhir', certainty: 92, date: '2025-03-13 16:12', status: 'Tinggi' },
  { id: 4, disease: 'Sehat', certainty: 98, date: '2025-03-12 11:30', status: 'Rendah' },
  { id: 5, disease: 'Virus Mosaik', certainty: 78, date: '2025-03-11 10:05', status: 'Sedang' },
];

// Data statis penelitian
const researchDistribution = [
  { name: 'Busuk Daun Awal', percent: 30 },
  { name: 'Busuk Daun Akhir', percent: 25 },
  { name: 'Bercak Daun', percent: 18 },
  { name: 'Virus Mosaik', percent: 12 },
  { name: 'Busuk Buah', percent: 10 },
  { name: 'Lainnya', percent: 5 },
];

const Dashboard = () => {
    const { user } = useAuth();
    const [diseaseStats, setDiseaseStats] = useState([]);
    const [period, setPeriod] = useState('week');
    const [loadingDetect, setLoadingDetect] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDiseaseStats = async () => {
            if (!user?.id) return;

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/history/${user.id}`);
                const predictions = response.data;

                // Count occurrences of each disease
                const stats = predictions.reduce((acc, pred) => {
                    const disease = pred.predicted_class;
                    acc[disease] = (acc[disease] || 0) + 1;
                    return acc;
                }, {});

                // Transform data for chart
                const chartData = Object.entries(stats).map(([disease, count]) => ({
                    name: disease.replace(/_/g, ' '),
                    jumlah: count
                }));

                setDiseaseStats(chartData);
            } catch (error) {
                console.error('Error fetching disease statistics:', error);
            }
        };

        fetchDiseaseStats();
    }, [user?.id]);

    // Helper for status color
    const statusColor = (status) => {
      if (status === 'Tinggi') return 'bg-red-100 text-red-700';
      if (status === 'Sedang') return 'bg-yellow-100 text-yellow-700';
      return 'bg-green-100 text-green-700';
    };

    // Handler for animated detect button
    const handleDetect = () => {
      setLoadingDetect(true);
      setTimeout(() => {
        setLoadingDetect(false);
        navigate('/deteksi');
      }, 900); // 0.9s animation before redirect
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="dashboard-page"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="relative min-h-screen flex bg-[#3B5D3D]"
            >
            <Sidebar user={user} />
                <div className="flex-1 p-2 sm:p-4">
                    <div className="bg-white min-h-[calc(100vh-2rem)] rounded-3xl shadow-lg p-3 sm:p-4">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
                            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 flex items-center shadow">
                              <div className="bg-gray-100 rounded-lg p-1.5 sm:p-2 mr-2 sm:mr-3 flex items-center justify-center">
                                <BarChart2 className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600" />
                              </div>
                              <div>
                                <span className="text-gray-500 text-[10px] sm:text-xs lg:text-sm block">Total Deteksi</span>
                                <span className="text-base sm:text-xl lg:text-3xl font-bold text-green-700">{summaryDummy.total}</span>
                              </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 flex items-center shadow">
                              <div className="bg-gray-100 rounded-lg p-1.5 sm:p-2 mr-2 sm:mr-3 flex items-center justify-center">
                                <Clock className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-600" />
                              </div>
                              <div>
                                <span className="text-gray-500 text-[10px] sm:text-xs lg:text-sm block">Deteksi Hari Ini</span>
                                <span className="text-base sm:text-xl lg:text-3xl font-bold text-green-700">{summaryDummy.today}</span>
                              </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 flex items-center shadow">
                              <div className="bg-gray-100 rounded-lg p-1.5 sm:p-2 mr-2 sm:mr-3 flex items-center justify-center">
                                <Activity className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-yellow-500" />
                              </div>
                              <div>
                                <span className="text-gray-500 text-[10px] sm:text-xs lg:text-sm block">Jenis Penyakit</span>
                                <span className="text-base sm:text-xl lg:text-3xl font-bold text-green-700">{summaryDummy.types}</span>
                              </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 flex items-center shadow">
                              <div className="bg-gray-100 rounded-lg p-1.5 sm:p-2 mr-2 sm:mr-3 flex items-center justify-center">
                                <AlertCircle className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-red-500" />
                              </div>
                              <div>
                                <span className="text-gray-500 text-[10px] sm:text-xs lg:text-sm block">Kasus Serius</span>
                                <span className="text-base sm:text-xl lg:text-3xl font-bold text-green-700">{summaryDummy.serious}</span>
                              </div>
                            </div>
                        </div>

                        {/* Welcome Section & Deteksi Button */}
                        <div className="relative bg-white rounded-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 flex flex-col items-center overflow-hidden">
                          {/* Background dekoratif */}
                          <div className="absolute -top-16 -left-24 w-64 sm:w-96 h-32 sm:h-40 bg-gradient-to-tr from-green-200 to-green-400 opacity-20 rounded-full blur-2xl z-0"></div>
                          <div className="absolute -bottom-16 -right-24 w-64 sm:w-96 h-32 sm:h-40 bg-gradient-to-tr from-blue-200 to-blue-400 opacity-20 rounded-full blur-2xl z-0"></div>
                          {/* Animasi judul dan nama */}
                          <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-bold text-center mb-2 sm:mb-4 pb-2 leading-[1.3] bg-gradient-to-r from-green-700 via-green-500 to-green-700 bg-clip-text text-transparent drop-shadow-lg z-10"
                          >
                            Selamat Datang
                          </motion.h1>
                          <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9 }}
                            className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 mb-2 text-center z-10"
                          >
                            {user?.user_metadata?.full_name || 'User'}
                          </motion.h2>
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.1 }}
                            className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 text-center z-10"
                          >
                            Temukan solusi cerdas untuk tanaman tomat Anda dengan teknologi AI TomaTech
                          </motion.p>
                          {/* Tombol animasi */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2 }}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 z-10 w-full sm:w-auto"
                          >
                            <motion.button
                              whileHover={{ scale: 1.08, boxShadow: '0 4px 24px 0 rgba(16,185,129,0.25)' }}
                              whileTap={{ scale: 0.97 }}
                              onClick={handleDetect}
                              disabled={loadingDetect}
                              className={`w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-6 sm:px-8 lg:px-10 py-2 sm:py-3 lg:py-4 rounded-full shadow-lg text-base sm:text-lg lg:text-xl flex items-center justify-center gap-2 transition-all duration-200 ${loadingDetect ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              {loadingDetect ? (
                                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : null}
                              {loadingDetect ? 'Menuju Deteksi...' : 'Mulai Deteksi'}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.08, boxShadow: '0 4px 24px 0 rgba(59,130,246,0.25)' }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => navigate('/history')}
                              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 sm:px-8 lg:px-10 py-2 sm:py-3 lg:py-4 rounded-full shadow-lg text-base sm:text-lg lg:text-xl flex items-center justify-center gap-2 transition-all duration-200"
                            >
                              Cek Riwayat
                            </motion.button>
                          </motion.div>
                        </div>

                        {/* Grid: Statistik Penyakit & Distribusi Penyakit */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                            {/* Statistik Penyakit Terdeteksi (BACKEND) */}
                            <div className="lg:col-span-2">
                                <div className="bg-gray-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow h-full flex flex-col">
                                    <h2 className="text-sm sm:text-base lg:text-xl font-bold text-green-700 mb-2 sm:mb-3 text-center">
                                        Statistik Penyakit Terdeteksi
                                    </h2>
                                    <div className="w-full h-[200px] sm:h-[250px] mt-2 flex-1">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={diseaseStats}
                                                margin={{
                                                    top: 20,
                                                    right: 20,
                                                    left: 20,
                                                    bottom: 60
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="name"
                                                    angle={-45}
                                                    textAnchor="end"
                                                    interval={0}
                                                    height={60}
                                                    tick={{ fontSize: 10 }}
                                                />
                                                <YAxis tick={{ fontSize: 10 }} />
                                                <Tooltip />
                                                <Legend wrapperStyle={{ fontSize: 10 }} />
                                                <Bar dataKey="jumlah" name="Jumlah Kasus" fill="#2e7d32" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                            {/* Distribusi Penyakit + Filter Periode */}
                            <div className="flex flex-col gap-3 sm:gap-4">
                                {/* Filter Periode */}
                                <div className="flex justify-end mb-0">
                                    <div className="flex gap-1 sm:gap-2 bg-gray-100 rounded-lg p-1 w-full justify-center">
                                        {['day','week','month','year'].map(opt => (
                                            <button
                                                key={opt}
                                                className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium capitalize transition ${period===opt ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-green-100'}`}
                                                onClick={()=>setPeriod(opt)}
                                            >
                                                {opt.charAt(0).toUpperCase()+opt.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Distribusi Penyakit (Penelitian) */}
                                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 shadow flex flex-col">
                                    <span className="font-semibold text-green-700 mb-2 text-sm sm:text-base">Distribusi Penyakit Tomat</span>
                                    <div className="flex-1 flex flex-col gap-2 sm:gap-3">
                                        {researchDistribution.map((item, idx) => (
                                            <div key={item.name} className="mb-1">
                                                <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-1">
                                                    <span>{item.name}</span>
                                                    <span className="font-semibold text-green-700">{item.percent}%</span>
                                                </div>
                                                <div className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-full">
                                                    <div
                                                        className="h-1.5 sm:h-2 rounded-full bg-green-500 transition-all"
                                                        style={{ width: `${item.percent}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2">Sumber: Penelitian UGM, IPB, FAO</div>
                                </div>
                            </div>
                        </div>

                        {/* Tren Deteksi Penyakit (Full Width) */}
                        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 shadow flex flex-col mb-4 sm:mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-green-700 text-sm sm:text-base">Tren Deteksi Penyakit</span>
                                <a href="#" className="text-green-600 text-xs sm:text-sm font-medium hover:underline">Lihat Detail</a>
                            </div>
                            <div className="flex-1 flex items-center justify-center min-h-[150px] sm:min-h-[180px]">
                                <ResponsiveContainer width="100%" height={180}>
                                    <LineChart data={trendDummy} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                        <XAxis dataKey="date" tick={{ fontSize: 10 }}/>
                                        <YAxis tick={{ fontSize: 10 }}/>
                                        <Tooltip />
                                        <Line type="monotone" dataKey="value" stroke="#478800" strokeWidth={3} dot={{ r: 3 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="text-xs text-gray-500 text-center mt-2">Data berdasarkan periode: <span className="capitalize">{period}</span></div>
                        </div>

                        {/* Latest Detection Table */}
                        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 shadow">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-green-700 text-sm sm:text-base">Deteksi Terbaru</span>
                                <a href="#" className="text-green-600 text-xs sm:text-sm font-medium hover:underline">Lihat Semua</a>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-xs sm:text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-600 border-b">
                                            <th className="py-2 px-2">ID</th>
                                            <th className="py-2 px-2">PENYAKIT</th>
                                            <th className="py-2 px-2">KEPASTIAN</th>
                                            <th className="py-2 px-2">TANGGAL</th>
                                            <th className="py-2 px-2">STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {latestDummy.map((row, idx) => (
                                            <tr key={row.id} className="border-b last:border-0">
                                                <td className="py-2 px-2 font-semibold text-gray-700">#{row.id}</td>
                                                <td className="py-2 px-2">{row.disease}</td>
                                                <td className="py-2 px-2">{row.certainty}%</td>
                                                <td className="py-2 px-2">{row.date}</td>
                                                <td className="py-2 px-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(row.status)}`}>{row.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Dashboard;