import './App.css'
import React from 'react';
import { Routes, Route } from 'react-router';
import Navbar from './components/navbar';
import Homepage from './pages/Homepage';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Deteksi from './pages/Deteksi';
import History from './pages/History';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Team from './pages/Team';

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-16 min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/Team" element={<Team />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/deteksi" element={
              <PrivateRoute>
                <Deteksi />
              </PrivateRoute>
            } />
            <Route path="/history" element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
