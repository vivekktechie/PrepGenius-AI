import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardOverview from './dashboard/DashboardOverview';
import InterviewFlow from './dashboard/InterviewFlow';
import Resources from './dashboard/Resources';
import ResumeAnalyzer from './dashboard/ResumeAnalyzer';
import SettingsPage from './dashboard/Settings';
import Sessions from './dashboard/Sessions';
import InterviewAnalytics from './dashboard/interview/InterviewAnalytics';
import { auth } from '../lib/api';
import { 
  LogOut, 
  Bell, 
  Settings as SettingsIcon, 
  User as UserIcon, 
  Sparkles,
  LayoutDashboard,
  Video,
  FileText,
  History,
  BookOpen,
  PieChart,
  Shield,
  Zap,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSession = async () => {
      const user = await auth.getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
    };
    
    loadSession();

    // Listen for real-time profile updates
    window.addEventListener('profileUpdated', loadSession);
    
    return () => {
      window.removeEventListener('profileUpdated', loadSession);
    };
  }, [navigate]);

  const handleLogout = () => {
    auth.logout();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const location = useLocation();
  const isOverview = location.pathname === '/dashboard';
  const isFullScreenMode = location.pathname.includes('/dashboard/interview/pre-check') || location.pathname.includes('/dashboard/interview/session');
  const scrollRef = useRef(null);

  // Auto-scroll to top on navigation/login
  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Cinematic Fullscreen Protocol
  useEffect(() => {
    if (isFullScreenMode) {
      // We don't force browser fullscreen here because it requires a user gesture
      // But we can ensure the document is prepared for it
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      // If we exit full screen mode in the app, try to exit browser fullscreen too
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, [isFullScreenMode]);

  const userName = user?.full_name || user?.email?.split('@')[0] || 'Genius';

  const getPageIcon = () => {
    const path = location.pathname;
    if (path.includes('/interview')) return Video;
    if (path.includes('/resume')) return FileText;
    if (path.includes('/sessions')) return History;
    if (path.includes('/resources')) return BookOpen;
    if (path.includes('/analytics')) return PieChart;
    if (path.includes('/settings')) return SettingsIcon;
    return LayoutDashboard;
  };

  const PageIcon = getPageIcon();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex relative overflow-hidden font-inter">
      {/* Dynamic Background Glows */}
      {!isFullScreenMode && (
        <>
          <div className="absolute top-0 right-0 w-[1000px] h-[600px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-accent-500/5 blur-[120px] rounded-full pointer-events-none" />
        </>
      )}

      <AnimatePresence>
        {!isFullScreenMode && (
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="z-50"
          >
            <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className={`flex-1 transition-all duration-700 overflow-hidden flex flex-col z-10 ${isFullScreenMode ? 'ml-0' : isSidebarExpanded ? 'ml-[280px]' : 'ml-[80px]'}`}>
        {/* Adaptive Command Header */}
        <AnimatePresence>
          {!isFullScreenMode && (
            <motion.header 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className={`shrink-0 transition-all duration-700 px-8 lg:px-12 ${isOverview ? 'pt-12 pb-8' : 'py-6 border-b border-white/5 bg-black/20 backdrop-blur-xl'}`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <AnimatePresence mode="wait">
                {isOverview ? (
                  <motion.div
                    key="greeting"
                    initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />
                      <span className="text-[10px] font-black text-brand-500 uppercase tracking-[0.3em]">Identity Synchronized</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white leading-[1.1] mb-1">
                      {getGreeting()}, <span className="text-gradient">{userName}.</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] opacity-80 pl-1">Strategic Dashboard • Mission Overview</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="page-title"
                    initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                    className="flex items-center gap-5"
                  >
                    <div className="w-12 h-12 rounded-[1.25rem] bg-brand-500/10 flex items-center justify-center border border-brand-500/20 shadow-inner group">
                      <PageIcon className="w-6 h-6 text-brand-400 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tight uppercase group-hover:text-brand-400 transition-colors">
                        {location.pathname.split('/').pop().replace(/-/g, ' ')}
                      </h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Zap className="w-2.5 h-2.5 text-brand-500 animate-pulse" />
                        <p className="text-[9px] font-black text-brand-500 uppercase tracking-[0.3em] opacity-90">Neural Interface Protocol</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 no-print">
                  <button 
                    onClick={() => navigate('/dashboard/settings')}
                    className="w-11 h-11 glass rounded-xl flex items-center justify-center border border-white/5 hover:border-brand-500/40 hover:bg-brand-500/10 transition-all group shadow-lg"
                  >
                    <SettingsIcon className="w-5 h-5 text-slate-400 group-hover:text-brand-400" />
                  </button>
                </div>

                <div className="h-10 w-px bg-white/10" />

                <div 
                  onClick={() => navigate('/dashboard/settings')}
                  className="flex items-center gap-5 pl-2.5 pr-5 py-2 glass rounded-[1.5rem] border border-white/10 group hover:border-brand-500/40 transition-all cursor-pointer shadow-xl"
                >
                  <div className="w-11 h-11 bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 rounded-xl flex items-center justify-center font-black text-sm shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform overflow-hidden shrink-0 border border-white/20">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      userName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="hidden lg:block min-w-[80px]">
                    <span className="block text-xs font-black text-white tracking-wide leading-none mb-1.5 group-hover:text-brand-400 transition-colors uppercase">{userName}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Online Status</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                    className="ml-3 p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                    title="Disconnect Neural Link"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.header>
          )}
        </AnimatePresence>

        {/* Neural Horizon Partition */}
        {!isFullScreenMode && isOverview && (
          <div className="px-8 lg:px-12 relative shrink-0">
            <div className="h-px bg-gradient-to-r from-brand-500/50 via-transparent to-transparent w-full relative">
              <motion.div 
                animate={{ x: ['0%', '100%', '0%'] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-32 h-[2px] bg-gradient-to-r from-transparent via-brand-400 to-transparent blur-[1px]"
              />
            </div>
          </div>
        )}

        {/* Workspace Content Viewport */}
        <div ref={scrollRef} className={`flex-1 overflow-y-auto no-scrollbar scroll-smooth ${isFullScreenMode ? 'p-0' : 'px-8 lg:px-12 py-8 lg:py-12 relative'}`}>
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/interview/*" element={<InterviewFlow />} />
            <Route path="/analytics" element={<InterviewAnalytics />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resume" element={<ResumeAnalyzer />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="*" element={
              <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-brand-500/5 flex items-center justify-center border border-brand-500/10 mb-6">
                  <Sparkles className="w-10 h-10 text-brand-500/20" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Feature Calibrating</h2>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Integrating with the neural matrix...</p>
              </div>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
