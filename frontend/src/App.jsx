import { Route, Routes, useLocation } from 'react-router';
import { Toaster } from 'sonner';
import './App.css';
import DashboardFooter from './components/DashboardFooter';
import DashboardNav from './components/DashboardNav';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/navbar';
import { AuthProvider } from './context/AuthContext';
import About from './pages/About';
import Blog from './pages/Blog';
import Dashboard from './pages/Dashboard';
import Deteksi from './pages/Deteksi';
import History from './pages/History';
import Homepage from './pages/Homepage';
import NotFound from './pages/NotFound';
import Team from './pages/Team';
import TomaChat from './pages/TomaChat';
import Contact from './pages/contact';
import Chatbot from './components/Chatbot';
import Forum from './pages/Forum';

const App = () => {
  const location = useLocation();
  const isAuthPage = ['/dashboard', '/deteksi', '/history', '/chats', '/forum'].includes(location.pathname);

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
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </>
        ) : (
          <>
            <DashboardNav />
            <main className="min-h-[calc(100vh-8rem)]">
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
                <Route path="/forum" element={
                  <PrivateRoute>
                    <Forum />
                  </PrivateRoute>
                } />
              </Routes>
            </main>
            <DashboardFooter />
          </>
        )}
        <Toaster
          position="top-right"
          expand={false}
          richColors
        />
        <Chatbot />
      </div>
    </AuthProvider>
  );
};

export default App;
