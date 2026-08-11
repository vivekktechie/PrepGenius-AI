import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Logo = ({ className = "", hideText = false }) => {
  const location = useLocation();

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Link 
      to="/" 
      onClick={handleLogoClick}
      className={`flex items-center gap-2 group ${className}`}
    >
      <motion.div 
        whileHover={{ rotate: 12, scale: 1.1 }}
        className="p-2 bg-brand-500 rounded-lg shadow-lg shadow-brand-500/20"
      >
        <Sparkles className="w-6 h-6 text-white" />
      </motion.div>
      {!hideText && (
        <span className="text-2xl font-black tracking-tighter text-white whitespace-nowrap">
          PrepGenius <span className="text-brand-400">AI</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
