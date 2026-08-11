import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Sparkles, Activity, Brain, Globe, Cpu, ArrowRight } from 'lucide-react';

const CountdownModal = ({ role, onComplete }) => {
  const [count, setCount] = useState(10);
  const [status, setStatus] = useState('Initializing Link...');

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (count === 0) {
      setStatus('Neural Link Synchronized.');
      const finalTimer = setTimeout(() => {
        if (onCompleteRef.current) onCompleteRef.current();
      }, 1500);
      return () => clearTimeout(finalTimer);
    }
    
    // Dynamic status updates
    if (count === 8) setStatus('Calibrating Semantic Core...');
    if (count === 6) setStatus('Syncing Biometric Audio...');
    if (count === 4) setStatus('Establishing Encryption Tunnel...');
    if (count === 2) setStatus('Genesis Protocol Manifested.');

    const timer = setTimeout(() => setCount(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  const handleLaunchNow = () => {
    if (onCompleteRef.current) onCompleteRef.current();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12 overflow-hidden"
    >
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 bg-[#010409]/95 backdrop-blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1)_0%,transparent_70%)]" />
      
      {/* Animated HUD Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="relative w-full max-w-4xl glass-dark border border-white/10 rounded-[4rem] p-10 lg:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden"
      >
        {/* Decorative Internal Glows */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent-500/10 blur-[80px] rounded-full" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Left Column: Sync Countdown (col-span-7) */}
          <div className="md:col-span-7 space-y-8 text-center md:text-left">
            {/* Central Neural Icon & Status */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative inline-block flex-shrink-0">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                   className="w-20 h-20 rounded-[1.8rem] border-2 border-dashed border-brand-500/30 flex items-center justify-center mx-auto"
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                       <Brain className="w-7 h-7 text-brand-400 animate-pulse" />
                    </div>
                 </div>
              </div>
              
              <div className="space-y-2 text-center md:text-left">
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   key={status}
                   className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 animate-pulse"
                 >
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-400">{status}</span>
                 </motion.div>
                 <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tighter leading-tight">Prepare for Deployment.</h2>
                 <p className="text-slate-500 text-xs font-bold leading-relaxed">
                    You are entering a high-intensity simulation for the role of <span className="text-brand-400 font-black">{role || 'Specialist'}</span>.
                 </p>
              </div>
            </div>

            {/* Progress Bar Module */}
            <div className="space-y-4">
               <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner p-[1px]">
                 <motion.div 
                   initial={{ width: '0%' }}
                   animate={{ width: `${((10 - count) / 10) * 100}%` }}
                   className="h-full bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500 rounded-full shadow-[0_0_20px_#22d3ee]"
                 />
               </div>
               
               <div className="flex items-center justify-center md:justify-start gap-6 opacity-40">
                  <div className="flex items-center gap-1.5">
                     <Shield className="w-3 h-3 text-slate-500" />
                     <span className="text-[7px] font-black uppercase tracking-widest text-slate-500">Security: Tier 1</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <Zap className="w-3 h-3 text-slate-500" />
                     <span className="text-[7px] font-black uppercase tracking-widest text-slate-500">Latency: 12ms</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <Globe className="w-3 h-3 text-slate-500" />
                     <span className="text-[7px] font-black uppercase tracking-widest text-slate-500">Region: Global</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Interactive Start Panel (col-span-5) */}
          <div className="md:col-span-5 bg-white/[0.02] border border-white/5 p-8 rounded-3xl text-center space-y-6 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 blur-2xl rounded-full" />
             
             {/* Countdown Big Digits here */}
             <div className="relative py-2">
               <AnimatePresence mode="wait">
                 <motion.div 
                   key={count}
                   initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
                   animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                   exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
                   transition={{ duration: 0.5, ease: "anticipate" }}
                   className="text-7xl font-black text-white tracking-tighter leading-none select-none"
                 >
                   {count > 0 ? `0${count}`.slice(-2) : <Sparkles className="w-16 h-16 mx-auto text-brand-400" />}
                 </motion.div>
               </AnimatePresence>
               <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2">SYSTEM TIME UNTIL SYNC</span>
             </div>

             <div className="space-y-4">
                <button
                  onClick={handleLaunchNow}
                  className="w-full relative group/btn cursor-pointer py-4 bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-brand-500/20 active:scale-95 flex items-center justify-center gap-2 animate-bounce"
                  style={{ animationDuration: '3s' }}
                >
                  Launch Simulator <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                  Bypass the sync process to launch the simulator interface immediately. Standard diagnostic telemetry will initialize inline.
                </p>
             </div>

             <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest">
                <span>Integrity Link:</span>
                <span className="text-brand-400">PASSED</span>
             </div>
          </div>
        </div>

        {/* HUD Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
           <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-brand-500/40 rounded-tl-[2.5rem]" />
           <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-brand-500/40 rounded-tr-[2.5rem]" />
           <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-brand-500/40 rounded-bl-[2.5rem]" />
           <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-brand-500/40 rounded-br-[2.5rem]" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CountdownModal;
