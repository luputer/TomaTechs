import './App.css'
import { Route, Routes } from 'react-router';
import Homepage from './pages/Homepage';
import About from './pages/About';
import Dashbord from './pages/Dashbord';
import Login from './pages/Login';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashbord />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
