import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Bisa diganti dengan spinner/loader sesuai kebutuhan
    return <div className="flex items-center justify-center min-h-screen bg-white text-green-700 text-xl font-bold">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;