import { Route, Routes } from 'react-router';
import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Deteksi from './pages/Deteksi';
import Forum from './pages/Forum';
import History from './pages/History';
import Homepage from './pages/Homepage';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-16 min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<Homepage />} />
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
                <Forum />
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
