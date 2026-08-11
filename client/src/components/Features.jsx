import { motion } from 'framer-motion';
import { 
  BrainCircuit, Zap, LineChart, 
  ShieldCheck, Activity, Layers, ChevronRight
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

const Features = () => {
  const { cmsContent } = useCMS();
  const content = cmsContent?.Features || {
    headline: 'Engineered for Performance.',
    description: 'The PrepGenius AI engine is built on state-of-the-art neural networks designed to push your capabilities to the limit.'
  };

  const featureCards = [
    {
      title: 'Neural Interrogation',
      desc: 'Sophisticated AI that adapts its questioning based on your real-time responses and job role specificity.',
      icon: BrainCircuit,
      color: 'brand',
      size: 'wide'
    },
    {
      title: 'Biometric HUD',
      desc: 'Real-time facial expression and stress analysis using advanced computer vision.',
      icon: Activity,
      color: 'rose',
      size: 'medium'
    },
    {
      title: 'Deep Analytics',
      desc: 'Post-interview performance breakdown with actionable improvement metrics.',
      icon: LineChart,
      color: 'accent',
      size: 'medium'
    },
    {
      title: 'Secure Sync',
      desc: 'All your progress and resources are protected by hardware-level security protocols.',
      icon: ShieldCheck,
      color: 'emerald',
      size: 'wide'
    },
    {
      title: 'Neural Reader',
      desc: 'Ingest and analyze complex documentation with our custom high-fidelity reader.',
      icon: Layers,
      color: 'amber',
      size: 'banner'
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#22d3ee 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 max-w-6xl mx-auto">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6"
            >
              <Zap className="w-3 h-3 text-brand-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-400">Core Infrastructure</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1] uppercase"
            >
              Engineered for <br />
              <span className="text-gradient">Performance.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-slate-500 max-w-sm font-medium leading-relaxed pb-2"
          >
            {content.description}
          </motion.p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {featureCards.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 50 }}
              className={`
                group p-8 rounded-[2rem] glass border border-white/5 relative overflow-hidden transition-all duration-500 hover:border-brand-500/30 hover:shadow-[0_20px_50px_rgba(34,211,238,0.05)]
                ${feature.size === 'wide' ? 'md:col-span-2' : ''}
                ${feature.size === 'medium' ? 'md:col-span-1' : ''}
                ${feature.size === 'banner' ? 'md:col-span-3 flex flex-col md:flex-row items-center gap-8' : ''}
              `}
            >
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-${feature.color}-500/5 rounded-full blur-[80px] group-hover:bg-${feature.color}-500/10 transition-colors pointer-events-none`} />

              {/* Watermark Icon */}
              <div className="absolute -bottom-10 -right-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none transform group-hover:scale-110 duration-700">
                <feature.icon className="w-64 h-64" />
              </div>

              <div className={`relative z-10 ${feature.size === 'banner' ? 'flex-shrink-0' : ''}`}>
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 group-hover:bg-${feature.color}-500/20 transition-all duration-500 group-hover:border-${feature.color}-500/40`}>
                  <feature.icon className={`w-6 h-6 text-slate-400 group-hover:text-${feature.color}-400 transition-colors`} />
                </div>
              </div>
              
              <div className="relative z-10 w-full flex flex-col h-full">
                <h3 className={`font-black text-white mb-3 tracking-tight uppercase group-hover:text-${feature.color}-400 transition-colors leading-tight ${feature.size === 'banner' ? 'text-2xl' : 'text-xl'}`}>
                  {feature.title}
                </h3>
                
                <p className={`text-slate-500 font-medium leading-relaxed group-hover:text-slate-300 transition-colors mb-6 ${feature.size === 'banner' ? 'text-base max-w-3xl' : 'text-sm'}`}>
                  {feature.desc}
                </p>

                <div className={`mt-auto ${feature.size === 'banner' ? 'md:mt-0 md:ml-auto' : ''}`}>
                  <button className="flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:bg-brand-500 group-hover:text-black group-hover:border-transparent transition-all active:scale-95">
                    Initialize Module
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

