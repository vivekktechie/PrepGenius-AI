import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Lock, Cpu, Brain, Zap, Shield, Sparkles, 
  Terminal, Activity, RefreshCw, BarChart3, Database, Send, Play
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

const Hero = () => {
  const { cmsContent } = useCMS();
  
  // Dynamic Content Safe Load
  const content = cmsContent?.Hero || {
    badge: 'Next Gen AI Interview Platform',
    headline: 'Master Your Career With Intelligence.',
    description: 'Elevate your interview game with our AI-powered simulator. Real-time feedback, deep NLP analysis, and resume optimization to land your dream job.',
    ctaText: 'Get Started for Free',
    ctaLink: '/register'
  };

  // Safe split logic for custom CMS headlines
  const headlineWords = content.headline.split(' ');
  const mainHeadline = headlineWords.length > 2 ? headlineWords.slice(0, -2).join(' ') : content.headline;
  const highlightHeadline = headlineWords.length > 2 ? headlineWords.slice(-2).join(' ') : '';

  // Interactive HUD States
  const [hudPhase, setHudPhase] = useState('idle'); // idle, active, grading
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [metrics, setMetrics] = useState({ stress: 45, confidence: 60, ats: 55 });
  const [activeChip, setActiveChip] = useState(null);

  const mockPrompts = {
    question: "Initialize System Link. How do you approach scaling a distributed transactional database under high peak write loads?",
    choices: [
      { id: 'a', label: "Apply Read-Through Caching", stressEffect: -15, confEffect: 15, atsEffect: 20 },
      { id: 'b', label: "Implement Eventual Consistency Queue", stressEffect: 10, confEffect: 25, atsEffect: 35 },
      { id: 'c', label: "Enforce Strict Distributed Mutexes", stressEffect: 30, confEffect: -10, atsEffect: 10 }
    ]
  };

  const handleSelectChoice = (choice, idx) => {
    setActiveChip(idx);
    setSelectedAnswer(choice);
    // Animate gauges dynamically
    setMetrics({
      stress: Math.max(10, Math.min(95, 45 + choice.stressEffect)),
      confidence: Math.max(10, Math.min(100, 60 + choice.confEffect)),
      ats: Math.max(10, Math.min(100, 55 + choice.atsEffect))
    });
    setHudPhase('grading');
  };

  const handleResetDemo = () => {
    setHudPhase('active');
    setSelectedAnswer(null);
    setActiveChip(null);
    setMetrics({ stress: 35, confidence: 65, ats: 60 });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden bg-[#020617]">
      
      {/* 3D Cosmic Background Particle Matrix */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_30%,rgba(14,165,233,0.08)_0%,transparent_60%)]" />
         <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[180px] animate-pulse" />
         <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[180px] animate-pulse delay-1000" />
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Column 1: Marketing Deck (Left) */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
             <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
               className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.1)] group cursor-default"
             >
                <div className="w-2 h-2 bg-brand-400 rounded-full animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-400 group-hover:text-white transition-colors">{content.badge}</span>
                <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
             </motion.div>

             <motion.h1
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tighter text-white leading-[0.9] uppercase"
             >
                <span className="block mb-3">{mainHeadline}</span>
                {highlightHeadline && (
                  <span className="text-[#00f5ff] drop-shadow-[0_0_20px_rgba(0,245,255,0.25)]">
                     {highlightHeadline}
                  </span>
                )}
             </motion.h1>

             <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
             >
                {content.description}
             </motion.p>

             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.6 }}
               className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
             >
                <Link 
                  to={content.ctaLink}
                  className="group relative px-8 py-4 bg-white text-black rounded-full font-black text-base overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.15)] flex items-center gap-3"
                >
                   {content.ctaText} <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
                
                <Link 
                  to="/login"
                  className="group px-8 py-4 glass text-white rounded-full font-black text-base border border-white/10 transition-all hover:bg-white/5 active:scale-95 flex items-center gap-4"
                >
                   <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-brand-500 group-hover:text-black transition-all">
                      <Lock className="w-4 h-4" />
                   </div>
                   Agent Login
                </Link>
             </motion.div>

             {/* Minimal Key Metrics Panel */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 1, delay: 0.8 }}
               className="grid grid-cols-3 gap-6 pt-10 border-t border-white/5 max-w-lg mx-auto lg:mx-0"
             >
                {[
                  { value: '50k+', label: 'Sessions' },
                  { value: '92%', label: 'ATS Score' },
                  { value: '99.9%', label: 'Uptime' }
                ].map((item, idx) => (
                  <div key={idx} className="text-center lg:text-left">
                     <span className="block text-2xl font-black text-white">{item.value}</span>
                     <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">{item.label}</span>
                  </div>
                ))}
             </motion.div>
          </div>

          {/* Column 2: Interactive AI Live HUD Simulator (Right) */}
          <div className="lg:col-span-6 flex justify-center w-full relative">
             
             {/* HUD Decorative Mesh background */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-500/[0.02] blur-[80px] pointer-events-none rounded-full" />
             
             <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.3 }}
               className="w-full max-w-[520px] bg-[#070b14]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 lg:p-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
             >
                {/* Visual grid inside simulator */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                {/* HUD Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6 relative z-10">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Agent HUD Simulator</span>
                   </div>
                   <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                      <Cpu className="w-3.5 h-3.5 text-brand-400" />
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">NEURAL CORE V2.5</span>
                   </div>
                </div>

                <AnimatePresence mode="wait">
                   {hudPhase === 'idle' ? (
                      /* Idle Phase Screen */
                      <motion.div 
                        key="idle-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-10 space-y-6 relative z-10"
                      >
                         <div className="w-24 h-24 bg-brand-500/10 border border-brand-500/20 rounded-[2rem] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,211,238,0.15)] relative group">
                            <Brain className="w-10 h-10 text-brand-400 animate-pulse" />
                         </div>
                         <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">AI Interrogation Sync</h3>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-2 max-w-sm mx-auto leading-relaxed">
                               Test your response speeds and ATS metrics against simulated intelligence scenarios instantly.
                            </p>
                         </div>
                         <button
                           onClick={() => setHudPhase('active')}
                           className="inline-flex items-center gap-3 px-8 py-4 bg-brand-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand-400 active:scale-95 transition-all shadow-lg shadow-brand-500/20"
                         >
                            <Play className="w-3.5 h-3.5 fill-black" /> Begin Live Session
                         </button>
                      </motion.div>
                   ) : (
                      /* Interactive Simulation Phase Screen */
                      <motion.div 
                        key="active-screen"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6 relative z-10"
                      >
                         {/* AI Message Bubble */}
                         <div className="bg-black/40 border border-white/5 rounded-2xl p-5 space-y-3 relative">
                            <div className="flex items-center gap-2 mb-1">
                               <div className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
                               <span className="text-[8px] font-black text-brand-400 uppercase tracking-widest">AI Interrogator</span>
                            </div>
                            <p className="text-xs font-bold text-slate-200 leading-relaxed">
                               {mockPrompts.question}
                            </p>
                            {/* Live Soundwave visualizer */}
                            <div className="flex items-end gap-1.5 h-6 pt-2 opacity-50">
                               {[1,2,3,4,5,6,7,8,9,10].map(i => (
                                  <div 
                                    key={i} 
                                    className="w-1 bg-brand-400 rounded-full animate-bounce"
                                    style={{ 
                                      height: `${Math.random() * 100}%`,
                                      animationDuration: `${0.6 + (i * 0.1)}s`
                                    }} 
                                  />
                               ))}
                            </div>
                         </div>

                         {/* Interactive Choice list */}
                         {hudPhase === 'active' ? (
                            <div className="space-y-2">
                               {mockPrompts.choices.map((choice, index) => (
                                  <button
                                    key={choice.id}
                                    onClick={() => handleSelectChoice(choice, index)}
                                    className="w-full text-left p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-brand-500/20 text-slate-400 hover:text-white rounded-xl transition-all text-xs font-semibold flex items-center justify-between"
                                  >
                                     <span>{choice.label}</span>
                                     <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </button>
                               ))}
                            </div>
                         ) : (
                            /* Answer graded screen */
                            <div className="bg-brand-500/5 border border-brand-500/20 rounded-2xl p-5 space-y-4">
                               <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                     <Activity className="w-4 h-4 text-brand-400 animate-pulse" />
                                     <span className="text-[9px] font-black text-brand-400 uppercase tracking-widest">Module Graded</span>
                                  </div>
                                  <button 
                                    onClick={handleResetDemo}
                                    className="text-[8px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2"
                                  >
                                     <RefreshCw className="w-3 h-3" /> Reset Probe
                                  </button>
                               </div>
                               <div>
                                  <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Your response choice</span>
                                  <span className="block text-xs font-bold text-white uppercase">{selectedAnswer?.label}</span>
                               </div>
                               <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                  Semantic match verified. Confidence quotient modulated to {metrics.confidence}%. Stress parameters held within nominal range.
                                </p>
                            </div>
                         )}

                         {/* Real-time HUD Metrics Gauges */}
                         <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                            {[
                              { label: 'Stress Levels', value: `${metrics.stress}%`, color: 'text-rose-400', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]' },
                              { label: 'Confidence Index', value: `${metrics.confidence}%`, color: 'text-brand-400', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.15)]' },
                              { label: 'ATS Match Rate', value: `${metrics.ats}%`, color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]' }
                            ].map((gauge, i) => (
                               <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-xl text-center relative group overflow-hidden">
                                  <span className="block text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1.5 leading-none">{gauge.label}</span>
                                  <span className={`block text-xl font-black tracking-tight ${gauge.color} leading-none`}>{gauge.value}</span>
                               </div>
                            ))}
                         </div>

                      </motion.div>
                   )}
                </AnimatePresence>
             </motion.div>
             
             {/* HUD decorative side borders */}
             <div className="absolute top-[20%] left-[-4%] w-6 h-12 border-l border-y border-white/10 rounded-l-md pointer-events-none" />
             <div className="absolute bottom-[20%] right-[-4%] w-6 h-12 border-r border-y border-white/10 rounded-r-md pointer-events-none" />
          </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;
