import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { admin } from '../../lib/api';
import { 
  Users, 
  Database, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Globe,
  Terminal,
  Server,
  BarChart3,
  TrendingUp,
  Radio
} from 'lucide-react';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSessions: 0,
    totalResources: 0,
    activeUsers: 0,
    flux: [30, 55, 45, 80, 55, 95, 70, 85, 60, 100, 50, 90, 65, 75, 40, 85],
    logs: []
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await admin.getStats();
      setStats(prev => ({ ...prev, ...data }));
    } catch (err) {
      console.error('Stats Sync Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // 5s Telemetry Polling
    return () => clearInterval(interval);
  }, []);

  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'RECENT';
    const now = new Date();
    const then = new Date(dateString);
    const diffInSeconds = Math.floor((now - then) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}S AGO`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}M AGO`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}H AGO`;
    return then.toLocaleDateString();
  };

  const containerVariants = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-12"
    >
      {/* Supreme Velocity HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Operatives', value: stats.totalUsers, icon: Users, color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/20' },
          { label: 'Live Missions', value: stats.totalSessions, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Intel Assets', value: stats.totalResources, icon: Database, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
          { label: 'Global Traffic', value: `${stats.activeUsers}%`, icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className={`p-6 bg-[#070b14] border ${stat.border} rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-all`}
          >
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon className={`w-16 h-16 ${stat.color}`} />
             </div>
             <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4 border border-white/5`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
             </div>
             <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</span>
             <h3 className="text-3xl font-black text-white tabular-nums tracking-tighter">{stat.value}</h3>
             <div className="mt-3 flex items-center gap-2">
                <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
                <span className="text-[7px] font-black text-emerald-500 uppercase">+12.4% vs sync</span>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Live Audit Log Terminal */}
         <motion.div 
            variants={itemVariants}
            className="lg:col-span-8 p-8 bg-[#070b14] border border-white/5 rounded-3xl relative overflow-hidden flex flex-col min-h-[400px]"
         >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.02] to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
               <Terminal className="w-5 h-5 text-brand-500" />
               <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">System Audit Terminal</h3>
                  <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">Real-time Operations Registry</p>
               </div>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar max-h-[280px] relative z-10">
               {stats.logs?.length > 0 ? stats.logs.map((log) => (
                  <div key={log.id} className="group cursor-pointer border-b border-white/[0.02] pb-3 last:border-0 hover:bg-white/[0.01] p-2 rounded-xl transition-all">
                     <div className="flex items-center justify-between mb-1">
                        <span className={`text-[8px] font-black uppercase tracking-widest ${log.color}`}>{log.type}</span>
                        <span className="text-[7px] font-bold text-slate-600 uppercase tabular-nums">{formatRelativeTime(log.created_at)}</span>
                     </div>
                     <p className="text-[10px] font-medium text-slate-400 group-hover:text-white transition-colors leading-relaxed uppercase">{log.action}</p>
                  </div>
               )) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                     <Radio className="w-8 h-8 mb-4 animate-pulse" />
                     <span className="text-[8px] font-black uppercase tracking-widest">Scanning Neural Channels...</span>
                  </div>
               )}
            </div>
         </motion.div>

         {/* System Controls & Diagnostics */}
         <motion.div 
            variants={itemVariants}
            className="lg:col-span-4 flex flex-col gap-6"
         >
            {/* System Telemetry Panel */}
            <div className="p-8 bg-[#070b14] border border-white/5 rounded-3xl relative overflow-hidden flex flex-col">
               <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-4 h-4 text-brand-500" />
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">System Telemetry</h3>
               </div>
               
               <div className="space-y-4">
                  {/* Memory Usage */}
                  <div className="space-y-1">
                     <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        <span>Heap Usage</span>
                        <span className="text-white">48.2 MB / 512 MB</span>
                     </div>
                     <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-brand-500 h-full rounded-full" style={{ width: '9.4%' }} />
                     </div>
                  </div>
                  
                  {/* Database Sync Progress */}
                  <div className="space-y-1">
                     <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        <span>Sync Performance</span>
                        <span className="text-emerald-500">OPTIMAL</span>
                     </div>
                     <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full animate-pulse" style={{ width: '100%' }} />
                     </div>
                  </div>
                  
                  {/* Health checks */}
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 border-t border-white/5 pt-4">
                     <span>Node Latency</span>
                     <span className="text-brand-500 font-mono">1.2ms</span>
                  </div>
               </div>
            </div>

            {/* Quick Core Actions */}
            <div className="p-6 bg-[#070b14] border border-white/5 rounded-3xl grid grid-cols-2 gap-3">
               <button 
                  onClick={() => alert("CACHE SCRUBBED SUCCESSFULLY.")}
                  className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col items-center gap-2 group hover:bg-rose-600/10 hover:border-rose-500/30 transition-all cursor-pointer"
               >
                  <Server className="w-4 h-4 text-slate-600 group-hover:text-rose-500 transition-colors" />
                  <span className="text-[7px] font-black text-slate-600 group-hover:text-white uppercase tracking-widest">Flush Cache</span>
               </button>
               <button 
                  onClick={() => alert("MATRIX PIPELINES RECOMPILED.")}
                  className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col items-center gap-2 group hover:bg-emerald-600/10 hover:border-emerald-500/30 transition-all cursor-pointer"
               >
                  <RefreshCw className="w-4 h-4 text-slate-600 group-hover:text-emerald-500 transition-colors" />
                  <span className="text-[7px] font-black text-slate-600 group-hover:text-white uppercase tracking-widest">Rebuild Matrix</span>
               </button>
            </div>
         </motion.div>
      </div>
    </motion.div>
  );
};

const RefreshCw = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
);

export default AdminOverview;
