import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AdminPortal from './pages/AdminPortal';
import { AnimatePresence } from 'framer-motion';
import { CMSProvider } from './context/CMSContext';

function App() {
  return (
    <CMSProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/admin/*" element={<AdminPortal />} />
          </Routes>
        </AnimatePresence>
      </Router>
    </CMSProvider>
  );
}

export default App;
