import { Route, Routes, useLocation } from 'react-router';
import './App.css';
import Footer from './components/Footer';
import Navbar from './components/navbar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Deteksi from './pages/Deteksi';
import History from './pages/History';
import Homepage from './pages/Homepage';
import NotFound from './pages/NotFound';
import Team from './pages/Team';
import TomaChat from './pages/TomaChat';
import { Toaster } from 'sonner';

const App = () => {
  const location = useLocation();
  const isAuthPage = ['/dashboard', '/deteksi', '/history', '/chats'].includes(location.pathname);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground">
        {!isAuthPage ? (
          <>
            <Navbar />
            <main className="pt-16 min-h-[calc(100vh-4rem)]">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/Team" element={<Team />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </>
        ) : (
          <main className="min-h-screen">
            <Routes>
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
              <Route path="/chats" element={
                <PrivateRoute>
                  <TomaChat />
                </PrivateRoute>
              } />
            </Routes>
          </main>
        )}
        <Toaster
          position="top-right"
          expand={false}
          richColors
        />
      </div>
    </AuthProvider>
  );
};

export default App;
