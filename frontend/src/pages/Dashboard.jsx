import Sidebar from '@/components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [diseaseStats, setDiseaseStats] = useState([]);

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

    return (
        <div className="relative min-h-screen flex bg-[#3B5D3D]">
            <Sidebar user={user} />
            <div className="flex-1 p-4 overflow-hidden">
                <div className="bg-white h-[calc(100vh-2rem)] rounded-3xl shadow-lg p-6 flex flex-col overflow-auto">
                    <div className="flex-grow">
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-white rounded-lg p-4 md:p-6 mb-6">
                                <h1 className="text-xl md:text-4xl font-bold text-[#2e7d32] mb-2 text-center">
                                    Selamat Datang
                                </h1>
                                <h2 className="text-base md:text-xl font-semibold text-gray-800 mb-4 md:mb-8 text-center">
                                    {user?.user_metadata?.full_name || 'User'}
                                </h2>

                                {/* Disease Statistics Chart */}
                                <div className="bg-gray-100 rounded-xl p-3 md:p-6 mb-6 shadow">
                                    <h2 className="text-base md:text-xl font-bold text-green-700 mb-3 text-center">
                                        Statistik Penyakit Terdeteksi
                                    </h2>
                                    <div className="w-full h-[250px] mt-2">
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
                                                    tick={{ fontSize: 12 }}
                                                />
                                                <YAxis tick={{ fontSize: 12 }} />
                                                <Tooltip />
                                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                                <Bar dataKey="jumlah" name="Jumlah Kasus" fill="#2e7d32" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Hero Section */}
                                <div className="bg-gray-100 rounded-xl py-4 md:py-6 px-2 md:px-4 mb-4 flex flex-col items-center shadow">
                                    <h2 className="text-base md:text-xl font-bold text-green-700 mb-2 text-center">
                                        Deteksi Penyakit Daun Tomat dengan AI
                                    </h2>
                                    <p className="text-sm md:text-base text-gray-700 text-center max-w-xs md:max-w-lg">
                                        Unggah foto daun tomat dan temukan solusinya secara otomatis dengan teknologi AI
                                    </p>
                                    <a
                                        href="/deteksi"
                                        className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 md:px-6 py-2 rounded-full shadow transition text-sm md:text-base"
                                    >
                                        Mulai Deteksi
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;