import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import AIEngine from '../components/AIEngine';
import { ArrowRight, Sparkles, Globe, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

import { useCMS } from '../context/CMSContext';

const LandingPage = () => {
  const { cmsContent } = useCMS();
  const contentAbout = cmsContent?.About || {
    headline: 'Ready to Ace Your Next Interview?',
    description: 'Join thousands of candidates who have already mastered their skills and landed dream jobs using PrepGenius AI. Completely free, forever.'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-slate-950 min-h-screen selection:bg-brand-500/30 selection:text-brand-200"
    >
      <Navbar />
      
      <main>
        <Hero />
        
        <Features />
        
        <HowItWorks />
        
        <AIEngine />
        
        {/* Final CTA Section - Ultra Premium */}
        <section className="py-24 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass p-12 md:p-20 rounded-[4rem] border border-white/5 text-center relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
            >
              {/* Background Gradient Mesh */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-accent-600/10 -z-10" />
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-500/20 rounded-full blur-[80px] animate-pulse" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-500/20 rounded-full blur-[80px] animate-pulse delay-700" />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-10"
              >
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Final Phase Initialization</span>
              </motion.div>

               <h2 className="text-4xl md:text-[4.5rem] font-black mb-8 tracking-tighter leading-[0.9] text-white">
                {contentAbout.headline.split(' ').length > 2 
                  ? contentAbout.headline.split(' ').slice(0, -2).join(' ') 
                  : contentAbout.headline} <br />
                {contentAbout.headline.split(' ').length > 2 && (
                  <span className="text-gradient">
                    {contentAbout.headline.split(' ').slice(-2).join(' ')}
                  </span>
                )}
              </h2>
              
              <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                {contentAbout.description}
              </p>
              
              <Link 
                to="/register"
                className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.15)] group"
              >
                Start Your Journey <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>

              {/* Status Indicators */}
              <div className="flex flex-wrap justify-center gap-10 mt-20 opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">System Stable</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-brand-400 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Global Coverage</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-400 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Neural Sync Active</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer - Minimalist & High-Tech */}
      <footer className="py-20 border-t border-white/5 bg-black/40 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Logo className="mb-6" />
              <p className="text-slate-500 font-medium text-base max-w-sm leading-relaxed">
                The world's most advanced AI interview simulator. Master the art of interrogation and land your dream role.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-8">Navigation</h4>
              <ul className="space-y-4">
                <li><a href="#features" className="text-slate-500 hover:text-brand-400 transition-colors font-medium">Features</a></li>
                <li><a href="#how-it-works" className="text-slate-500 hover:text-brand-400 transition-colors font-medium">How it Works</a></li>
                <li><a href="#ai-tech" className="text-slate-500 hover:text-brand-400 transition-colors font-medium">AI Engine</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-8">Operative</h4>
              <ul className="space-y-4">
                <li><Link to="/login" className="text-slate-500 hover:text-brand-400 transition-colors font-medium">Agent Login</Link></li>
                <li><Link to="/register" className="text-slate-500 hover:text-brand-400 transition-colors font-medium">Establish Link</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-16 border-t border-white/5">
            <p className="text-slate-600 text-[10px] tracking-[0.3em] uppercase font-black">
              &copy; 2026 PREPGENIUS AI. THE FUTURE OF PREPARATION.
            </p>
            
            <div className="flex items-center gap-10">
               <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-slate-700" />
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Global Matrix</span>
               </div>
               <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-slate-700" />
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Enforced</span>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default LandingPage;
