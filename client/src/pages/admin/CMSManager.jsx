import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { admin } from '../../lib/api';
import { useCMS } from '../../context/CMSContext';
import { 
  Save, Zap, Eye, Palette, Terminal, Layers, Type, Link as LinkIcon, 
  ImageIcon, CheckCircle, AlertCircle, Dna, Cpu, Globe, 
  Smartphone, Monitor, Tablet, RefreshCw, LayoutGrid, Check, Plus, Trash2, ArrowRight, Shield
} from 'lucide-react';

const CMSManager = () => {
  const { refreshCMS } = useCMS();
  const [activeSection, setActiveSection] = useState('Hero'); // Hero, Features, About, AIEngine, Login, Register
  const [activePage, setActivePage] = useState('landing'); // landing, login, register
  const [previewDevice, setPreviewDevice] = useState('desktop'); // desktop, tablet, mobile
  const [cmsData, setCmsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const sectionsByPage = {
    landing: [
      { id: 'Hero', label: 'Hero Header', icon: Zap, description: 'Master neural gateway' },
      { id: 'Features', label: 'Bento Features', icon: Layers, description: 'Grid capabilities' },
      { id: 'About', label: 'Mission Deck', icon: Type, description: 'Narrative statement' },
      { id: 'AIEngine', label: 'AI Statistics', icon: Cpu, description: 'Performance counts' }
    ],
    login: [
      { id: 'Login', label: 'Login Gateway', icon: Shield, description: 'Operative authorization' }
    ],
    register: [
      { id: 'Register', label: 'Register Gate', icon: UserCheckIcon, description: 'Identity provisioning' }
    ]
  };

  useEffect(() => {
    fetchCMS();
  }, []);

  const fetchCMS = async () => {
    try {
      setLoading(true);
      const { data } = await admin.getCmsContent();
      setCmsData(data.content || {});
    } catch (err) {
      console.error('CMS Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateField = (section, field, value) => {
    setCmsData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }));
  };

  const handleSave = async (sectionToSave = activeSection) => {
    setSaving(true);
    setStatus({ type: null, message: '' });
    try {
      const content = cmsData[sectionToSave] || {};
      await admin.updateCmsContent(sectionToSave, content);
      setStatus({ type: 'success', message: `Deployed ${sectionToSave} configuration successfully.` });
      refreshCMS();
      setTimeout(() => setStatus({ type: null, message: '' }), 4000);
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to deploy changes to database.' });
    } finally {
      setSaving(false);
    }
  };

  // Helper to get active section content safely
  const getContent = (sec) => {
    const defaultContents = {
      Hero: { headline: 'Master Your Career With Intelligence.', description: 'Elevate your interview game with our AI-powered simulator. Real-time feedback, deep NLP analysis, and resume optimization.', ctaText: 'Get Started for Free', ctaLink: '/register', badge: 'Next Gen AI Interview Platform' },
      Features: { headline: 'Engineered for Performance.', description: 'Built on state-of-the-art neural networks designed to push your capabilities.', items: [{ title: 'Real-time NLP', desc: 'Advanced natural language processing.' }, { title: 'Biometric HUD', desc: 'Monitor your stress.' }, { title: 'Neural Reader', desc: 'Ingest documentation.' }] },
      About: { headline: 'Our Mission.', description: 'We are committed to democratizing high-level interview preparation.' },
      AIEngine: { headline: 'State-of-the-Art AI.', description: 'Powered by the latest LLMs and custom models.', stats: { users: '50k+', success: '92%', companies: '100+' } },
      Login: { headline: 'Restore Session Link.', subtitle: 'INPUT YOUR OPERATIVE IDENTIFICATION HASH', supportText: 'Enter secure access credentials to establish a database session.', badge: 'Agent Authorization Required', cardTheme: 'Dark Glass', bgStyle: 'Tech Grid' },
      Register: { headline: 'Establish Identity.', subtitle: 'REGISTER A NEW OPERATIVE PROFILE IN THE ARCHIVES', supportText: 'Provision credentials to sync with the global simulated grid.', badge: 'Operative Enlistment Protocol', cardTheme: 'Dark Glass', bgStyle: 'Tech Grid' }
    };
    return cmsData[sec] || defaultContents[sec] || {};
  };

  const currentContent = getContent(activeSection);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#030712]">
       <div className="text-center space-y-4">
          <Dna className="w-12 h-12 text-brand-500 animate-spin mx-auto" />
          <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.4em]">Calibrating Studio Content...</p>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col xl:flex-row gap-8 pb-20 relative h-[calc(100vh-140px)] overflow-hidden font-inter select-none">
      
      {/* 1. Control Deck (Left Panel) */}
      <div className="w-full xl:w-[480px] flex flex-col shrink-0 h-full overflow-y-auto no-scrollbar bg-[#070b14] border border-white/5 rounded-[2.5rem] p-6 lg:p-8 space-y-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/[0.01] to-transparent pointer-events-none" />
        
        {/* Module Selector tabs */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <LayoutGrid className="w-5 h-5 text-brand-500" />
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Live Customizer Studio</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
             {['landing', 'login', 'register'].map(p => (
                <button
                  key={p}
                  onClick={() => {
                    setActivePage(p);
                    setActiveSection(sectionsByPage[p][0].id);
                  }}
                  className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activePage === p ? 'bg-brand-500 text-black shadow-lg shadow-brand-500/20' : 'text-slate-500 hover:text-slate-400'}`}
                >
                  {p}
                </button>
             ))}
          </div>
        </div>

        {/* Sections list under active page */}
        <div className="space-y-2">
           <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block ml-1">Editable Sections</span>
           <div className="space-y-2">
              {sectionsByPage[activePage].map(sec => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${isActive ? 'bg-brand-500/10 border-brand-500/30 text-brand-500 shadow-md' : 'bg-white/[0.01] border-white/5 text-slate-500 hover:bg-white/5'}`}
                  >
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-brand-500 text-black scale-105' : 'bg-white/5'}`}>
                        <Icon className="w-4 h-4" />
                     </div>
                     <div>
                        <span className="block text-[10px] font-black uppercase tracking-wider leading-none mb-1.5">{sec.label}</span>
                        <span className="block text-[8px] font-bold text-slate-600 uppercase tracking-widest leading-none">{sec.description}</span>
                     </div>
                  </button>
                );
              })}
           </div>
        </div>

        {/* Dynamic customize settings block */}
        <div className="flex-1 space-y-6 pt-4 border-t border-white/5">
           {activeSection === 'Hero' && (
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Badge Text</label>
                    <input 
                      type="text" 
                      value={currentContent.badge || ''}
                      onChange={(e) => handleUpdateField('Hero', 'badge', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[10px] font-bold text-white focus:border-brand-500/40 focus:outline-none transition-all uppercase tracking-wider"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Headline Text</label>
                    <textarea 
                      rows={2}
                      value={currentContent.headline || ''}
                      onChange={(e) => handleUpdateField('Hero', 'headline', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-brand-500/40 focus:outline-none transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Subheadline Description</label>
                    <textarea 
                      rows={4}
                      value={currentContent.description || ''}
                      onChange={(e) => handleUpdateField('Hero', 'description', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-medium text-slate-400 focus:border-brand-500/40 focus:outline-none transition-all leading-relaxed"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">CTA Label</label>
                       <input 
                         type="text" 
                         value={currentContent.ctaText || ''}
                         onChange={(e) => handleUpdateField('Hero', 'ctaText', e.target.value)}
                         className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[10px] font-bold text-white focus:border-brand-500/40 focus:outline-none transition-all uppercase"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">CTA Route Link</label>
                       <input 
                         type="text" 
                         value={currentContent.ctaLink || ''}
                         onChange={(e) => handleUpdateField('Hero', 'ctaLink', e.target.value)}
                         className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[10px] font-bold text-white focus:border-brand-500/40 focus:outline-none transition-all"
                       />
                    </div>
                 </div>
              </div>
           )}

           {activeSection === 'Features' && (
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Grid Headline</label>
                    <input 
                      type="text" 
                      value={currentContent.headline || ''}
                      onChange={(e) => handleUpdateField('Features', 'headline', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-brand-500/40 focus:outline-none transition-all uppercase"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Features Description</label>
                    <textarea 
                      rows={4}
                      value={currentContent.description || ''}
                      onChange={(e) => handleUpdateField('Features', 'description', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-medium text-slate-400 focus:border-brand-500/40 focus:outline-none transition-all leading-relaxed"
                    />
                 </div>
              </div>
           )}

           {activeSection === 'About' && (
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Mission Title</label>
                    <input 
                      type="text" 
                      value={currentContent.headline || ''}
                      onChange={(e) => handleUpdateField('About', 'headline', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-brand-500/40 focus:outline-none transition-all uppercase"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Mission Narrative Description</label>
                    <textarea 
                      rows={6}
                      value={currentContent.description || ''}
                      onChange={(e) => handleUpdateField('About', 'description', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-medium text-slate-400 focus:border-brand-500/40 focus:outline-none transition-all leading-relaxed"
                    />
                 </div>
              </div>
           )}

           {activeSection === 'AIEngine' && (
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Engine Headline</label>
                    <input 
                      type="text" 
                      value={currentContent.headline || ''}
                      onChange={(e) => handleUpdateField('AIEngine', 'headline', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-brand-500/40 focus:outline-none transition-all uppercase"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Engine Description</label>
                    <textarea 
                      rows={4}
                      value={currentContent.description || ''}
                      onChange={(e) => handleUpdateField('AIEngine', 'description', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-medium text-slate-400 focus:border-brand-500/40 focus:outline-none transition-all leading-relaxed"
                    />
                 </div>
              </div>
           )}

           {(activeSection === 'Login' || activeSection === 'Register') && (
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Badge label</label>
                    <input 
                      type="text" 
                      value={currentContent.badge || ''}
                      onChange={(e) => handleUpdateField(activeSection, 'badge', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[10px] font-bold text-white focus:border-brand-500/40 focus:outline-none transition-all uppercase tracking-wider"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Headline Text</label>
                    <input 
                      type="text" 
                      value={currentContent.headline || ''}
                      onChange={(e) => handleUpdateField(activeSection, 'headline', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-bold text-white focus:border-brand-500/40 focus:outline-none transition-all uppercase"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Subtitle Text</label>
                    <input 
                      type="text" 
                      value={currentContent.subtitle || ''}
                      onChange={(e) => handleUpdateField(activeSection, 'subtitle', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[10px] font-bold text-white focus:border-brand-500/40 focus:outline-none transition-all uppercase tracking-wide"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Support/Intro Text</label>
                    <textarea 
                      rows={3}
                      value={currentContent.supportText || ''}
                      onChange={(e) => handleUpdateField(activeSection, 'supportText', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-medium text-slate-400 focus:border-brand-500/40 focus:outline-none transition-all leading-relaxed"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Card Theme</label>
                       <select 
                         value={currentContent.cardTheme || 'Dark Glass'}
                         onChange={(e) => handleUpdateField(activeSection, 'cardTheme', e.target.value)}
                         className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[10px] font-bold text-white focus:border-brand-500/40 focus:outline-none transition-all appearance-none uppercase"
                       >
                          <option value="Dark Glass" className="bg-[#070b14]">Dark Glass</option>
                          <option value="Sleek Grid" className="bg-[#070b14]">Sleek Grid</option>
                          <option value="Sunset Neon" className="bg-[#070b14]">Sunset Neon</option>
                          <option value="Emerald Vault" className="bg-[#070b14]">Emerald Vault</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-1">Background Style</label>
                       <select 
                         value={currentContent.bgStyle || 'Tech Grid'}
                         onChange={(e) => handleUpdateField(activeSection, 'bgStyle', e.target.value)}
                         className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[10px] font-bold text-white focus:border-brand-500/40 focus:outline-none transition-all appearance-none uppercase"
                       >
                          <option value="Tech Grid" className="bg-[#070b14]">Tech Grid</option>
                          <option value="Matrix Rain" className="bg-[#070b14]">Matrix Rain</option>
                          <option value="Plain Dark" className="bg-[#070b14]">Plain Dark</option>
                       </select>
                    </div>
                 </div>
              </div>
           )}
        </div>

        {/* Global Save / Status */}
        <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
           {status.message && (
              <div className={`p-4 rounded-xl border flex items-center gap-3 text-[10px] font-black uppercase tracking-widest leading-none ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                 {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                 {status.message}
              </div>
           )}
           <button
             onClick={() => handleSave(activeSection)}
             disabled={saving}
             className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 shadow-xl ${saving ? 'bg-slate-800 text-slate-600' : 'bg-brand-500 text-black hover:bg-brand-400 shadow-brand-500/25 active:scale-95'}`}
           >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Deploy Section Changes
           </button>
        </div>
      </div>

      {/* 2. Interactive Preview Viewport (Right Panel) */}
      <div className="flex-1 flex flex-col bg-slate-950 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
         {/* Preview HUD Header */}
         <div className="h-16 shrink-0 border-b border-white/5 bg-[#070b14]/90 px-8 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
               <Eye className="w-4 h-4 text-brand-500 animate-pulse" />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Interactive Sandbox Preview</span>
            </div>
            
            {/* Device Switchers */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
               {[
                 { device: 'desktop', icon: Monitor, width: 'w-full' },
                 { device: 'tablet', icon: Tablet, width: 'w-[768px]' },
                 { device: 'mobile', icon: Smartphone, width: 'w-[375px]' }
               ].map(item => (
                  <button
                    key={item.device}
                    onClick={() => setPreviewDevice(item.device)}
                    className={`p-2 rounded-lg transition-colors ${previewDevice === item.device ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'text-slate-600 hover:text-white'}`}
                  >
                     <item.icon className="w-4 h-4" />
                  </button>
               ))}
            </div>
         </div>

         {/* Actual Mock Viewport container */}
         <div className="flex-1 flex items-center justify-center p-8 bg-black/80 overflow-auto no-scrollbar relative">
            {/* Matrix Scan lines */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%]" />
            
            <div 
              className={`
                h-full bg-slate-950 rounded-3xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-y-auto no-scrollbar transition-all duration-700 relative flex flex-col
                ${previewDevice === 'desktop' ? 'w-full max-w-full' : ''}
                ${previewDevice === 'tablet' ? 'w-[768px] border-x-[8px] border-slate-900' : ''}
                ${previewDevice === 'mobile' ? 'w-[375px] border-[10px] border-slate-900 rounded-[3rem]' : ''}
              `}
            >
               {activePage === 'landing' && (
                  <div className="flex-1 flex flex-col text-slate-100 font-sans text-xs">
                     {/* Mock Header */}
                     <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20">
                        <span className="font-black text-[10px] tracking-widest text-white">PREPGENIUS.AI</span>
                        <div className="flex gap-4 opacity-70 scale-90">
                           <span>Arena</span><span>Assets</span><span>Dashboard</span>
                        </div>
                     </div>

                     {/* Scrollable mockup elements */}
                     <div className="flex-1 space-y-16 py-12 px-6">
                        
                        {/* Live Block: Hero */}
                        <div 
                          onClick={() => setActiveSection('Hero')}
                          className={`p-6 rounded-3xl border relative transition-all cursor-pointer group/prev ${activeSection === 'Hero' ? 'border-brand-500/60 bg-brand-500/[0.03] shadow-[0_0_30px_rgba(34,211,238,0.05)]' : 'border-white/5 bg-white/[0.01] hover:border-brand-500/20'}`}
                        >
                           {activeSection === 'Hero' && <div className="absolute top-4 right-4 text-[7px] font-black text-brand-400 bg-brand-500/10 border border-brand-500/30 px-2 py-0.5 rounded-sm uppercase tracking-widest">Active Selector</div>}
                           <div className="text-center max-w-xl mx-auto space-y-4">
                              <span className="inline-block text-[8px] font-black text-brand-400 border border-brand-500/20 bg-brand-500/10 px-3 py-1 rounded-full uppercase tracking-[0.2em]">{getContent('Hero').badge || 'AI Interview Platform'}</span>
                              <h1 className="text-3xl font-black tracking-tight text-white uppercase leading-none">{getContent('Hero').headline}</h1>
                              <p className="text-[10px] text-slate-500 leading-relaxed max-w-md mx-auto">{getContent('Hero').description}</p>
                              <div className="flex gap-4 justify-center pt-2">
                                 <div className="px-6 py-2.5 bg-white text-black font-black text-[9px] uppercase tracking-widest rounded-full">{getContent('Hero').ctaText}</div>
                                 <div className="px-6 py-2.5 bg-white/5 border border-white/10 text-white font-black text-[9px] uppercase tracking-widest rounded-full">Login</div>
                              </div>
                           </div>
                        </div>

                        {/* Live Block: Features */}
                        <div 
                          onClick={() => setActiveSection('Features')}
                          className={`p-6 rounded-3xl border relative transition-all cursor-pointer group/prev ${activeSection === 'Features' ? 'border-brand-500/60 bg-brand-500/[0.03] shadow-[0_0_30px_rgba(34,211,238,0.05)]' : 'border-white/5 bg-white/[0.01] hover:border-brand-500/20'}`}
                        >
                           {activeSection === 'Features' && <div className="absolute top-4 right-4 text-[7px] font-black text-brand-400 bg-brand-500/10 border border-brand-500/30 px-2 py-0.5 rounded-sm uppercase tracking-widest">Active Selector</div>}
                           <div className="space-y-6">
                              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                 <div>
                                    <span className="text-[7px] font-black text-brand-500 uppercase tracking-widest block mb-1">Core Modules</span>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">{getContent('Features').headline}</h2>
                                 </div>
                                 <p className="text-[9px] text-slate-600 max-w-xs">{getContent('Features').description}</p>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                 {(getContent('Features').items || []).map((feat, idx) => (
                                    <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                       <span className="block text-[10px] font-black text-white uppercase tracking-tighter mb-1.5">{feat.title}</span>
                                       <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wide leading-relaxed">{feat.desc}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* Live Block: About */}
                        <div 
                          onClick={() => setActiveSection('About')}
                          className={`p-6 rounded-3xl border relative transition-all cursor-pointer group/prev ${activeSection === 'About' ? 'border-brand-500/60 bg-brand-500/[0.03] shadow-[0_0_30px_rgba(34,211,238,0.05)]' : 'border-white/5 bg-white/[0.01] hover:border-brand-500/20'}`}
                        >
                           {activeSection === 'About' && <div className="absolute top-4 right-4 text-[7px] font-black text-brand-400 bg-brand-500/10 border border-brand-500/30 px-2 py-0.5 rounded-sm uppercase tracking-widest">Active Selector</div>}
                           <div className="max-w-md mx-auto text-center space-y-4">
                              <h3 className="text-xl font-black text-white uppercase tracking-tighter">{getContent('About').headline}</h3>
                              <p className="text-[10px] text-slate-500 leading-relaxed">{getContent('About').description}</p>
                           </div>
                        </div>

                        {/* Live Block: AIEngine */}
                        <div 
                          onClick={() => setActiveSection('AIEngine')}
                          className={`p-6 rounded-3xl border relative transition-all cursor-pointer group/prev ${activeSection === 'AIEngine' ? 'border-brand-500/60 bg-brand-500/[0.03] shadow-[0_0_30px_rgba(34,211,238,0.05)]' : 'border-white/5 bg-white/[0.01] hover:border-brand-500/20'}`}
                        >
                           {activeSection === 'AIEngine' && <div className="absolute top-4 right-4 text-[7px] font-black text-brand-400 bg-brand-500/10 border border-brand-500/30 px-2 py-0.5 rounded-sm uppercase tracking-widest">Active Selector</div>}
                           <div className="flex items-center justify-between gap-6">
                              <div className="max-w-xs space-y-2">
                                 <h3 className="text-lg font-black text-white uppercase tracking-tighter">{getContent('AIEngine').headline}</h3>
                                 <p className="text-[9px] text-slate-500 leading-relaxed">{getContent('AIEngine').description}</p>
                              </div>
                              <div className="flex gap-4">
                                 {Object.entries(getContent('AIEngine').stats || {}).map(([key, val]) => (
                                    <div key={key} className="text-center p-3 bg-white/5 rounded-xl border border-white/5">
                                       <span className="block text-lg font-black text-[#00f5ff] tabular-nums leading-none mb-1">{val}</span>
                                       <span className="block text-[7px] font-black text-slate-600 uppercase tracking-widest">{key}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                     </div>

                     {/* Mock Footer */}
                     <div className="h-16 px-6 border-t border-white/5 bg-slate-950 shrink-0 flex items-center justify-between text-[8px] font-black text-slate-700 uppercase tracking-widest">
                        <span>&copy; 2026 PREPGENIUS AI</span>
                        <span>SECURE SYNC PROTOCOL</span>
                     </div>
                  </div>
               )}

               {activePage === 'login' && (
                  <div className="flex-1 flex flex-col justify-center items-center p-6 bg-slate-950 font-sans text-slate-100 relative">
                     {/* Background lines mockup */}
                     {getContent('Login').bgStyle === 'Tech Grid' && (
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                     )}
                     {getContent('Login').bgStyle === 'Matrix Rain' && (
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/0 via-[#10b981]/5 to-transparent pointer-events-none" />
                     )}
                     
                     <div 
                       onClick={() => setActiveSection('Login')}
                       className={`
                         w-full max-w-sm rounded-[2rem] p-8 border transition-all cursor-pointer relative overflow-hidden text-center z-10
                         ${getContent('Login').cardTheme === 'Dark Glass' ? 'bg-black/50 border-white/10 backdrop-blur-xl shadow-2xl' : ''}
                         ${getContent('Login').cardTheme === 'Sleek Grid' ? 'bg-[#070b14] border-brand-500/20 shadow-md shadow-brand-500/5' : ''}
                         ${getContent('Login').cardTheme === 'Sunset Neon' ? 'bg-black/80 border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : ''}
                         ${getContent('Login').cardTheme === 'Emerald Vault' ? 'bg-[#022c22]/20 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : ''}
                       `}
                     >
                        <span className="inline-block text-[8px] font-black text-brand-400 border border-brand-500/20 bg-brand-500/5 px-3 py-1 rounded-full uppercase tracking-[0.25em] mb-6">{getContent('Login').badge}</span>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{getContent('Login').headline}</h2>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-6">{getContent('Login').subtitle}</p>
                        
                        {/* Mock Login Fields */}
                        <div className="space-y-4 text-left">
                           <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-bold text-slate-500 uppercase">Email Address</div>
                           <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-bold text-slate-500 uppercase">Secure Password</div>
                        </div>

                        <button className="w-full mt-6 py-3.5 bg-brand-500 text-black text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg">Authenticate Link</button>
                        <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mt-6 leading-relaxed">{getContent('Login').supportText}</span>
                     </div>
                  </div>
               )}

               {activePage === 'register' && (
                  <div className="flex-1 flex flex-col justify-center items-center p-6 bg-slate-950 font-sans text-slate-100 relative">
                     {/* Background lines mockup */}
                     {getContent('Register').bgStyle === 'Tech Grid' && (
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                     )}
                     {getContent('Register').bgStyle === 'Matrix Rain' && (
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/0 via-[#10b981]/5 to-transparent pointer-events-none" />
                     )}
                     
                     <div 
                       onClick={() => setActiveSection('Register')}
                       className={`
                         w-full max-w-sm rounded-[2rem] p-8 border transition-all cursor-pointer relative overflow-hidden text-center z-10
                         ${getContent('Register').cardTheme === 'Dark Glass' ? 'bg-black/50 border-white/10 backdrop-blur-xl shadow-2xl' : ''}
                         ${getContent('Register').cardTheme === 'Sleek Grid' ? 'bg-[#070b14] border-brand-500/20 shadow-md shadow-brand-500/5' : ''}
                         ${getContent('Register').cardTheme === 'Sunset Neon' ? 'bg-black/80 border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : ''}
                         ${getContent('Register').cardTheme === 'Emerald Vault' ? 'bg-[#022c22]/20 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : ''}
                       `}
                     >
                        <span className="inline-block text-[8px] font-black text-brand-400 border border-brand-500/20 bg-brand-500/5 px-3 py-1 rounded-full uppercase tracking-[0.25em] mb-6">{getContent('Register').badge}</span>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{getContent('Register').headline}</h2>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-6">{getContent('Register').subtitle}</p>
                        
                        {/* Mock Register Fields */}
                        <div className="space-y-4 text-left">
                           <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-bold text-slate-500 uppercase">Operative Name</div>
                           <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-bold text-slate-500 uppercase">Secure Email</div>
                           <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[9px] font-bold text-slate-500 uppercase">Key Password</div>
                        </div>

                        <button className="w-full mt-6 py-3.5 bg-brand-500 text-black text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg">Establish Access Link</button>
                        <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest mt-6 leading-relaxed">{getContent('Register').supportText}</span>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>

    </div>
  );
};

const UserCheckIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <polyline points="16 11 18 13 22 9"/>
  </svg>
);

export default CMSManager;
