import { motion } from 'framer-motion';
import { 
  Zap, HelpCircle, Clock, Star, Flame, 
  Dumbbell, ChevronLeft, ArrowRight, 
  Settings2, Activity, ShieldAlert,
  MessageCircle, Coffee, Monitor, Building2,
  Lock, UserCheck, Sparkles
} from 'lucide-react';

const difficulties = [
  { id: 'Easy', label: 'EASY', desc: 'Guided session for juniors.', color: 'emerald', icon: Star },
  { id: 'Medium', label: 'MEDIUM', desc: 'Standard professional depth.', color: 'amber', icon: Zap },
  { id: 'Hard', label: 'HARD', desc: 'Aggressive tactical probing.', color: 'rose', icon: Flame },
  { id: 'Expert', label: 'EXPERT', desc: 'Maximum neural intensity.', color: 'purple', icon: Dumbbell }
];


const SettingsStep = ({ data, updateData, onNext, onBack }) => {
  return (
    <div className="space-y-16 pb-12">
      {/* 1. Neural Intensity Selection */}
      <section>
        <div className="flex items-center gap-5 mb-10 px-4">
          <div className="w-12 h-12 rounded-[1.25rem] bg-brand-500/10 flex items-center justify-center border border-brand-500/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            <Settings2 className="w-6 h-6 text-brand-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight uppercase">Neural Intensity</h3>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Select simulation depth level</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
          {difficulties.map((diff) => (
            <motion.button
              key={diff.id}
              whileHover={{ y: -8, scale: 1.02 }}
              whileActive={{ scale: 0.98 }}
              onClick={() => updateData({ difficulty: diff.id })}
              className={`
                relative overflow-hidden p-8 rounded-[3rem] border transition-all duration-500 text-left group
                ${data.difficulty === diff.id 
                  ? `bg-brand-500/10 border-brand-500/50 shadow-[0_30px_60px_-12px_rgba(59,130,246,0.2)]` 
                  : 'bg-[#030712] border-white/5 hover:border-white/20'}
              `}
            >
              <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500
                ${data.difficulty === diff.id ? 'bg-brand-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-110' : 'bg-white/5 text-slate-700 group-hover:text-slate-400'}
              `}>
                <diff.icon className="w-7 h-7" />
              </div>
              <h4 className={`text-xl font-black mb-2 tracking-tighter transition-colors ${data.difficulty === diff.id ? 'text-white' : 'text-slate-500'}`}>{diff.label}</h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed uppercase tracking-wider">{diff.desc}</p>
              
              {data.difficulty === diff.id && (
                <motion.div 
                  layoutId="activeDiff"
                  className="absolute top-6 right-8 flex items-center gap-2"
                >
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
                   <span className="text-[8px] font-black text-brand-400 uppercase tracking-widest">Active</span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </section>

      {/* 2. Core Simulation Matrix */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 px-2">
        {/* Question Matrix */}
        <div className="glass-dark border border-white/5 rounded-[4rem] p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex items-center gap-5 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-accent-500/10 flex items-center justify-center border border-accent-500/20">
              <HelpCircle className="w-6 h-6 text-accent-400" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight uppercase">Question Matrix</h3>
              <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.4em] mt-1">Total neural probes [MAX 40]</p>
            </div>
          </div>

          <div className="space-y-12">
            <div className="grid grid-cols-4 gap-4">
              {[5, 10, 20, 40].map((val) => (
                <button
                  key={val}
                  onClick={() => updateData({ questionCount: val })}
                  className={`
                    p-6 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden
                    ${data.questionCount === val 
                      ? 'bg-accent-500/10 border-accent-500/40 text-white shadow-xl' 
                      : 'bg-white/[0.02] border-white/5 text-slate-700 hover:border-white/20'}
                  `}
                >
                  <span className="text-3xl font-black block tracking-tighter">{val}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-40 mt-1 block">Units</span>
                  {data.questionCount === val && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-accent-500 shadow-[0_0_15px_#10b981]" />
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-2">
                <span>Calibration Sweep</span>
                <span className="text-accent-400 text-sm">{data.questionCount} PROBES</span>
              </div>
              <div className="relative group/range">
                <input 
                  type="range" 
                  min="1" 
                  max="40" 
                  step="1"
                  value={data.questionCount}
                  onChange={(e) => updateData({ questionCount: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-900 rounded-full appearance-none cursor-pointer accent-accent-500 border border-white/5"
                />
                <div className="flex justify-between mt-4 px-1">
                   {[1, 10, 20, 30, 40].map(m => (
                      <span key={m} className="text-[8px] font-black text-slate-800">{m}</span>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Calibration */}
        <div className="glass-dark border border-white/5 rounded-[4rem] p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex items-center gap-5 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <Clock className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight uppercase">Temporal Lock</h3>
              <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.4em] mt-1">Total Session Window</p>
            </div>
          </div>

          <div className="space-y-12">
            <div className="grid grid-cols-4 gap-4">
              {[15, 30, 60, 120].map((dur) => (
                <button
                  key={dur}
                  onClick={() => updateData({ duration: dur })}
                  className={`
                    p-6 rounded-[2rem] border transition-all duration-500 relative overflow-hidden
                    ${data.duration === dur 
                      ? 'bg-rose-500/10 border-rose-500/40 text-white shadow-xl' 
                      : 'bg-white/[0.02] border-white/5 text-slate-700 hover:border-white/20'}
                  `}
                >
                  <span className="text-3xl font-black block tracking-tighter">{dur}</span>
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-40 mt-1 block">Min</span>
                  {data.duration === dur && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-rose-500 shadow-[0_0_15px_#f43f5e]" />
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-2">
                <span>Phase Duration</span>
                <span className="text-rose-400 text-sm">{data.duration} MINUTES</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="240" 
                step="5"
                value={data.duration}
                onChange={(e) => updateData({ duration: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-900 rounded-full appearance-none cursor-pointer accent-rose-500 border border-white/5"
              />
               <div className="flex justify-between mt-4 px-1">
                   {[5, 60, 120, 180, 240].map(m => (
                      <span key={m} className="text-[8px] font-black text-slate-800">{m}m</span>
                   ))}
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strict Time Protocol Informational HUD */}
      <div className="px-2">
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] -mt-16 -mr-16" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1 text-amber-50">Strict Auto-Submit Protocol</h4>
              <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest">
                Answers are forcibly submitted when time expires.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end relative z-10">
            <div className="flex items-end gap-2 text-amber-400">
              <span className="text-3xl font-black leading-none">{Math.floor((data.duration * 60) / data.questionCount)}</span>
              <span className="text-[10px] font-black uppercase tracking-widest mb-1">Seconds</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500/50 mt-1">Allocated Per Question</span>
          </div>
        </div>
      </div>



      {/* Navigation Controls */}
      <div className="pt-12 flex items-center justify-between px-4">
        <button 
          onClick={onBack}
          className="group flex items-center gap-4 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] text-slate-600 hover:text-white transition-all bg-white/5 border border-white/5 hover:border-white/10"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
          Previous Phase
        </button>
        
        <button 
          onClick={onNext}
          className="flex items-center gap-4 px-14 py-6 rounded-[2rem] font-black text-xl bg-brand-600 text-white shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:bg-brand-500 hover:scale-[1.05] transition-all active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative z-10">INITIALIZE BRIEFING</span>
          <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default SettingsStep;
