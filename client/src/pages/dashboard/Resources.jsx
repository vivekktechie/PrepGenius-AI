import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { admin } from '../../lib/api';
import { 
  Palette, 
  Settings as BackendIcon, 
  Database as DatabaseIcon, 
  Rocket, 
  Smartphone, 
  Cloud, 
  Cpu, 
  CheckCircle, 
  ShieldCheck, 
  Binary, 
  Layers, 
  Wrench,
  Search,
  BookOpen,
  ArrowLeft,
  FileText,
  Zap,
  ChevronRight,
  Download,
  Terminal,
  Code2,
  Box,
  Braces,
  Sparkles,
  Dna,
  Eye,
  BrainCircuit,
  GraduationCap,
  Globe,
  FileType,
  Flame,
  Wind,
  Atom,
  Server,
  Infinity,
  Shield,
  Monitor,
  Database,
  Workflow,
  Ship,
  ArrowRight
} from 'lucide-react';
import NeuralReader from '../../components/learning/NeuralReader';

const techIcons = {
  'HTML': { icon: Globe, color: 'text-orange-500', bg: 'from-orange-500/20' },
  'CSS': { icon: Palette, color: 'text-blue-500', bg: 'from-blue-500/20' },
  'JAVASCRIPT': { icon: Zap, color: 'text-yellow-500', bg: 'from-yellow-500/20' },
  'REACT': { icon: Atom, color: 'text-cyan-400', bg: 'from-cyan-400/20' },
  'VUE': { icon: Layers, color: 'text-emerald-500', bg: 'from-emerald-500/20' },
  'NEXT.JS': { icon: Rocket, color: 'text-white', bg: 'from-white/10' },
  'NODE.JS': { icon: Server, color: 'text-green-500', bg: 'from-green-500/20' },
  'EXPRESS.JS': { icon: Terminal, color: 'text-slate-400', bg: 'from-slate-400/20' },
  'PYTHON': { icon: Code2, color: 'text-blue-400', bg: 'from-blue-400/20' },
  'DOCKER': { icon: Box, color: 'text-blue-500', bg: 'from-blue-500/20' },
  'KUBERNETES': { icon: Ship, color: 'text-blue-600', bg: 'from-blue-600/20' },
  'MONGODB': { icon: Database, color: 'text-green-500', bg: 'from-green-500/20' },
  'POSTGRESQL': { icon: DatabaseIcon, color: 'text-indigo-400', bg: 'from-indigo-400/20' },
  'AWS': { icon: Cloud, color: 'text-amber-500', bg: 'from-amber-500/20' },
  'FIREBASE': { icon: Flame, color: 'text-orange-400', bg: 'from-orange-400/20' },
  'TAILWIND': { icon: Wind, color: 'text-cyan-500', bg: 'from-cyan-500/20' },
  'TYPESCRIPT': { icon: Binary, color: 'text-blue-500', bg: 'from-blue-500/20' },
  'RUST': { icon: Cpu, color: 'text-orange-700', bg: 'from-orange-700/20' },
  'GIT': { icon: Workflow, color: 'text-rose-500', bg: 'from-rose-500/20' }
};

const IconMap = {
  Palette,
  BackendIcon,
  DatabaseIcon,
  Rocket,
  Smartphone,
  Cloud,
  Cpu,
  CheckCircle,
  ShieldCheck,
  Binary,
  Layers,
  Wrench,
  Terminal,
  Code2,
  Box,
  Braces,
  Sparkles,
  Dna,
  BrainCircuit,
  GraduationCap,
  FileText
};

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewState, setViewState] = useState('categories'); // categories, nodes
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewingResource, setViewingResource] = useState(null);

  useEffect(() => {
    fetchResources();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await admin.getCategories();
      setCategories(data.categories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchResources = async () => {
    try {
      const { data } = await admin.getResources();
      setResources(data.resources);
    } catch (err) {
      console.error('Resource Sync Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getResourcesForCategory = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    const filtered = resources.filter(res => 
      res.category?.toLowerCase() === cat?.label?.toLowerCase() ||
      res.category?.toLowerCase() === categoryId?.toLowerCase() ||
      res.category?.toLowerCase().includes(categoryId?.toLowerCase())
    );
    if (!searchTerm) return filtered;
    return filtered.filter(res => 
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      res.topic?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getTechStyle = (topic) => {
    const normalized = topic?.toUpperCase() || '';
    return techIcons[normalized] || { icon: Code2, color: 'text-brand-400', bg: 'from-brand-500/20' };
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
       <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-[6px] border-brand-500/10 rounded-full" />
          <div className="absolute inset-0 border-[6px] border-brand-500 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-4 bg-brand-500/20 rounded-full animate-pulse flex items-center justify-center">
             <Dna className="w-8 h-8 text-brand-400 animate-pulse" />
          </div>
       </div>
    </div>
  );

  return (
    <div className="max-w-[1500px] mx-auto pb-32">
      
      {/* Cinematic Header Interface */}
      <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-10">
         <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           className="flex items-center gap-8"
         >
            <div 
              onClick={() => setViewState('categories')}
              className="w-16 h-16 glass rounded-[1.5rem] flex items-center justify-center border border-white/5 shadow-[0_0_30px_rgba(34,211,238,0.1)] cursor-pointer group"
            >
              {viewState === 'categories' ? <Sparkles className="w-8 h-8 text-brand-400 animate-pulse group-hover:scale-110 transition-transform" /> : <ArrowLeft className="w-8 h-8 text-brand-400 group-hover:-translate-x-1 transition-transform" />}
            </div>
            <div>
               <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
                 Neural <span className="text-brand-400">Matrix.</span>
               </h1>
               <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-brand-500 rounded-full animate-ping" />
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none">Global Knowledge Archive • SECURE ACCESS</p>
               </div>
            </div>
         </motion.div>

         <motion.div 
           initial={{ opacity: 0, x: 30 }}
           animate={{ opacity: 1, x: 0 }}
           className="relative group w-full lg:w-[450px]"
         >
            <div className="absolute -inset-[1px] bg-gradient-to-r from-brand-500/20 via-white/5 to-brand-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-[#070b14] border border-white/10 rounded-2xl group-focus-within:border-brand-500/50 transition-all overflow-hidden shadow-2xl">
               <div className="pl-6 pr-4 border-r border-white/5 h-14 flex items-center bg-white/[0.02]">
                  <Search className="w-4 h-4 text-slate-500 group-focus-within:text-brand-400 transition-all" />
               </div>
               <input 
                 type="text" 
                 placeholder="SEARCH NEURAL ASSETS..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full h-14 bg-transparent pl-5 pr-8 text-[11px] font-black text-white focus:outline-none placeholder:text-slate-800 uppercase tracking-[0.2em]"
               />
            </div>
         </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {viewState === 'categories' && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
          >
            {categories.map((cat, i) => {
              const IconComponent = IconMap[cat.icon_name] || IconMap.Code2 || Code2;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setViewState('nodes');
                  }}
                  className="group relative h-[360px] cursor-pointer"
                >
                  {/* Glow Layer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Main Card */}
                  <div className="relative h-full bg-[#030712] border border-white/5 rounded-[2.5rem] p-9 flex flex-col justify-between hover:border-brand-500/40 transition-all duration-500 shadow-2xl overflow-hidden group-hover:bg-white/[0.02]">
                     {/* Background Icon Watermark */}
                     <IconComponent className="absolute -right-6 -bottom-6 w-32 h-32 text-white/[0.015] group-hover:text-brand-500/[0.05] transition-all duration-700" />
                     
                     <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:border-brand-500/20 transition-all duration-500 shadow-xl`}>
                           <IconComponent className={`w-7 h-7 ${cat.color}`} />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3 group-hover:text-brand-400 transition-colors leading-none">{cat.label}</h3>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] leading-relaxed group-hover:text-slate-400 transition-colors max-w-[160px]">{cat.description || cat.desc}</p>
                     </div>

                     <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-8">
                        <div className="flex flex-col">
                           <div className="text-2xl font-black text-white tabular-nums tracking-tighter leading-none mb-1.5">
                             {getResourcesForCategory(cat.id).length}
                           </div>
                           <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">Active Nodes</span>
                        </div>
                        <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-black transition-all shadow-lg">
                           <ChevronRight className="w-6 h-6" />
                        </div>
                     </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {viewState === 'nodes' && (
          <motion.div
            key="nodes"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
          >
             {getResourcesForCategory(selectedCategory.id).map((res, i) => {
               const tech = getTechStyle(res.topic);
               const TechIcon = tech.icon;
               
               return (
                 <motion.div
                   key={res.id}
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.05 }}
                   className="group relative"
                 >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative h-full bg-[#030712] border border-white/5 rounded-[2.5rem] p-6 lg:p-7 flex flex-col hover:border-brand-500/40 transition-all duration-500 shadow-2xl">
                       {/* Header */}
                       <div className="flex items-center gap-4 mb-8">
                          <div className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform ${tech.color}`}>
                             <TechIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                             <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-brand-400 transition-colors truncate">
                               {res.topic || res.title}
                             </h4>
                             <div className="flex items-center gap-2 mt-1">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Active</span>
                             </div>
                          </div>
                       </div>

                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic mb-8 flex-1 line-clamp-3">
                         "{res.description || `Tactical intelligence nodes for mastering ${res.topic || res.title} through deep architectural analysis.`}"
                       </p>

                       <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => res.notes_url && setViewingResource({ ...res, current_url: res.notes_url, current_type: 'Notes' })}
                            className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${res.notes_url ? 'bg-white/5 border border-white/10 text-white hover:bg-emerald-500 hover:text-black shadow-lg shadow-emerald-500/10' : 'opacity-20 cursor-not-allowed'}`}
                          >
                            <GraduationCap className="w-3 h-3" /> Notes
                          </button>
                          <button 
                            onClick={() => res.prep_url && setViewingResource({ ...res, current_url: res.prep_url, current_type: 'Prep' })}
                            className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${res.prep_url ? 'bg-brand-500 text-black shadow-lg shadow-brand-500/20 hover:scale-[1.02]' : 'opacity-20 cursor-not-allowed'}`}
                          >
                            <BrainCircuit className="w-3 h-3" /> Prep
                          </button>
                       </div>
                    </div>
                 </motion.div>
               );
             })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neural Reader */}
      <NeuralReader 
        isOpen={!!viewingResource}
        onClose={() => setViewingResource(null)}
        title={viewingResource?.topic || viewingResource?.title || 'QUANTUM MANIFEST'}
        subtitle={`${viewingResource?.current_type || 'NEURAL'} ASSET`}
        pdfUrl={viewingResource?.current_url}
      />
    </div>
  );
};

export default Resources;
