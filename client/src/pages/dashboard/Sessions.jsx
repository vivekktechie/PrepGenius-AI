import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, Calendar, Clock, Hourglass, 
  Trash2, ArrowRight, Briefcase, ChevronDown, CheckCircle2, Loader2,
  Sparkles, Target, Zap, BarChart3, Search, Fingerprint, Database, Activity, ShieldCheck, Globe, Cpu, ArrowUpRight
} from 'lucide-react';
import { interview } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filters
  const [filterDifficulty, setFilterDifficulty] = useState('All Levels');
  const [sortBy, setSortBy] = useState('Most Recent');

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data } = await interview.getSessions();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await interview.deleteSession(id);
      setSessions(sessions.filter(s => s.id !== id));
    } catch (error) {
      console.error("Failed to delete session", error);
    }
  };

  const handleView = (session) => {
    const sessionData = {
      id: session.id,
      score: session.performance_score,
      accuracy: session.accuracy,
      duration: session.duration,
      history: typeof session.history === 'string' ? JSON.parse(session.history) : session.history,
      job_title: session.job_title,
      difficulty: session.difficulty
    };
    localStorage.setItem('current_interview_session', JSON.stringify(sessionData));
    navigate('/dashboard/analytics');
  };

  const getDifficultyStyles = (difficulty) => {
    const diff = difficulty?.toLowerCase() || '';
    if (diff === 'easy') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (diff === 'hard') return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    return 'bg-brand-500/10 text-brand-400 border-brand-500/20';
  };

  const filteredSessions = sessions.filter(session => {
    const matchesDifficulty = filterDifficulty === 'All Levels' || session.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
    const matchesSearch = session.job_title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDifficulty && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'Most Recent') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'Oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === 'Highest Score') return b.performance_score - a.performance_score;
    return 0;
  });

  return (
    <div className="max-w-[1500px] mx-auto pb-32">
      
      {/* Cinematic Header Interface */}
      <div className="flex flex-col xl:flex-row items-center justify-between mb-16 gap-10">
         <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex items-center gap-8"
         >
            <div className="w-16 h-16 glass rounded-[1.5rem] flex items-center justify-center border border-white/5 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
              <Database className="w-8 h-8 text-brand-400 animate-pulse" />
            </div>
            <div>
               <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
                 Mission <span className="text-brand-400">Archives.</span>
               </h1>
               <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none">Global Data Synchronized • SECURE ACCESS</p>
               </div>
            </div>
         </motion.div>

         <motion.div 
           initial={{ opacity: 0, x: 30 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex flex-col md:flex-row items-center gap-6 w-full xl:w-auto"
         >
            <div className="relative group w-full md:w-[450px]">
               <div className="absolute -inset-[1px] bg-gradient-to-r from-brand-500/20 via-white/5 to-brand-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
               <div className="relative flex items-center bg-[#070b14] border border-white/10 rounded-2xl group-focus-within:border-brand-500/50 transition-all overflow-hidden shadow-2xl">
                  <div className="pl-6 pr-4 border-r border-white/5 h-14 flex items-center bg-white/[0.02]">
                     <Search className="w-4 h-4 text-slate-500 group-focus-within:text-brand-400 transition-all" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="SEARCH MISSION NODES..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-14 bg-transparent pl-5 pr-8 text-[11px] font-black text-white focus:outline-none placeholder:text-slate-800 uppercase tracking-[0.2em]"
                  />
               </div>
            </div>

            <div className="flex items-center gap-3 bg-[#070b14] border border-white/5 p-1.5 rounded-2xl w-full md:w-auto">
               <div className="relative">
                  <select 
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-400 px-8 py-3 focus:outline-none cursor-pointer hover:text-white transition-colors border-r border-white/5 appearance-none"
                  >
                    <option className="bg-[#030712]">All Levels</option>
                    <option className="bg-[#030712]">Easy</option>
                    <option className="bg-[#030712]">Medium</option>
                    <option className="bg-[#030712]">Hard</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
               </div>
               <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-400 px-8 py-3 focus:outline-none cursor-pointer hover:text-white transition-colors appearance-none"
                  >
                    <option className="bg-[#030712]">Most Recent</option>
                    <option className="bg-[#030712]">Oldest</option>
                    <option className="bg-[#030712]">Highest Score</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
               </div>
            </div>
         </motion.div>
      </div>

      {/* High-Fidelity Stats Deck */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {[
          { label: 'Total Missions', value: sessions.length, icon: Target, color: 'text-brand-400', glow: 'shadow-[0_0_30px_rgba(34,211,238,0.15)]' },
          { label: 'Avg Performance', value: sessions.length ? Math.round(sessions.reduce((acc, s) => acc + s.performance_score, 0) / sessions.length) + '%' : '0%', icon: Activity, color: 'text-emerald-400', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]' },
          { label: 'Neural Accuracy', value: sessions.length ? Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length) + '%' : '0%', icon: Fingerprint, color: 'text-purple-400', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]' },
          { label: 'Simulation Time', value: sessions.reduce((acc, s) => acc + s.duration, 0) + 'm', icon: Clock, color: 'text-amber-400', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-10 bg-[#030712] rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all duration-500 ${stat.glow}`}
          >
            <div className={`absolute -right-6 -bottom-6 w-32 h-32 ${stat.color} opacity-[0.02] group-hover:opacity-[0.06] transition-opacity`}>
              <stat.icon className="w-full h-full" />
            </div>
            <div className="relative z-10">
               <div className={`w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
               </div>
               <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-2">{stat.label}</div>
               <div className="text-4xl font-black text-white tracking-tighter tabular-nums">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Mission Stream */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="h-[500px] flex flex-col items-center justify-center">
            <div className="relative">
               <div className="w-24 h-24 border-[8px] border-brand-500/10 border-t-brand-500 rounded-full animate-spin shadow-[0_0_40px_rgba(34,211,238,0.1)]" />
               <Database className="w-8 h-8 text-brand-500/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] mt-10 animate-pulse">Decrypting Mission Logs...</div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[500px] flex flex-col items-center justify-center bg-[#030712] rounded-[4rem] border border-white/5 border-dashed"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5 shadow-inner">
               <Zap className="w-10 h-10 text-slate-800" />
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-3">Archive Node Empty.</h3>
            <p className="text-slate-600 font-black text-[11px] uppercase tracking-widest">No matching mission signatures found in neural database.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
            {filteredSessions.map((session, index) => {
              const dateObj = new Date(session.created_at);
              const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
              const diffStyles = getDifficultyStyles(session.difficulty);
              
              const score = session.performance_score || 0;
              const radius = 18;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - (score / 100) * circumference;

              return (
                <motion.div
                  layout
                  key={session.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  <div className="relative h-full glass border border-white/5 rounded-[2.5rem] p-7 flex flex-col hover:border-brand-500/40 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group hover:scale-[1.02] hover:-translate-y-1.5 bg-gradient-to-b from-[#070b14]/40 to-[#030712]/90">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Header Protocol */}
                    <div className="flex items-center justify-between mb-6 relative z-10">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-brand-500 group-hover:text-black transition-all duration-500">
                             <Calendar className="w-5 h-5 text-brand-400 group-hover:text-black transition-colors" />
                          </div>
                          <div>
                             <div className="text-[10px] font-black text-white tracking-widest leading-none">{dateStr}</div>
                             <div className="text-[8px] font-bold text-slate-600 mt-1">{timeStr}</div>
                          </div>
                       </div>
                       
                       <span className={`px-3 py-1 rounded-xl border text-[8px] font-black uppercase tracking-widest ${diffStyles}`}>
                          {session.difficulty}
                       </span>
                    </div>

                    {/* Mission Identity */}
                    <div className="mb-6 flex-1 relative z-10">
                       <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                          <span className="text-[8px] font-black text-brand-500/60 uppercase tracking-[0.3em]">Operational Node</span>
                       </div>
                       <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-tight group-hover:text-brand-400 transition-colors line-clamp-2">
                          {session.job_title}
                       </h3>
                       <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest mt-2 block">
                          History Nodes: {typeof session.history === 'string' ? JSON.parse(session.history).length : (session.history || []).length} Units
                       </p>
                    </div>

                    {/* Tactical Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                       <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3">
                          <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                          <div>
                            <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest leading-none mb-1">Temporal</div>
                            <div className="text-xs font-black text-white leading-none tabular-nums">{session.duration} min</div>
                          </div>
                       </div>
                       <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3">
                          <Cpu className="w-4 h-4 text-slate-600 shrink-0" />
                          <div>
                            <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest leading-none mb-1">Calibration</div>
                            <div className="text-xs font-black text-emerald-400 leading-none uppercase">{session.difficulty}</div>
                          </div>
                       </div>
                    </div>

                    {/* Mission Actions */}
                    <div className="flex items-center gap-3 relative z-10">
                       <button 
                         onClick={() => handleView(session)}
                         className="flex-1 py-4 bg-white text-black hover:bg-brand-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 group/btn flex items-center justify-center gap-2 cursor-pointer"
                       >
                          Review Log <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                       </button>
                       <button 
                         onClick={() => handleDelete(session.id)}
                         className="w-12 py-4 bg-white/[0.02] border border-white/5 text-rose-500 rounded-2xl hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition-all shadow-xl flex items-center justify-center cursor-pointer"
                       >
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

const Brain = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105 3 3 0 1 0 5.952-.045"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.52 8.105 3 3 0 1 1-5.952-.045"/>
    <path d="M12 5v14"/>
    <path d="M18 9h2"/>
    <path d="M4 9h2"/>
    <path d="M10 13h4"/>
    <path d="M10 17h4"/>
    <path d="M10 9h4"/>
  </svg>
);

export default Sessions;
