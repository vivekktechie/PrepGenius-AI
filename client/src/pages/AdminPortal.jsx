import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { auth, admin } from '../lib/api';
import { 
  Users, 
  Database, 
  Settings, 
  LogOut, 
  ShieldAlert, 
  Globe, 
  LayoutGrid,
  Bell,
  Search,
  Activity,
  Cpu,
  Layers,
  Terminal,
  Zap,
  Radio,
  Clock,
  Lock,
  ShieldCheck
} from 'lucide-react';

// Sub-pages
import AdminOverview from './admin/AdminOverview';
import UserManagement from './admin/UserManagement';
import ResourceManager from './admin/ResourceManager';
import CMSManager from './admin/CMSManager';
import SystemControl from './admin/SystemControl';

const AdminPortal = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [lockPassword, setLockPassword] = useState('');
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [newSecurityKey, setNewSecurityKey] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [time, setTime] = useState(new Date());
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: '', role: '' });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const checkAdmin = async () => {
      const currentUser = await auth.getCurrentUser();
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.full_name !== 'Supreme Admin')) {
        navigate('/dashboard');
        return;
      }
      setUser(currentUser);
      setProfileForm({ full_name: currentUser.full_name, role: 'Admin' });
      setLoading(false);
      fetchNotifications();
    };
    checkAdmin();
    return () => clearInterval(timer);
  }, [navigate]);

  const handleUpdateSecurityKey = async (e) => {
    e.preventDefault();
    try {
      await admin.updateSecurityKey(newSecurityKey);
      setUser({ ...user, lock_key: newSecurityKey });
      setShowSecurityModal(false);
      setNewSecurityKey('');
      alert('NEURAL SECURITY KEY UPDATED.');
    } catch (err) {
      alert(`FAILED TO MODULATE SECURITY KEY: ${err.response?.data?.error || err.message}`);
    }
  };

  const unlock = (e) => {
    e?.preventDefault();
    // Verify against user's stored lock_key
    if (lockPassword === (user?.lock_key || 'admin')) {
      setIsLocked(false);
      setLockPassword('');
    } else {
      alert('INVALID SECURITY KEY');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await auth.updateProfile({ full_name: profileForm.full_name });
      setUser({ ...user, full_name: profileForm.full_name });
      setShowProfileModal(false);
    } catch (err) {
      alert('Neural link failed during identity modulation.');
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await admin.getNotifications();
      setNotifications(data.notifications);
    } catch (err) {
      console.error('Telemetry Error:', err);
    }
  };

  const handleMarkRead = async () => {
    try {
      await admin.markNotificationsRead();
      fetchNotifications();
      setShowNotifications(false);
    } catch (err) {
      console.error('Mark Read Error:', err);
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#030712] flex items-center justify-center">
       <div className="space-y-4 text-center">
          <Zap className="w-12 h-12 text-brand-500 animate-pulse mx-auto shadow-[0_0_20px_rgba(34,211,238,0.2)]" />
          <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.5em]">Authorizing Clearance...</p>
       </div>
    </div>
  );

  const sidebarItems = [
    { id: 'overview', label: 'Tactical Hub', icon: LayoutGrid, path: '/admin' },
    { id: 'users', label: 'Operative DB', icon: Users, path: '/admin/users' },
    { id: 'resources', label: 'Neural Assets', icon: Database, path: '/admin/resources' },
    { id: 'cms', label: 'Matrix Control', icon: Settings, path: '/admin/cms' },
    { id: 'control', label: 'System Control', icon: ShieldAlert, path: '/admin/control' }
  ];

  const activeItem = sidebarItems.find(item => item.path === location.pathname) || sidebarItems[0];

  return (
    <div className="h-screen bg-[#030712] text-slate-100 flex font-inter overflow-hidden selection:bg-brand-500/30">
      {/* 3D Background Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#22d3ee 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      
      {/* Supreme Admin Sidebar - Cyberpunk Slate */}
      <aside className="w-64 bg-[#070b14] border-r border-brand-500/10 flex flex-col z-50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/[0.02] to-transparent pointer-events-none" />
        
        <div className="p-6 py-8 border-b border-white/5 relative">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)] border border-brand-400/20 group cursor-pointer relative overflow-hidden">
                <ShieldAlert className="w-6 h-6 text-black relative z-10" />
             </div>
             <div>
                <h1 className="text-lg font-black tracking-tighter text-white">SUPREME <span className="text-brand-500">LINK</span></h1>
                <p className="text-[9px] font-black text-brand-500/60 uppercase tracking-[0.3em]">Administrator Level</p>
             </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-1.5 mt-4">
          {sidebarItems.map((item) => (
            <Link 
              key={item.id} 
              to={item.path}
              className={`
                flex items-center gap-4 px-6 py-4 rounded-xl transition-all group relative overflow-hidden
                ${location.pathname === item.path 
                  ? 'bg-brand-500/5 text-brand-500 border border-brand-500/20' 
                  : 'text-slate-500 hover:bg-white/[0.02] hover:text-white'}
              `}
            >
              {location.pathname === item.path && (
                <motion.div layoutId="nav-glow" className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent pointer-events-none" />
              )}
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${location.pathname === item.path ? 'text-brand-500' : 'text-slate-600'}`} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.label}</span>
              {location.pathname === item.path && (
                <div className="ml-auto w-1.5 h-1.5 bg-brand-500 rounded-full shadow-[0_0_8px_#22d3ee]" />
              )}
            </Link>
          ))}
        </div>

        {/* System Health HUD */}
        <div className="p-6 space-y-6">
           <div className="p-5 bg-black/40 border border-white/5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Neural Link</span>
                 </div>
                 <span className="text-[8px] font-black text-emerald-500 uppercase">Stable</span>
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-brand-500" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">TiDB Sync</span>
                 </div>
                 <span className="text-[8px] font-black text-brand-500 uppercase">99.9%</span>
              </div>
           </div>

           <button 
             onClick={() => auth.logout()}
             className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all font-black text-[10px] uppercase tracking-[0.2em] group"
           >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Sever Connection
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#030712]">
        {/* Supreme HUD Header */}
        <header className="h-32 border-b border-white/5 bg-[#070b14]/80 backdrop-blur-3xl flex items-center justify-between px-10 z-40 relative">
           <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/20 to-transparent w-full" />
           
           <div className="flex items-center gap-8">
              <div className="w-16 h-16 rounded-[1.5rem] bg-brand-500/5 border border-brand-500/20 flex items-center justify-center relative group">
                 <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                 <activeItem.icon className="w-8 h-8 text-brand-500 relative z-10" />
              </div>
              <div>
                 <div className="flex items-center gap-3 mb-1">
                    <Terminal className="w-3.5 h-3.5 text-brand-500" />
                    <h2 className="text-3xl font-black tracking-tighter uppercase text-white leading-none">{activeItem.label}.</h2>
                 </div>
                 <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-brand-500 uppercase tracking-[0.4em]">Protocol Sync 0x8F9</span>
                    <div className="h-2 w-px bg-white/10" />
                    <div className="flex items-center gap-2">
                       <Clock className="w-3 h-3 text-slate-600" />
                       <span className="text-[9px] font-black text-slate-500 tabular-nums uppercase">{time.toLocaleTimeString()}</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-10">
              {/* Real-time Ticker */}
              <div className="hidden xl:flex items-center gap-8 px-8 py-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <div className="text-center">
                    <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Live Load</span>
                    <span className="block text-xs font-black text-brand-500 tabular-nums">12.4ms</span>
                 </div>
                 <div className="w-px h-6 bg-white/10" />
                 <div className="text-center">
                    <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">DB Nodes</span>
                    <span className="block text-xs font-black text-emerald-500 tabular-nums">Online</span>
                 </div>
              </div>

              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-6 pr-6 border-r border-white/10">
                    <div className="relative group" ref={notificationRef}>
                       <button onClick={() => setShowNotifications(!showNotifications)}>
                          <Bell className={`w-6 h-6 transition-colors ${notifications.some(n => !n.is_read) ? 'text-brand-500' : 'text-slate-500 hover:text-brand-500'}`} />
                          {notifications.some(n => !n.is_read) && (
                             <div className="absolute -top-1 -right-1 w-2 h-2 bg-brand-500 rounded-full shadow-[0_0_10px_#22d3ee]" />
                          )}
                       </button>

                       <AnimatePresence>
                          {showNotifications && (
                             <motion.div 
                               initial={{ opacity: 0, y: 10, scale: 0.95 }}
                               animate={{ opacity: 1, y: 0, scale: 1 }}
                               exit={{ opacity: 0, y: 10, scale: 0.95 }}
                               className="absolute right-0 mt-6 w-96 bg-[#070b14] border border-brand-500/20 rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden z-[100]"
                             >
                                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                   <span className="text-[10px] font-black text-white uppercase tracking-widest">Intelligence Feed</span>
                                   <button onClick={handleMarkRead} className="text-[8px] font-black text-brand-500 uppercase hover:underline">Clear Matrix</button>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                                   {notifications.filter(n => !n.is_read).length > 0 ? notifications.filter(n => !n.is_read).map((n) => (
                                      <div key={n.id} className="p-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                         <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-2 h-2 rounded-full ${n.type === 'REGISTRATION' ? 'bg-emerald-500' : 'bg-brand-500'}`} />
                                            <span className="text-[9px] font-black text-white uppercase tracking-tight">{n.title}</span>
                                         </div>
                                         <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">{n.message}</p>
                                         <span className="block text-[7px] font-black text-slate-700 mt-2 uppercase">{new Date(n.created_at).toLocaleString()}</span>
                                      </div>
                                   )) : (
                                      <div className="p-10 text-center text-slate-600">
                                         <Radio className="w-8 h-8 mx-auto mb-4 opacity-20" />
                                         <p className="text-[9px] font-black uppercase tracking-widest">No Active Signals</p>
                                      </div>
                                   )}
                                </div>
                             </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                     <div className="group cursor-pointer" onClick={() => setIsLocked(true)}>
                        <Lock className="w-6 h-6 text-slate-500 hover:text-brand-500 transition-colors" />
                     </div>
                  </div>
                  <div className="flex items-center gap-5 group cursor-pointer" onClick={() => setShowProfileModal(true)}>
                     <div className="text-right">
                        <span className="block text-xs font-black text-white uppercase tracking-tighter group-hover:text-brand-500 transition-colors">{user?.full_name}</span>
                        <span className="block text-[8px] font-black text-brand-500 uppercase tracking-[0.3em]">Admin</span>
                     </div>
                     <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center font-black text-black shadow-[0_0_20px_rgba(34,211,238,0.3)] border border-white/20 transition-transform group-hover:scale-105">
                        {user?.full_name?.charAt(0).toUpperCase()}
                     </div>
                  </div>
              </div>
           </div>
        </header>

        {/* Supreme Viewport Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-10 relative">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-amber-500/[0.03] blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-rose-500/[0.02] blur-[150px] pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
               <Route path="/" element={<AdminOverview />} />
               <Route path="/users" element={<UserManagement />} />
               <Route path="/resources" element={<ResourceManager />} />
               <Route path="/cms" element={<CMSManager />} />
               <Route path="/control" element={<SystemControl />} />
            </Routes>
          </AnimatePresence>
        </div>

        {/* Global Footer Status HUD */}
        <footer className="h-10 bg-[#080808] border-t border-amber-500/10 px-16 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Operational Intelligence: Active</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Build ID: PG-SUPREME-V2.5</span>
           </div>
           <div className="flex items-center gap-6 text-[8px] font-black text-slate-700 uppercase tracking-widest">
              <span>Security Protocols: Enforced</span>
              <div className="w-px h-3 bg-white/10" />
              <span>PrepGenius AI Neural Network</span>
           </div>
        </footer>
      </main>

      {/* Supreme Lockdown Overlay */}
      <AnimatePresence>
         {isLocked && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-[#030712]/95 backdrop-blur-3xl z-[9999] flex items-center justify-center p-6"
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="w-full max-w-md bg-[#070b14] border border-brand-500/20 rounded-[3rem] p-12 text-center shadow-[0_50px_100px_rgba(0,0,0,0.9)] relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.03] to-transparent pointer-events-none" />
                  
                  <div className="w-24 h-24 bg-brand-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-brand-500/20 relative group">
                     <div className="absolute inset-0 bg-brand-500/20 blur-2xl rounded-full animate-pulse" />
                     <Lock className="w-10 h-10 text-brand-500 relative z-10" />
                  </div>

                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Supreme Lockdown</h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10 leading-relaxed">Identity verification required to restore administrative neural link</p>

                  <form onSubmit={unlock} className="space-y-6">
                     <div className="relative group">
                        <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500" />
                        <input 
                           autoFocus
                           type="password"
                           placeholder="ENTER SECURITY KEY..."
                           value={lockPassword}
                           onChange={(e) => setLockPassword(e.target.value)}
                           className="w-full pl-16 pr-8 py-5 bg-white/[0.02] border border-white/5 rounded-2xl text-[12px] font-black text-white focus:border-brand-500/50 focus:outline-none transition-all tracking-[0.3em] bg-transparent"
                        />
                     </div>
                     <button 
                        type="submit"
                        className="w-full py-5 bg-brand-500 text-black rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] hover:bg-brand-400 transition-all shadow-2xl shadow-brand-500/20 active:scale-95"
                     >
                        INITIALIZE UNLOCK
                     </button>
                  </form>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Admin Identity Modulator Modal */}
      <AnimatePresence>
         {showProfileModal && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-[#030712]/90 backdrop-blur-2xl z-[9999] flex items-center justify-center p-6"
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="w-full max-w-lg bg-[#070b14] border border-brand-500/20 rounded-[3rem] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.9)] relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.03] to-transparent pointer-events-none" />
                  
                  <div className="flex items-center gap-6 mb-12">
                     <div className="w-20 h-20 bg-brand-500 rounded-3xl flex items-center justify-center font-black text-3xl text-black shadow-2xl">
                        {user?.full_name?.charAt(0).toUpperCase()}
                     </div>
                     <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Identity Modulator</h2>
                        <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.4em]">Customize Administrator Matrix</p>
                     </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] pl-2">Supreme Name</label>
                        <input 
                           type="text"
                           value={profileForm.full_name}
                           onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                           className="w-full px-8 py-5 bg-white/[0.02] border border-white/5 rounded-2xl text-[12px] font-black text-white focus:border-brand-500/50 focus:outline-none transition-all uppercase tracking-tight bg-transparent"
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] pl-2">Clearance Label</label>
                        <input 
                           disabled
                           type="text"
                           value={profileForm.role}
                           className="w-full px-8 py-5 bg-white/[0.02] border border-white/5 rounded-2xl text-[12px] font-black text-slate-600 focus:outline-none opacity-50 cursor-not-allowed bg-transparent"
                        />
                     </div>
                     
                     <div className="flex gap-4 pt-4">
                        <button 
                           type="button"
                           onClick={() => {
                              setShowProfileModal(false);
                              setShowSecurityModal(true);
                           }}
                           className="flex-1 py-5 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-500/20 transition-all cursor-pointer"
                        >
                           SETUP SECURITY
                        </button>
                        <button 
                           type="submit"
                           className="flex-1 py-5 bg-brand-500 text-black rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] hover:bg-brand-450 transition-all shadow-2xl shadow-brand-500/20 active:scale-95 cursor-pointer"
                        >
                           SAVE MODULATION
                        </button>
                     </div>
                  </form>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
      {/* Admin Security Key Modulation Modal */}
      <AnimatePresence>
         {showSecurityModal && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-[#030712]/95 backdrop-blur-3xl z-[9999] flex items-center justify-center p-6"
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="w-full max-w-md bg-[#070b14] border border-brand-500/20 rounded-[3rem] p-12 text-center shadow-[0_50px_100px_rgba(0,0,0,0.9)] relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.03] to-transparent pointer-events-none" />
                  
                  <div className="w-20 h-20 bg-brand-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-brand-500/20">
                     <ShieldAlert className="w-8 h-8 text-brand-500" />
                  </div>

                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Security Modulation</h2>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10">Configure hardware-level access key</p>

                  <form onSubmit={handleUpdateSecurityKey} className="space-y-6">
                     <div className="relative group">
                        <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-500" />
                        <input 
                           autoFocus
                           type="text"
                           placeholder="NEW SECURITY KEY..."
                           value={newSecurityKey}
                           onChange={(e) => setNewSecurityKey(e.target.value)}
                           className="w-full pl-16 pr-8 py-5 bg-white/[0.02] border border-white/5 rounded-2xl text-[12px] font-black text-white focus:border-brand-500/50 focus:outline-none transition-all tracking-[0.3em] bg-transparent"
                        />
                     </div>
                     <div className="flex gap-4">
                        <button 
                           type="button"
                           onClick={() => setShowSecurityModal(false)}
                           className="flex-1 py-4 bg-white/[0.05] border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/[0.1] transition-all cursor-pointer"
                        >
                           ABORT
                        </button>
                        <button 
                           type="submit"
                           className="flex-1 py-4 bg-brand-500 text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-450 transition-all shadow-xl shadow-brand-500/20 cursor-pointer"
                        >
                           SYNC KEY
                        </button>
                     </div>
                  </form>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPortal;
