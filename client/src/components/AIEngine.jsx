import { motion } from 'framer-motion';
import { Cpu, Eye, Mic, Network, Sparkles, Zap, Brain, Radio, Binary, Activity, Terminal } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

const technologies = [
  {
    icon: Cpu,
    title: "NLP Matrix",
    desc: "Advanced Transformers analyze your semantic structure and sentiment with sub-millisecond latency.",
    tag: "BERT / GPT-V"
  },
  {
    icon: Eye,
    title: "Vision Core",
    desc: "Real-time facial analysis tracks 42 unique micro-expressions to gauge confidence and stress.",
    tag: "OPENCV PRO"
  },
  {
    icon: Mic,
    title: "Vocal Sync",
    desc: "Whisper-powered STT ensures perfect transcription even in complex acoustic environments.",
    tag: "WHISPER CORE"
  },
  {
    icon: Network,
    title: "Neural Path",
    desc: "Neural networks adjust interrogation depth based on your performance and job role requirements.",
    tag: "CUSTOM ML"
  }
];

const AIEngine = () => {
  const { cmsContent } = useCMS();
  const content = cmsContent?.AIEngine || {
    headline: 'State-of-the-Art AI.',
    description: 'Powered by the latest LLMs and custom biometric analysis models.',
    stats: { users: '50k+', success: '92%', companies: '100+' }
  };

  return (
    <section id="ai-tech" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(to right, #22d3ee 1px, transparent 1px), linear-gradient(to bottom, #22d3ee 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-brand-500/5 blur-[250px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
              <Binary className="w-5 h-5 text-brand-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-400">Neural Core v2.5</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-[4.5rem] font-black text-white mb-8 tracking-tight leading-[0.9] uppercase"
          >
            The Engine of <br />
            <span className="text-gradient">Intelligence.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium"
          >
            {content.description} Our ecosystem of specialized AI models works in absolute harmony to deliver the world's most realistic preparation experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {technologies.map((tech, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group p-8 glass rounded-[2.5rem] border border-white/5 hover:border-brand-500/30 transition-all duration-700 relative overflow-hidden"
            >
              {/* Dynamic Scan Line */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand-500/0 via-brand-500/[0.03] to-brand-500/0 -translate-y-full group-hover:translate-y-full transition-transform duration-[2000ms] ease-linear repeat-infinite" />
              
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-500/10 transition-all duration-500 border border-white/10 group-hover:border-brand-500/30">
                <tech.icon className="w-6 h-6 text-slate-500 group-hover:text-brand-400 transition-colors" />
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-500/60 group-hover:text-brand-400 transition-colors">{tech.tag}</span>
              </div>
              
              <h3 className="text-xl font-black text-white mb-4 tracking-tight uppercase group-hover:translate-x-1 transition-transform">{tech.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed group-hover:text-slate-300 transition-colors">{tech.desc}</p>
              
              {/* Decorative HUD Elements */}
              <div className="mt-10 flex items-center justify-between opacity-20 group-hover:opacity-100 transition-opacity">
                 <div className="flex gap-1">
                    {[1,2,3,4].map(i => <div key={i} className="w-4 h-1 bg-white/10 group-hover:bg-brand-500/30 transition-colors" />)}
                 </div>
                 <Terminal className="w-4 h-4 text-white/20" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Infrastructure Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto border border-white/5 p-8 rounded-[3rem] glass relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/[0.02] to-transparent pointer-events-none" />
          {[
            { label: 'Neural Throughput', value: '1.2 PB/s', icon: Zap },
            { label: 'Global Latency', value: '< 20ms', icon: Radio },
            { label: 'Model Accuracy', value: '99.98%', icon: Sparkles },
            { label: 'Active Clusters', value: '256', icon: Activity }
          ].map((stat, i) => (
            <div key={i} className="text-center relative z-10 group">
              <stat.icon className="w-5 h-5 text-brand-500/30 mx-auto mb-3 group-hover:text-brand-500 transition-colors" />
              <div className="text-2xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Extreme Visual Flourish */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/10 to-transparent" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 blur-[100px] rounded-full" />
    </section>
  );
};

export default AIEngine;
