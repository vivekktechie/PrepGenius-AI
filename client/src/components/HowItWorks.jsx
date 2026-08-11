import { motion } from 'framer-motion';
import { UserPlus, FileUp, MessageSquare, LineChart, ChevronRight, Zap, Target, Cpu, ArrowRight, Activity, Brain, Shield } from 'lucide-react';

const steps = [
  {
    title: "Neural Sync",
    subtitle: "PHASE 01",
    description: "INITIALIZE YOUR CAREER PROFILE AND ESTABLISH NEURAL LINK PARAMETERS FOR TARGETED INTERROGATION.",
    icon: UserPlus,
    color: "text-brand-400",
    glow: "shadow-[0_0_30px_rgba(34,211,238,0.2)]"
  },
  {
    title: "Asset Analysis",
    subtitle: "PHASE 02",
    description: "DEPLOY YOUR PROFESSIONAL PORTFOLIO FOR DEEP-LEARNING ATS OPTIMIZATION AND SKILL MAPPING.",
    icon: FileUp,
    color: "text-purple-400",
    glow: "shadow-[0_0_30_rgba(168,85,247,0.2)]"
  },
  {
    title: "Tactical Simulation",
    subtitle: "PHASE 03",
    description: "ENGAGE IN HIGH-INTENSITY AI-DRIVEN INTERVIEW SCENARIOS WITH REAL-TIME BIOMETRIC FEEDBACK.",
    icon: Activity,
    color: "text-rose-400",
    glow: "shadow-[0_0_30px_rgba(244,63,94,0.2)]"
  },
  {
    title: "Mastery Index",
    subtitle: "PHASE 04",
    description: "REVIEW COMPREHENSIVE PERFORMANCE METRICS AND BRIDGE GAPS WITH CURATED NEURAL RESOURCES.",
    icon: Brain,
    color: "text-emerald-400",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.2)]"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 bg-[#020617] relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-8"
          >
            <Shield className="w-4 h-4 text-brand-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-400">Tactical Operational Protocol</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-[6rem] font-black text-white tracking-tighter leading-[0.85] uppercase mb-8"
          >
            The <span className="text-brand-500">Genesis</span> <br/>
            <span className="text-white/20">Protocol.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto font-black text-[12px] uppercase tracking-[0.3em] leading-loose"
          >
            A high-fidelity systematic approach to professional mastery through immersive AI simulation and neural tracking.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group relative"
            >
              {/* Cinematic Tile */}
              <div className="h-full bg-[#030712] border border-white/5 rounded-[2.5rem] p-10 flex flex-col hover:border-brand-500/40 transition-all duration-700 shadow-2xl relative overflow-hidden">
                {/* Number Watermark */}
                <div className="absolute top-10 right-10 text-8xl font-black text-white/[0.02] group-hover:text-brand-500/[0.05] transition-colors leading-none pointer-events-none">
                  0{idx + 1}
                </div>

                <div className="relative z-10 flex-1">
                  <div className={`w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-12 group-hover:scale-110 group-hover:border-brand-500/30 group-hover:bg-brand-500/5 transition-all duration-500 ${step.color} ${step.glow}`}>
                    <step.icon className="w-8 h-8" />
                  </div>

                  <div className="space-y-4">
                    <span className="block text-[10px] font-black text-brand-500 uppercase tracking-[0.4em] mb-2">{step.subtitle}</span>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-brand-400 transition-colors leading-none">{step.title}</h3>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] leading-loose group-hover:text-slate-400 transition-colors mt-6">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Bar Indicator */}
                <div className="mt-12 pt-8 border-t border-white/5 relative z-10">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Protocol Verified</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-800 group-hover:text-brand-400 group-hover:translate-x-2 transition-all" />
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Connection Line */}
        <div className="mt-32 relative">
           <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-white/5" />
           </div>
           <div className="relative flex justify-center">
              <span className="px-8 py-3 bg-[#020617] text-[10px] font-black text-brand-500 uppercase tracking-[0.5em] border border-white/5 rounded-full">
                 Full System Integration Active
              </span>
           </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
