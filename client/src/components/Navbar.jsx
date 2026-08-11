import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Sparkles } from 'lucide-react';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3.5 bg-slate-950/80 backdrop-blur-2xl border border-white/5 mx-6 mt-3 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
         <Logo />
      </div>

      {/* Navigation Nodes */}
      <div className="hidden md:flex items-center gap-8 bg-white/[0.02] border border-white/5 px-6 py-2.5 rounded-full">
        {[
          { href: '#features', label: 'Features' },
          { href: '#how-it-works', label: 'How it Works' },
          { href: '#ai-tech', label: 'AI Engine' }
        ].map((node) => (
          <a 
            key={node.href}
            href={node.href} 
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors relative group"
          >
            {node.label}
            <span className="absolute bottom-[-4px] left-0 w-full h-[1px] bg-brand-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </a>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <Link 
          to="/login" 
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors px-4 py-2"
        >
          Login
        </Link>
        <Link 
          to="/register" 
          className="group relative px-6 py-3 bg-brand-500 hover:bg-brand-400 text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-500/10 hover:shadow-brand-500/25 active:scale-95 flex items-center gap-2"
        >
          Get Started <Sparkles className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
