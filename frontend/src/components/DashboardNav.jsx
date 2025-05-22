import { Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardNav = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <nav className="bg-[#E9E9E9] text-black p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img
                        src="/images/logos/logo.png"
                        alt="TomaTech Logo"
                        className="h-10 w-10 rounded-full"
                    />
                    <div>
                        <h1 className="text-xl font-semibold">Dashboard</h1>
                        <p className="text-sm text-gray-600">Welcome to TomaTech</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <Home className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default DashboardNav;