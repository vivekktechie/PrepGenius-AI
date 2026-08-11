import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Clock, 
  TrendingUp,
  Brain,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Briefcase,
  Zap,
  ArrowUpRight,
  Cpu,
  ShieldCheck,
  Upload,
  Activity,
  Award,
  ZapOff,
  Search,
  Globe,
  Database,
  Star,
  Layers,
  Fingerprint
} from 'lucide-react';
import { interview } from '../../lib/api';
import { Link, useNavigate } from 'react-router-dom';

const DashboardOverview = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const savedUser = JSON.parse(localStorage.getItem('genesis_user'));
        setUser(savedUser);

        if (savedUser) {
          const { data } = await interview.getSessions();
          const mappedSessions = (data.sessions || []).map(s => ({
            ...s,
            role: s.job_title,
            score: s.performance_score
          }));
          setSessions(mappedSessions);
        }
      } catch (err) {
        console.error('Failed to sync with TiDB:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { label: 'Neural Purity', value: sessions.length > 0 ? `${Math.round(sessions.reduce((acc, s) => acc + (s.score || 0), 0) / sessions.length)}%` : '0%', icon: Target, color: 'text-brand-400', glow: 'shadow-[0_0_40px_rgba(34,211,238,0.15)]', border: 'border-brand-500/20' },
    { label: 'Missions Logged', value: sessions.length.toString(), icon: Layers, color: 'text-purple-400', glow: 'shadow-[0_0_40px_rgba(168,85,247,0.15)]', border: 'border-purple-500/20' },
    { label: 'Simulation Time', value: sessions.length > 0 ? `${sessions.reduce((acc, s) => acc + (s.duration || 0), 0)}m` : '0m', icon: Activity, color: 'text-emerald-400', glow: 'shadow-[0_0_40px_rgba(16,185,129,0.15)]', border: 'border-emerald-500/20' },
    { label: 'Mastery Rate', value: sessions.length > 0 ? `${Math.round((sessions.filter(s => s.score >= 70).length / sessions.length) * 100)}%` : '0%', icon: Fingerprint, color: 'text-amber-400', glow: 'shadow-[0_0_40px_rgba(245,158,11,0.15)]', border: 'border-amber-500/20' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-16 pb-20"
    >
      {/* Admin Command Override */}
      {(user?.role === 'admin' || user?.full_name === 'Supreme Admin') && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group cursor-pointer"
          onClick={() => navigate('/admin')}
        >
           <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 via-amber-500/40 to-amber-500/20 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
           <div className="relative p-10 bg-black/40 backdrop-blur-3xl border border-amber-500/20 rounded-[3rem] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex items-center gap-10">
                <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                   <ShieldCheck className="w-10 h-10 text-amber-500" />
                </div>
                <div>
                   <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Command Center <span className="text-amber-500">Online.</span></h4>
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] leading-none">Level 10 Neural Authorization Verified</p>
                   </div>
                </div>
              </div>
              <div className="px-12 py-5 bg-amber-500 text-black text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-amber-400 transition-all shadow-2xl">
                 Initialize Admin Protocol
              </div>
           </div>
        </motion.div>
      )}

      {/* Primary Mission HUD */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Practice Arena Module */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.01 }}
          className="relative group p-[1px] bg-gradient-to-br from-brand-500/30 via-white/5 to-transparent rounded-[3.5rem] transition-all duration-700 shadow-2xl"
        >
          <div className="bg-[#020617] rounded-[3.4rem] p-10 lg:p-12 flex flex-col items-center text-center relative overflow-hidden h-full">
            {/* Background Graphic */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/5 blur-[100px] -mr-48 -mt-48 rounded-full group-hover:bg-brand-500/10 transition-colors duration-1000" />
            
            <div className="relative z-10 w-full">
              <div className="flex items-center gap-3 mb-8 justify-center">
                 <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                 <span className="text-[10px] font-black text-brand-400 uppercase tracking-[0.4em]">Simulation Protocol • ALPHA</span>
              </div>
              
              <div className="w-28 h-28 mx-auto bg-brand-500/5 rounded-3xl border border-white/5 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-700 shadow-inner">
                 <Cpu className="w-14 h-14 text-brand-400/60 animate-pulse" />
              </div>

              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tighter leading-none uppercase">Practice <br/><span className="text-brand-400">Arena.</span></h2>
              <p className="text-slate-500 mb-10 max-w-[280px] mx-auto leading-relaxed font-bold text-[11px] uppercase tracking-widest opacity-80">AI scenarios with real-time performance tracking.</p>
              
              <button 
                onClick={() => navigate('/dashboard/interview')}
                className="w-full py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-brand-500 hover:text-white transition-all shadow-[0_15px_40px_rgba(255,255,255,0.05)] active:scale-95 group/btn"
              >
                Launch Protocol
              </button>
            </div>
          </div>
        </motion.div>

        {/* Resume Engine Module */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.01 }}
          className="relative group p-[1px] bg-gradient-to-br from-purple-500/30 via-white/5 to-transparent rounded-[3.5rem] transition-all duration-700 shadow-2xl"
        >
          <div className="bg-[#020617] rounded-[3.4rem] p-10 lg:p-12 flex flex-col items-center text-center relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] -mr-48 -mt-48 rounded-full group-hover:bg-purple-500/10 transition-colors duration-1000" />
            
            <div className="relative z-10 w-full">
              <div className="flex items-center gap-3 mb-8 justify-center">
                 <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                 <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em]">Audit Protocol • SIGMA</span>
              </div>
              
              <div className="w-28 h-28 mx-auto bg-purple-500/5 rounded-3xl border border-white/5 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-700 shadow-inner">
                 <Fingerprint className="w-14 h-14 text-purple-400/60" />
              </div>

              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tighter leading-none uppercase">Resume <br/><span className="text-purple-400">Scanner.</span></h2>
              <p className="text-slate-500 mb-10 max-w-[280px] mx-auto leading-relaxed font-bold text-[11px] uppercase tracking-widest opacity-80">Advanced profiling and integrity auditing.</p>
              
              <button 
                onClick={() => navigate('/dashboard/resume')}
                className="w-full py-5 bg-[#030712] border border-white/10 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-purple-500 hover:border-purple-400 transition-all shadow-2xl active:scale-95 group/btn"
              >
                Initiate Scan
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cinematic Performance Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative group p-10 rounded-[3.5rem] bg-[#030712] border ${stat.border} hover:border-white/30 transition-all duration-500 overflow-hidden ${stat.glow}`}
          >
            <div className="flex items-center justify-between mb-10">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center bg-white/[0.02] border border-white/5 ${stat.color} group-hover:scale-110 transition-all duration-500`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </div>
            <h3 className="text-5xl font-black text-white mb-2 tabular-nums tracking-tighter leading-none">{stat.value}</h3>
            <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em]">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Compact Neural Activity Stream */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="relative glass border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
          <div className="px-10 py-8 border-b border-white/5 flex flex-col md:flex-row items-center justify-between bg-white/[0.01] gap-6">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                  <Activity className="w-6 h-6 text-brand-400 animate-pulse" />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase leading-none mb-1.5">Mission Archive.</h3>
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none">Neural Feed Synchronized • REAL-TIME</p>
                  </div>
               </div>
            </div>
            <button 
              onClick={() => navigate('/dashboard/sessions')}
              className="px-8 py-3 bg-[#030712] border border-white/10 rounded-xl text-[9px] font-black text-brand-400 uppercase tracking-[0.4em] hover:bg-brand-500 hover:text-black transition-all shadow-xl"
            >
              Access Global Records
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="h-48 flex flex-col items-center justify-center gap-4">
                 <div className="w-12 h-12 border-4 border-brand-500/10 border-t-brand-500 rounded-full animate-spin" />
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] animate-pulse">Syncing Mission Protocols...</span>
              </div>
            ) : sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.slice(0, 5).map((session, i) => {
                  const dateObj = new Date(session.created_at);
                  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      key={i} 
                      className="group/item flex flex-col lg:flex-row lg:items-center gap-6 p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 hover:bg-brand-500/[0.02] hover:border-brand-500/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.05)] transition-all duration-300 cursor-pointer relative overflow-hidden"
                      onClick={() => {
                        localStorage.setItem('current_interview_session', JSON.stringify(session));
                        navigate('/dashboard/analytics');
                      }}
                    >
                      <div className="flex items-center gap-6 lg:w-[280px]">
                         <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center font-black text-brand-400 border border-white/5 group-hover/item:bg-brand-500 group-hover/item:text-black group-hover/item:scale-105 transition-all duration-300 shadow-lg">
                            <Brain className="w-5 h-5" />
                         </div>
                         <div>
                            <span className="block text-sm font-black text-white uppercase tracking-tight leading-none mb-1.5 group-hover/item:text-brand-400 transition-colors">{session.role || 'Protocol Alpha'}</span>
                            <span className="block text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">NODE #{String(session.id).substr(-4)}</span>
                         </div>
                      </div>

                      <div className="flex-1 flex flex-wrap items-center gap-8 lg:pl-8 lg:border-l border-white/5">
                        <div className="flex items-center gap-3">
                          <Globe className="w-3.5 h-3.5 text-brand-500/40" />
                          <span className="text-[11px] font-black text-white uppercase tracking-wider">{dateStr} • {timeStr}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Cpu className="w-3.5 h-3.5 text-purple-500/40" />
                          <span className="text-[11px] font-black text-white uppercase tracking-wider">{session.difficulty || 'CALIBRATED'}</span>
                        </div>

                        <div className="flex items-center gap-3 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                           <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                           <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">SECURE</span>
                        </div>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover/item:bg-brand-500 group-hover/item:text-black group-hover/item:border-brand-500/50 group-hover/item:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all group-hover/item:rotate-45 hidden lg:flex">
                         <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                 <div className="w-32 h-32 bg-white/5 rounded-[4rem] flex items-center justify-center mb-10 border border-white/5 shadow-inner">
                    <ZapOff className="w-12 h-12 text-slate-700" />
                 </div>
                 <h4 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">Archive Offline.</h4>
                 <p className="text-slate-500 max-w-sm leading-relaxed mb-12 text-sm font-bold uppercase tracking-widest">Your neural profile is active, but the tactical record is empty. Initiate your first mission to begin data sync.</p>
                 <button 
                   onClick={() => navigate('/dashboard/interview')}
                   className="px-16 py-6 bg-brand-500 text-black rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.5em] hover:scale-105 transition-all shadow-[0_30px_80px_rgba(34,211,238,0.2)]"
                 >
                    Launch Simulation
                 </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;
