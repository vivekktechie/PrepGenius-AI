import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Video, 
  FileText, 
  History, 
  Settings, 
  User, 
  LogOut, 
  Sparkles,
  Search,
  BookOpen,
  PieChart,
  ChevronRight
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { ShieldAlert } from 'lucide-react';
import { auth } from '../lib/api';

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const userStr = localStorage.getItem('genesis_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin' || user?.full_name === 'Supreme Admin';
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Video, label: 'Start Interview', path: '/dashboard/interview' },
    { icon: FileText, label: 'Resume Analyzer', path: '/dashboard/resume' },
    { icon: History, label: 'Sessions', path: '/dashboard/sessions' },
    { icon: BookOpen, label: 'Learning Hub', path: '/dashboard/resources' },
    { icon: PieChart, label: 'Analytics', path: '/dashboard/analytics' },
  ];

  // Inject Admin Portal if user is admin
  if (isAdmin) {
    navItems.push({ icon: ShieldAlert, label: 'Admin Portal', path: '/admin' });
  }

  return (
    <motion.aside 
      initial={false}
      animate={{ 
        width: isExpanded ? 280 : 80,
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      transition={{ type: 'spring', stiffness: 350, damping: 35 }}
      className="h-screen fixed left-0 top-0 glass-dark border-r border-white/5 flex flex-col z-50 overflow-hidden select-none"
    >
      {/* Background Cinematic Glows */}
      <div className="absolute top-0 left-0 w-full h-32 bg-brand-500/5 blur-[60px] -translate-y-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-accent-500/5 blur-[60px] translate-y-16 pointer-events-none" />

      {/* Logo Section */}
      <div className="h-24 flex items-center justify-center shrink-0">
        <div className="relative">
          <Logo hideText={!isExpanded} className="scale-90 transition-transform duration-500 group-hover:scale-100" />
          {!isExpanded && (
            <motion.div 
              layoutId="logo-glow"
              className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full -z-10"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}
        </div>
      </div>

      {/* Search Protocol */}
      <div className="px-4 mb-8 shrink-0">
        <div className="relative h-12 flex items-center">
          <div className="w-12 h-12 flex items-center justify-center shrink-0 z-10 cursor-pointer">
            <Search className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.input 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                type="text" 
                placeholder="System Search..." 
                className="bg-white/5 border border-white/10 rounded-2xl h-full w-full pl-12 pr-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500/30 transition-all"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-4 space-y-3 overflow-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => `
              group relative flex items-center h-12 rounded-[1.25rem] transition-all duration-500
              ${isActive 
                ? 'bg-gradient-to-r from-brand-600/20 to-accent-600/10 text-brand-400 shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'}
            `}
          >
            {({ isActive }) => (
              <>
                {/* Precision Icon Box */}
                <div className="w-12 h-12 flex items-center justify-center shrink-0 relative z-10">
                  <item.icon className="w-5 h-5 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-black text-[11px] uppercase tracking-[0.15em] whitespace-nowrap ml-1"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active Indicator Pulse */}
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 border border-brand-500/30 rounded-[1.25rem] bg-brand-500/[0.03]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-6 bg-brand-500 rounded-r-full shadow-[0_0_15px_#3b82f6]" />
                  </motion.div>
                )}

                {/* Collapsed Tooltip */}
                {!isExpanded && (
                  <div className="absolute left-full ml-6 px-4 py-2 bg-black/80 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 border border-white/10 whitespace-nowrap shadow-2xl z-[100]">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Interface */}
      <div className="mt-auto p-4 border-t border-white/5 bg-black/20 shrink-0">
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) => `
            group relative flex items-center h-12 rounded-[1.25rem] transition-all duration-500 mb-2
            ${isActive ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}
          `}
        >
          <div className="w-12 h-12 flex items-center justify-center shrink-0 relative z-10">
            <Settings className="w-5 h-5 transition-transform group-hover:rotate-90 duration-700" />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-black text-[11px] uppercase tracking-[0.15em] ml-1"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>

        <button 
          onClick={handleLogout}
          className="w-full group relative flex items-center h-12 rounded-[1.25rem] text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-500"
        >
          <div className="w-12 h-12 flex items-center justify-center shrink-0 relative z-10">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-black text-[11px] uppercase tracking-[0.15em] ml-1"
              >
                Terminate
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Status Hub Indicator */}
      <div className="h-10 flex items-center justify-center shrink-0 cursor-pointer group">
        <motion.div
          onClick={() => setIsExpanded(!isExpanded)}
          animate={{ 
            rotate: isExpanded ? 180 : 0,
            scale: isExpanded ? 1 : 0.8
          }}
          className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-500/20 group-hover:border-brand-500/40 transition-all"
        >
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-brand-400" />
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
