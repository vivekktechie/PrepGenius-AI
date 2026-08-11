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
  Plus,
  Trash2,
  FileUp,
  X,
  Database,
  Upload
} from 'lucide-react';
import NeuralReader from '../../components/learning/NeuralReader';

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
  Plus,
  Trash2,
  FileText
};

const ResourceManager = () => {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewState, setViewState] = useState('categories'); // categories, topics, resources
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [viewingResource, setViewingResource] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [uploadingNotes, setUploadingNotes] = useState(false);
  const [uploadingPrep, setUploadingPrep] = useState(false);

  const [newCategory, setNewCategory] = useState({
    label: '',
    description: '',
    icon_name: 'Code2',
    color: 'text-brand-500',
    bg: 'from-brand-500/20'
  });

  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    category: '',
    topic: '',
    notes_url: '',
    prep_url: '',
    file_type: 'PDF'
  });

  const suggestedTopics = {
    'Frontend Development': ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Next.js', 'TypeScript', 'Tailwind'],
    'Backend Development': ['Node.js', 'Express.js', 'Python', 'Django', 'Go', 'FastAPI', 'Spring Boot'],
    'Database Design': ['PostgreSQL', 'MongoDB', 'Redis', 'TiDB', 'MySQL', 'Elasticsearch'],
    'DevOps & Deployment': ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'AWS', 'Nginx'],
    'Data Science & AI': ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'NLP', 'Computer Vision', 'LLMs'],
    'Cybersecurity': ['OWASP', 'Penetration Testing', 'Cryptography', 'Network Security'],
    'Programming Languages': ['C++', 'Rust', 'Java', 'Python', 'Go', 'Swift', 'Kotlin']
  };

  useEffect(() => {
    fetchResources();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !newResource.category) {
      setNewResource(prev => ({ ...prev, category: categories[0].label }));
    }
  }, [categories]);

  const fetchCategories = async () => {
    try {
      const { data } = await admin.getCategories();
      setCategories(data.categories);
    } catch (err) {
      console.error('Category Fetch Error:', err);
    }
  };

  const fetchResources = async () => {
    try {
      const { data } = await admin.getResources();
      setResources(data.resources);
    } catch (err) {
      console.error('Resource Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await admin.createCategory(newCategory);
      setNewCategory({
        label: '',
        description: '',
        icon_name: 'Code2',
        color: 'text-brand-500',
        bg: 'from-brand-500/20'
      });
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create category.');
    }
  };

  const handleDeleteCategory = async (id, label) => {
    if (!window.confirm(`Are you sure you want to delete the category "${label}"? This will delete all sub-cards inside it!`)) return;
    try {
      await admin.deleteCategory(id);
      fetchCategories();
      fetchResources();
    } catch (err) {
      alert('Failed to delete category.');
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    
    if (type === 'notes') setUploadingNotes(true);
    else setUploadingPrep(true);

    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const { data } = await admin.uploadPdf(formData);
      if (editingResource) {
        setEditingResource(prev => ({ 
          ...prev, 
          [type === 'notes' ? 'notes_url' : 'prep_url']: data.url 
        }));
      } else {
        setNewResource(prev => ({ ...prev, [type === 'notes' ? 'notes_url' : 'prep_url']: data.url }));
      }
    } catch (err) {
      alert('Neural link interrupted during transmission.');
    } finally {
      if (type === 'notes') setUploadingNotes(false);
      else setUploadingPrep(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = editingResource || newResource;
    
    if (!payload.notes_url && !payload.prep_url) {
      alert('Please upload at least one intelligence asset.');
      return;
    }

    try {
      if (editingResource) {
        await admin.updateResource(editingResource.id, editingResource);
      } else {
        await admin.createResource(newResource);
      }
      setShowModal(false);
      setEditingResource(null);
      setNewResource({ 
        title: '', 
        description: '', 
        category: 'Frontend Development', 
        topic: '',
        notes_url: '', 
        prep_url: '',
        file_type: 'PDF' 
      });
      fetchResources();
    } catch (err) {
      alert('Failed to process neural asset.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Terminate this neural node?')) return;
    try {
      await admin.deleteResource(id);
      fetchResources();
    } catch (err) {
      alert('Failed to terminate node.');
    }
  };

  const handleMasterSync = async () => {
    if (!window.confirm('Synchronize Master Archive? This will inject the dual-url universal technology manifest.')) return;
    try {
      await admin.seedResources();
      fetchResources();
      alert('Universal Technology Manifest Synchronized.');
    } catch (err) {
      const errorMsg = err.response?.data?.details || err.response?.data?.error || err.message;
      alert('Failed to sync master archive: ' + errorMsg);
    }
  };

  const handlePurgeAll = async () => {
    if (!window.confirm('CRITICAL ACTION: Execute global library purge? This will terminate ALL neural nodes.')) return;
    try {
      await admin.purgeResources();
      fetchResources();
      alert('Global library purged.');
    } catch (err) {
      alert('Failed to purge library.');
    }
  };

  const openEditModal = (res) => {
    setEditingResource({ ...res });
    setShowModal(true);
  };

  const getTopicsForCategory = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    const categoryResources = resources.filter(res => 
      res.category?.toLowerCase() === cat?.label?.toLowerCase() ||
      res.category?.toLowerCase() === categoryId?.toLowerCase() ||
      res.category?.toLowerCase().includes(categoryId?.toLowerCase())
    );
    const topics = [...new Set(categoryResources.map(res => res.topic || 'General'))];
    return topics.sort();
  };

  const getResourcesForTopic = (categoryId, topic) => {
    const cat = categories.find(c => c.id === categoryId);
    return resources.filter(res => 
      (res.category?.toLowerCase() === cat?.label?.toLowerCase() ||
       res.category?.toLowerCase() === categoryId?.toLowerCase() ||
       res.category?.toLowerCase().includes(categoryId?.toLowerCase())) && 
      (res.topic || 'General') === topic
    );
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#030712]">
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
    <div className="min-h-screen pb-32 max-w-[1600px] mx-auto px-4 lg:px-0">
      
      {/* Top Tactical Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 pt-10">
         <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => setViewState('categories')}>
               <div className="absolute -inset-2 bg-brand-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
               <div className="relative w-14 h-14 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl transition-all group-hover:border-brand-500/50 group-hover:bg-brand-900/10">
                  {viewState === 'categories' ? <Database className="w-7 h-7 text-brand-500" /> : <ArrowLeft className="w-7 h-7 text-brand-500" />}
               </div>
            </div>
            <div>
               <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                 {viewState === 'categories' ? 'Asset Manifest' : 
                  viewState === 'topics' ? selectedCategory.label :
                  selectedTopic}
               </h1>
               <div className="flex items-center gap-3">
                  <div className="h-[2px] w-8 bg-brand-500" />
                  <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.4em]">
                     {viewState === 'categories' ? 'Global Command Center' : 
                      viewState === 'topics' ? 'Sub-Domain Management' :
                      'Dual-Archive Control'}
                  </p>
               </div>
            </div>
         </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={handleMasterSync}
               className="px-8 py-4 bg-[#070b14]/50 border border-brand-500/20 rounded-2xl text-[10px] font-black text-brand-400 uppercase tracking-widest hover:bg-brand-500/10 hover:text-white transition-all shadow-xl cursor-pointer"
             >
                Master Sync
             </button>
             <button 
               onClick={() => setShowCategoryModal(true)}
               className="px-8 py-4 bg-[#070b14]/50 border border-brand-500/20 rounded-2xl text-[10px] font-black text-brand-400 uppercase tracking-widest hover:bg-brand-500/10 hover:text-white transition-all shadow-xl cursor-pointer"
             >
                Add Category
             </button>
             <button 
               onClick={() => {
                 setEditingResource(null);
                 setShowModal(true);
               }}
               className="px-8 py-4 bg-brand-500 rounded-2xl text-[10px] font-black text-black uppercase tracking-widest hover:bg-brand-400 transition-all shadow-xl shadow-brand-500/20 cursor-pointer"
             >
                Deploy Intel
             </button>
          </div>
      </div>

      <AnimatePresence mode="wait">
        {viewState === 'categories' && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {categories.map((cat) => {
              const IconComponent = IconMap[cat.icon_name] || IconMap.Code2 || Code2;
              return (
                <motion.div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    const topics = getTopicsForCategory(cat.id);
                    if (topics.length === 1 && (topics[0] === 'General' || !topics[0])) {
                      setSelectedTopic(topics[0] || 'General');
                      setViewState('resources');
                    } else {
                      setViewState('topics');
                    }
                  }}
                  className="group relative p-12 bg-[#070b14] border border-white/5 rounded-[3rem] hover:border-brand-500/30 transition-all cursor-pointer shadow-2xl overflow-hidden min-h-[400px] flex flex-col justify-between"
                >
                  <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${cat.bg} to-transparent blur-[80px] opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none`} />
                  
                  {/* Delete Category Action */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(cat.id, cat.label);
                    }}
                    className="absolute top-8 right-8 p-3 bg-rose-500/10 hover:bg-rose-500 rounded-xl text-rose-500 hover:text-white transition-all z-20 cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="relative z-10">
                     <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center bg-white/[0.02] border border-white/5 transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-500/10 group-hover:border-brand-500/20 shadow-xl ${cat.color}`}>
                        <IconComponent className="w-8 h-8" />
                     </div>
                     <div className="mt-8">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3 group-hover:text-brand-500 transition-colors leading-tight">{cat.label}</h3>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed line-clamp-2">{cat.description || cat.desc}</p>
                     </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between pt-8 border-t border-white/10">
                     <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                           <span className="text-3xl font-black text-white leading-none tabular-nums">
                             {resources.filter(r => 
                               r.category?.toLowerCase() === cat.label?.toLowerCase() || 
                               r.category?.toLowerCase() === cat.id?.toLowerCase() || 
                               r.category?.toLowerCase().includes(cat.id?.toLowerCase())
                             ).length}
                           </span>
                           <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Managed Asset Nodes</span>
                     </div>
                     <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-black group-hover:border-brand-400 transition-all group-hover:rotate-45 shadow-2xl">
                        <ChevronRight className="w-7 h-7" />
                     </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {viewState === 'topics' && (
          <motion.div
            key="topics"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {getTopicsForCategory(selectedCategory.id).map((topic, i) => (
              <motion.div
                key={topic}
                onClick={() => {
                  setSelectedTopic(topic);
                  setViewState('resources');
                }}
                className="group relative p-10 bg-[#070b14] border border-white/5 rounded-[2.5rem] hover:border-brand-500/40 transition-all cursor-pointer shadow-2xl overflow-hidden h-44 flex flex-col justify-center"
              >
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <Terminal className="w-20 h-20 text-brand-500" />
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-brand-500/30 transition-all group-hover:bg-brand-500/5 group-hover:scale-110 shadow-xl">
                       <Braces className="w-7 h-7 text-brand-500" />
                    </div>
                    <div>
                       <h4 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-brand-500 transition-all">{topic}</h4>
                       <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mt-1 block">
                          {getResourcesForTopic(selectedCategory.id, topic).length} Managed Assets
                       </span>
                    </div>
                 </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {viewState === 'resources' && (
          <motion.div
            key="resources"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
             {getResourcesForTopic(selectedCategory.id, selectedTopic).map((res, i) => (
               <motion.div
                 key={res.id}
                 className="group p-10 bg-[#070b14] border border-white/5 rounded-[3rem] hover:border-brand-500/30 transition-all shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
               >
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-700" />
                  
                  <div className="flex flex-col gap-6 relative z-10">
                     <div className="flex items-start justify-between">
                        <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center border border-white/10 group-hover:border-brand-500/30 transition-all duration-500 group-hover:bg-brand-500/5 group-hover:scale-110">
                           <FileText className="w-8 h-8 text-brand-500" />
                        </div>
                        <div className="flex items-center gap-3">
                           <button 
                             onClick={() => openEditModal(res)}
                             className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all group/edit shadow-xl cursor-pointer"
                           >
                              <FileUp className="w-5 h-5 group-hover/edit:scale-110 transition-transform" />
                           </button>
                           <button 
                             onClick={() => handleDelete(res.id)}
                             className="p-3 bg-rose-600/10 border border-rose-500/20 rounded-xl text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-xl cursor-pointer"
                           >
                              <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                     </div>

                     <div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-brand-500 transition-all leading-tight mb-2">
                           {res.title}
                        </h4>
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] block">Admin Control Node</span>
                     </div>
                  </div>

                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed mb-10 line-clamp-3">{res.description}</p>

                  <div className="grid grid-cols-2 gap-5 pt-10 border-t border-white/5 relative z-10">
                     <button 
                        onClick={() => res.notes_url && setViewingResource({ ...res, current_url: res.notes_url, current_type: 'Notes' })}
                        disabled={!res.notes_url}
                        className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 shadow-xl active:scale-95 border cursor-pointer ${res.notes_url ? 'bg-white/5 border-white/10 text-white hover:bg-emerald-500 hover:text-black hover:border-emerald-400' : 'bg-transparent border-transparent text-slate-800 cursor-not-allowed'}`}
                     >
                        <GraduationCap className="w-4 h-4" />
                        Notes
                     </button>
                     <button 
                        onClick={() => res.prep_url && setViewingResource({ ...res, current_url: res.prep_url, current_type: 'Prep' })}
                        disabled={!res.prep_url}
                        className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 shadow-xl active:scale-95 border cursor-pointer ${res.prep_url ? 'bg-white/5 border-white/10 text-white hover:bg-[#ec4899] hover:text-white hover:border-[#db2777]' : 'bg-transparent border-transparent text-slate-800 cursor-not-allowed'}`}
                     >
                        <BrainCircuit className="w-4 h-4" />
                        Prep
                     </button>
                  </div>
               </motion.div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deployment / Update Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-[#070b14] border border-brand-500/20 rounded-[3rem] p-12 relative overflow-hidden"
            >
                <button 
                  onClick={() => setShowModal(false)}
                  className="absolute top-8 right-8 p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all z-20 cursor-pointer"
                >
                   <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-6 mb-10">
                   <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center shadow-2xl shadow-brand-500/20">
                      <FileUp className="w-8 h-8 text-black" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">
                        {editingResource ? 'Update Neural Node' : 'Deploy Dual-Intel'}
                      </h2>
                      <p className="text-[9px] font-black text-brand-500 uppercase tracking-[0.4em]">
                        {editingResource ? `Terminating Old Intel: ${editingResource.title}` : 'Asset Ingestion Protocol'}
                      </p>
                   </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                         <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] pl-1">Asset Title</label>
                         <input 
                           type="text" required
                           value={editingResource ? editingResource.title : newResource.title}
                           onChange={(e) => editingResource ? setEditingResource({...editingResource, title: e.target.value}) : setNewResource({...newResource, title: e.target.value})}
                           placeholder="QUANTUM MANIFEST"
                           className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black text-white focus:outline-none focus:border-brand-500/50 transition-all uppercase tracking-widest bg-transparent"
                         />
                      </div>
                      <div className="space-y-3">
                         <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] pl-1">Category</label>
                         <select 
                            value={editingResource ? editingResource.category : newResource.category}
                            onChange={(e) => editingResource ? setEditingResource({...editingResource, category: e.target.value}) : setNewResource({...newResource, category: e.target.value})}
                            className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black text-white focus:outline-none focus:border-brand-500/50 appearance-none uppercase tracking-widest bg-transparent"
                         >
                              {categories.map(cat => (
                                 <option key={cat.id} value={cat.label} className="bg-[#070b14]">{cat.label.toUpperCase()}</option>
                              ))}
                         </select>
                      </div>
                      <div className="space-y-3">
                         <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] pl-1">Target Topic</label>
                         <input 
                           type="text" required
                           list="topic-suggestions"
                           value={editingResource ? editingResource.topic : newResource.topic}
                           onChange={(e) => editingResource ? setEditingResource({...editingResource, topic: e.target.value}) : setNewResource({...newResource, topic: e.target.value})}
                           placeholder="SUB-DOMAIN..."
                           className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black text-white focus:outline-none focus:border-brand-500/50 transition-all uppercase tracking-widest bg-transparent"
                         />
                         <datalist id="topic-suggestions">
                            {(suggestedTopics[editingResource ? editingResource.category : newResource.category] || []).map(t => (
                               <option key={t} value={t} />
                            ))}
                         </datalist>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] pl-1">Mission Briefing</label>
                      <textarea 
                        required rows={2}
                        value={editingResource ? editingResource.description : newResource.description}
                        onChange={(e) => editingResource ? setEditingResource({...editingResource, description: e.target.value}) : setNewResource({...newResource, description: e.target.value})}
                        placeholder="DESCRIBE CORE PARAMETERS..."
                        className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 focus:outline-none focus:border-brand-500/50 uppercase tracking-tight bg-transparent"
                      />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Notes Upload */}
                      <div className="space-y-4">
                         <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] pl-1 flex items-center gap-2">
                            <GraduationCap className="w-3 h-3 text-emerald-500" />
                            Notes Manifest (PDF)
                         </label>
                         <div className="relative group cursor-pointer border-2 border-dashed border-white/10 rounded-[2.5rem] p-10 transition-all text-center hover:border-emerald-500/30">
                            <input 
                              type="file" accept=".pdf"
                              onChange={(e) => handleFileUpload(e.target.files[0], 'notes')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center gap-4">
                               {uploadingNotes ? (
                                  <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                               ) : (
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl ${(editingResource ? editingResource.notes_url : newResource.notes_url) ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-600 group-hover:bg-emerald-500 group-hover:text-black'}`}>
                                     {(editingResource ? editingResource.notes_url : newResource.notes_url) ? <CheckCircle className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                                  </div>
                               )}
                               <div>
                                  <p className="text-[10px] font-black text-white uppercase tracking-widest">
                                     {uploadingNotes ? 'TRANSMITTING...' : (editingResource ? editingResource.notes_url : newResource.notes_url) ? 'NOTES SYNCED' : 'UPLOAD NOTES'}
                                   </p>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Prep Upload */}
                      <div className="space-y-4">
                         <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] pl-1 flex items-center gap-2">
                            <BrainCircuit className="w-3 h-3 text-pink-500" />
                            Interview Prep (PDF)
                         </label>
                         <div className="relative group cursor-pointer border-2 border-dashed border-white/10 rounded-[2.5rem] p-10 transition-all text-center hover:border-pink-500/30">
                            <input 
                              type="file" accept=".pdf"
                              onChange={(e) => handleFileUpload(e.target.files[0], 'prep')}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center gap-4">
                               {uploadingPrep ? (
                                  <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
                               ) : (
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl ${(editingResource ? editingResource.prep_url : newResource.prep_url) ? 'bg-pink-500 text-white' : 'bg-white/5 text-slate-600 group-hover:bg-pink-500 group-hover:text-white'}`}>
                                     {(editingResource ? editingResource.prep_url : newResource.prep_url) ? <CheckCircle className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                                  </div>
                               )}
                               <div>
                                  <p className="text-[10px] font-black text-white uppercase tracking-widest">
                                     {uploadingPrep ? 'TRANSMITTING...' : (editingResource ? editingResource.prep_url : newResource.prep_url) ? 'PREP SYNCED' : 'UPLOAD PREP'}
                                   </p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <button 
                     type="submit"
                     disabled={(!(editingResource ? editingResource.notes_url || editingResource.prep_url : newResource.notes_url || newResource.prep_url)) || uploadingNotes || uploadingPrep}
                     className={`w-full py-5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all shadow-xl cursor-pointer ${(!(editingResource ? editingResource.notes_url || editingResource.prep_url : newResource.notes_url || newResource.prep_url)) || uploadingNotes || uploadingPrep ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-brand-500 text-black hover:bg-brand-400 active:scale-95 shadow-brand-500/20'}`}
                   >
                      {editingResource ? 'CONFIRM NODE UPDATE' : 'CONFIRM DUAL-DEPLOYMENT'}
                   </button>
                </form>
            </motion.div>
          </div>
        )}

        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#020617]/90 backdrop-blur-2xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-[#030712] border border-white/10 rounded-[3rem] p-10 overflow-hidden flex flex-col shadow-2xl relative"
            >
                <button 
                  onClick={() => setShowCategoryModal(false)}
                  className="absolute top-8 right-8 p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all z-20 cursor-pointer"
                >
                   <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-6 mb-10">
                   <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center shadow-2xl shadow-brand-500/20">
                      <Plus className="w-8 h-8 text-black" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">
                        Deploy Category Card
                      </h2>
                      <p className="text-[9px] font-black text-brand-500 uppercase tracking-[0.4em]">
                        Add Main Technology Class
                      </p>
                   </div>
                </div>

                <form onSubmit={handleCreateCategory} className="space-y-8">
                   <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] pl-1">Category Title</label>
                      <input 
                        type="text" required
                        value={newCategory.label}
                        onChange={(e) => setNewCategory({...newCategory, label: e.target.value})}
                        placeholder="e.g., SYSTEMS ARCHITECTURE"
                        className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black text-white focus:outline-none focus:border-brand-500/50 transition-all uppercase tracking-widest bg-transparent"
                      />
                   </div>

                   <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] pl-1">Card Briefing / Description</label>
                      <textarea 
                        required rows={2}
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                        placeholder="e.g., ARCHITECT HIGH-PERFORMANCE DISTRIBUTED SYSTEMS..."
                        className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 focus:outline-none focus:border-brand-500/50 uppercase tracking-tight bg-transparent"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                         <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] pl-1">Vector Icon</label>
                         <select 
                            value={newCategory.icon_name}
                            onChange={(e) => setNewCategory({...newCategory, icon_name: e.target.value})}
                            className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black text-white focus:outline-none focus:border-brand-500/50 appearance-none uppercase tracking-widest bg-transparent"
                         >
                            <option value="Palette" className="bg-[#070b14]">PALETTE (FRONTEND)</option>
                            <option value="BackendIcon" className="bg-[#070b14]">SETTINGS (BACKEND)</option>
                            <option value="DatabaseIcon" className="bg-[#070b14]">DATABASE</option>
                            <option value="Rocket" className="bg-[#070b14]">ROCKET (DEVOPS)</option>
                            <option value="Smartphone" className="bg-[#070b14]">SMARTPHONE (MOBILE)</option>
                            <option value="Cloud" className="bg-[#070b14]">CLOUD</option>
                            <option value="Cpu" className="bg-[#070b14]">CPU (AI)</option>
                            <option value="CheckCircle" className="bg-[#070b14]">CHECKCIRCLE (TESTING)</option>
                            <option value="ShieldCheck" className="bg-[#070b14]">SHIELD (SECURITY)</option>
                            <option value="Binary" className="bg-[#070b14]">BINARY (LANGUAGES)</option>
                            <option value="Layers" className="bg-[#070b14]">LAYERS (FRAMEWORKS)</option>
                            <option value="Wrench" className="bg-[#070b14]">WRENCH (TOOLS)</option>
                            <option value="Sparkles" className="bg-[#070b14]">SPARKLES</option>
                            <option value="Terminal" className="bg-[#070b14]">TERMINAL</option>
                            <option value="Code2" className="bg-[#070b14]">CODE</option>
                            <option value="Box" className="bg-[#070b14]">BOX</option>
                            <option value="Braces" className="bg-[#070b14]">BRACES</option>
                         </select>
                      </div>

                      <div className="space-y-3">
                         <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] pl-1">Theme Accent Color</label>
                         <select 
                            value={newCategory.color}
                            onChange={(e) => {
                              const theme = e.target.value;
                              let bg = 'from-brand-500/20';
                              if (theme === 'text-pink-500') bg = 'from-pink-500/20';
                              else if (theme === 'text-indigo-500') bg = 'from-indigo-500/20';
                              else if (theme === 'text-blue-500') bg = 'from-blue-500/20';
                              else if (theme === 'text-amber-500') bg = 'from-amber-500/20';
                              else if (theme === 'text-emerald-500') bg = 'from-emerald-500/20';
                              else if (theme === 'text-cyan-500') bg = 'from-cyan-500/20';
                              else if (theme === 'text-purple-500') bg = 'from-purple-500/20';
                              else if (theme === 'text-rose-500') bg = 'from-rose-500/20';
                              else if (theme === 'text-orange-500') bg = 'from-orange-500/20';
                              setNewCategory({...newCategory, color: theme, bg});
                            }}
                            className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black text-white focus:outline-none focus:border-brand-500/50 appearance-none uppercase tracking-widest bg-transparent"
                         >
                            <option value="text-brand-500" className="bg-[#070b14]">CYAN (DEFAULT)</option>
                            <option value="text-pink-500" className="bg-[#070b14]">PINK</option>
                            <option value="text-indigo-500" className="bg-[#070b14]">INDIGO</option>
                            <option value="text-blue-500" className="bg-[#070b14]">BLUE</option>
                            <option value="text-amber-500" className="bg-[#070b14]">AMBER</option>
                            <option value="text-emerald-500" className="bg-[#070b14]">EMERALD</option>
                            <option value="text-purple-500" className="bg-[#070b14]">PURPLE</option>
                            <option value="text-rose-500" className="bg-[#070b14]">ROSE</option>
                            <option value="text-orange-500" className="bg-[#070b14]">ORANGE</option>
                         </select>
                      </div>
                   </div>

                   <button 
                     type="submit"
                     className="w-full py-5 bg-brand-500 text-black hover:bg-brand-400 font-black text-[11px] uppercase tracking-[0.4em] rounded-[2.5rem] transition-all shadow-xl shadow-brand-500/20 active:scale-95 cursor-pointer mt-4"
                   >
                      CONFIRM CATEGORY DEPLOYMENT
                   </button>
                </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Neural Reader Overlay */}
      <NeuralReader 
        isOpen={!!viewingResource}
        onClose={() => setViewingResource(null)}
        title={viewingResource?.title || 'QUANTUM MANIFEST'}
        subtitle={`${viewingResource?.current_type || 'NEURAL'} ASSET`}
        pdfUrl={viewingResource?.current_url}
      />
    </div>
  );
};

export default ResourceManager;
