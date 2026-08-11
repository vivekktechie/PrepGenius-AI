import { motion } from 'framer-motion';
import { 
  Briefcase, Settings as SettingsIcon, Cpu, Zap, Star, 
  Clock, Target, Bot, Sparkles, ArrowRight, 
  ChevronLeft, ShieldCheck, Activity, Globe,
  Terminal, UserCheck, Wind, Gauge, Fingerprint,
  Radio, Layers, Boxes, Binary
} from 'lucide-react';

const ReviewStep = ({ data, onNext, onBack }) => {
  // Safe parsing of metrics
  const qCount = Number(data?.questionCount) || 10;
  const duration = Number(data?.duration) || 30;
  
  // High-fidelity readiness score
  const readinessScore = Math.min(100, Math.round(92 + (qCount / 40) * 5 + (duration / 120) * 3));

  return (
    <div className="space-y-10 pb-16 max-w-6xl mx-auto">
      {/* Immersive HUD Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-10 lg:p-14 glass-dark border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl group"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 blur-[120px] -mr-48 -mt-48 group-hover:bg-brand-500/20 transition-all duration-1000" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/5 blur-[100px] -ml-40 -mb-40" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-[2rem] bg-brand-500/10 flex items-center justify-center border border-brand-500/20 shadow-inner group-hover:scale-105 transition-transform duration-500">
                <ShieldCheck className="w-10 h-10 text-brand-400" />
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 border border-dashed border-brand-500/20 rounded-[2.5rem] pointer-events-none"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-[8px] font-black text-brand-400 uppercase tracking-[0.3em] animate-pulse">Neural Lock Active</span>
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Phase 03 Finalization</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none">Tactical <span className="text-gradient">Briefing.</span></h2>
              <p className="text-slate-500 text-xs font-medium mt-3 max-w-md leading-relaxed">System architecture is fully synchronized. Your professional footprint has been mapped to the Genesis Core.</p>
            </div>
          </div>

          <div className="flex items-center gap-10">
             {/* Neural Readiness Diagnostic */}
             <div className="flex items-center gap-6 px-10 py-6 bg-white/[0.03] border border-white/10 rounded-[2.5rem] shadow-xl group/diag hover:border-brand-500/40 transition-all">
                <div className="relative w-16 h-16">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                      <motion.circle 
                        cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" 
                        className="text-brand-500"
                        initial={{ strokeDasharray: "0 1000" }}
                        animate={{ strokeDasharray: `${(readinessScore / 100) * 176} 1000` }}
                        transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                      />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-black text-white tabular-nums">{readinessScore}%</span>
                   </div>
                </div>
                <div>
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Neural Readiness</h4>
                   <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                      <Activity className="w-3 h-3 animate-pulse" />
                      Optimum Sync
                   </p>
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Mission Specs */}
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Identity Module */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-10 glass border border-white/5 rounded-[3rem] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Fingerprint className="w-20 h-20 text-brand-500" />
              </div>
              <div className="flex items-center gap-3 mb-8">
                <Globe className="w-4 h-4 text-brand-400" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Target Identity</span>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter mb-4">{data?.jobTitle}</h3>
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand-500/10 border border-brand-500/20 rounded-xl">
                <Target className="w-3.5 h-3.5 text-brand-400" />
                <span className="text-[10px] font-black text-brand-300 uppercase tracking-widest">{data?.focusArea || 'Core Interface'}</span>
              </div>
            </motion.div>

            {/* Config Module */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="p-8 glass-dark border border-white/5 rounded-[2.5rem] flex flex-col justify-between hover:border-brand-500/30 transition-all">
                <Radio className="w-5 h-5 text-brand-500 mb-6" />
                <div>
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Tone Synthesis</span>
                  <span className="text-sm font-black text-white uppercase">{data?.tone}</span>
                </div>
              </div>
              <div className="p-8 glass-dark border border-white/5 rounded-[2.5rem] flex flex-col justify-between hover:border-brand-500/30 transition-all">
                <Layers className="w-5 h-5 text-accent-500 mb-6" />
                <div>
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Environment</span>
                  <span className="text-sm font-black text-white uppercase">{data?.environment}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Blueprint Terminal */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-10 glass-dark border border-white/5 rounded-[3rem] overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500/50 via-transparent to-transparent" />
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <Terminal className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Mission Blueprint</h4>
                  <p className="text-[7px] font-black text-slate-600 uppercase tracking-[0.3em] mt-0.5">Encrypted Stream Data</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Verified</span>
              </div>
            </div>

            <div className="bg-black/40 p-8 rounded-2xl border border-white/5 min-h-[200px] max-h-[300px] overflow-y-auto no-scrollbar relative group">
              <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Binary className="w-16 h-16 text-brand-500" />
              </div>
              <p className="text-[13px] text-slate-400 leading-relaxed font-medium italic whitespace-pre-line">
                {data?.jobDescription || 'Neural description stream empty...'}
              </p>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Zap, label: 'Intensity', value: data?.difficulty || 'Medium', color: 'text-brand-400', bg: 'bg-brand-500/10' },
              { icon: Boxes, label: 'Nodes', value: `${qCount} Units`, color: 'text-accent-400', bg: 'bg-accent-500/10' },
              { icon: Clock, label: 'Window', value: `${duration} Min`, color: 'text-rose-400', bg: 'bg-rose-500/10' },
              { icon: Gauge, label: 'Velocity', value: `${Math.round(duration / qCount) || 1} m/u`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 glass border border-white/5 rounded-[2rem] text-center group hover:bg-white/[0.04] transition-all"
              >
                <div className={`w-10 h-10 mx-auto mb-4 rounded-xl ${stat.bg} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
                   <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 block mb-1">{stat.label}</span>
                <span className="text-sm font-black text-white">{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="lg:col-span-4 space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-10 lg:p-12 bg-brand-500/5 border border-brand-500/20 rounded-[3.5rem] relative overflow-hidden group shadow-2xl h-fit"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20 shadow-xl">
                  <Sparkles className="w-6 h-6 text-brand-400" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-brand-400 uppercase tracking-[0.4em] mb-1">System Manifest</h4>
                  <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Protocol Generation Complete</p>
                </div>
              </div>
              
              <h3 className="text-3xl font-black text-white mb-6 leading-[1.1] tracking-tighter">Initiate <span className="text-gradient">Session.</span></h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-12 font-medium">
                The neural calibration is verified. All tactical parameters have been injected into the Genesis Engine. Prepare for high-intensity evaluation.
              </p>

              <div className="space-y-6">
                <button 
                  onClick={() => {
                    if (document.documentElement.requestFullscreen) {
                      document.documentElement.requestFullscreen().catch(e => console.error("Fullscreen error:", e));
                    }
                    onNext();
                  }}
                  className="w-full py-8 bg-brand-600 text-white rounded-[2.5rem] font-black text-2xl shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:bg-brand-500 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-4 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10">LAUNCH MISSION</span>
                  <ArrowRight className="w-8 h-8 relative z-10 group-hover:translate-x-2 transition-transform" />
                </button>
                
                <button 
                  onClick={onBack}
                  className="w-full py-4 glass border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white hover:border-brand-500/30 transition-all flex items-center justify-center gap-3"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Recalibrate Phase 02
                </button>
              </div>
            </div>
          </motion.div>

          {/* Diagnostic Alert */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-10 glass border border-white/5 rounded-[3rem] relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity className="w-12 h-12 text-rose-500" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">Neural Caution</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">
              Once initialized, the temporal window cannot be paused. Neural metrics will be recorded in real-time with zero-latency synchronization.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
