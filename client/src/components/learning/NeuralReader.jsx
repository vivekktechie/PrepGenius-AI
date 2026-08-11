import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Download, Share2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, FileText, Sparkles, ExternalLink } from 'lucide-react';

const NeuralReader = ({ isOpen, onClose, title, subtitle, pdfUrl }) => {
  const isPdf = pdfUrl && (
    pdfUrl.toLowerCase().endsWith('.pdf') || 
    pdfUrl.includes('/uploads/') || 
    pdfUrl.includes('supabase.co/storage') || 
    pdfUrl.startsWith('blob:')
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#020617]/90 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full h-full max-w-7xl glass-dark border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          >
            {/* Tactical HUD Header */}
            <div className="h-20 border-b border-white/5 bg-black/40 px-8 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                  <FileText className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm tracking-tight">{title}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500">{subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl">
                  <button className="p-1.5 hover:text-cyan-400 transition-colors"><ZoomOut className="w-4 h-4" /></button>
                  <div className="w-[1px] h-4 bg-white/10 mx-1" />
                  <span className="text-[10px] font-black text-white">100%</span>
                  <div className="w-[1px] h-4 bg-white/10 mx-1" />
                  <button className="p-1.5 hover:text-cyan-400 transition-colors"><ZoomIn className="w-4 h-4" /></button>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                    <Download className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={onClose}
                    className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all group"
                  >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Neural Viewport */}
            <div className="flex-1 bg-black/60 relative group flex items-center justify-center">
              {isPdf ? (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  {/* Fallback/Loading State */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none opacity-20 group-hover:opacity-10 transition-opacity">
                    <Sparkles className="w-24 h-24 text-brand-500 animate-pulse" />
                    <p className="text-sm font-black uppercase tracking-widest text-brand-400">Synchronizing Archive...</p>
                  </div>
                  
                  <iframe 
                    src={pdfUrl} 
                    className="w-full h-full relative z-10 border-none bg-transparent"
                    title="PDF Viewer"
                  />
                </div>
              ) : (
                <div className="relative z-10 text-center max-w-xl p-8 space-y-6">
                  <div className="w-20 h-20 rounded-3xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto shadow-2xl">
                     <ExternalLink className="w-10 h-10 text-brand-400 animate-pulse" />
                  </div>
                  <div>
                     <h4 className="text-xl font-black text-white uppercase tracking-tighter">[ Secure Web Gateway ]</h4>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mt-2">External Terminal Node Detected</p>
                  </div>
                  <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase">
                     To maintain protocol security and view the complete interactive material, this documentation is loaded via a secure external subnet.
                  </p>
                  <button 
                    onClick={() => window.open(pdfUrl, '_blank')}
                    className="mx-auto flex items-center justify-center gap-3 px-8 py-4 bg-brand-500 hover:bg-brand-400 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-brand-500/20 active:scale-95 cursor-pointer animate-bounce"
                  >
                     Access Resource Node
                     <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Status Bar */}
            <div className="h-10 border-t border-white/5 bg-black/40 px-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-emerald-500">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span>Secure Protocol Active</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-brand-400">PrepGenius Intel</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NeuralReader;
