import { Route, Routes, useLocation } from 'react-router';
import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
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

const App = () => {
  const location = useLocation();
  const isAuthPage = ['/dashboard', '/deteksi', '/history', '/forum'].includes(location.pathname);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground">
        {!isAuthPage && <Navbar />}
        <main className={!isAuthPage ? "pt-16 min-h-[calc(100vh-4rem)]" : "min-h-screen"}>
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
            <Route path="/forum" element={
              <PrivateRoute>
                <TomaChat />
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isAuthPage && <Footer />}
      </div>
    </AuthProvider>
  );
};

export default App;
