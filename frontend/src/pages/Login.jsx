import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { Navigate } from 'react-router';

const Login = () => {
  const { user, login, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Selamat Datang di TomaTech
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistem Deteksi Penyakit Tanaman Tomat
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleLogin}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <FcGoogle className="h-5 w-5" />
            </span>
            Masuk dengan Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
