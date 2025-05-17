import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="relative min-h-screen flex bg-[#3B5D3D]">
      <Sidebar user={user} />
      <div className="flex-1 p-4">
        <div className="bg-white min-h-[calc(100vh-2rem)] rounded-3xl shadow-lg p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;