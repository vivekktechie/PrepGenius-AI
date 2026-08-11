import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { admin } from '../../lib/api';
import { 
  Play, Terminal, Settings, Radio, Activity, Cpu, Save, Database, 
  ShieldAlert, Layers, ShieldCheck, RefreshCw, AlertTriangle, ChevronRight, HelpCircle
} from 'lucide-react';

const SystemControl = () => {
  const [settings, setSettings] = useState({
    models: [
      "gemini-3.1-flash-lite", 
      "gemini-flash-latest", 
      "gemini-2.0-flash", 
      "gemini-2.5-flash", 
      "gemini-3.5-flash", 
      "gemini-1.5-flash", 
      "gemini-1.5-pro"
    ],
    maintenanceMode: false,
    biometricEnforced: true,
    offlineAiOverride: false,
    customPrompt: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('');
  const [sqlResults, setSqlResults] = useState(null);
  const [sqlFields, setSqlFields] = useState([]);
  const [sqlLoading, setSqlLoading] = useState(false);
  const [sqlError, setSqlError] = useState('');
  const [newModel, setNewModel] = useState('');

  const [status, setStatus] = useState({ type: null, message: '' });

  const queryTemplates = [
    { label: 'Check Operatives', query: 'SELECT id, email, full_name, role, created_at FROM users;' },
    { label: 'Inspect Missions', query: 'SELECT id, user_id, job_title, difficulty, performance_score FROM interview_sessions ORDER BY created_at DESC LIMIT 5;' },
    { label: 'Verify Audit Logs', query: 'SELECT id, title, message, type, created_at FROM notifications ORDER BY created_at DESC LIMIT 5;' },
    { label: 'Check CMS Syncs', query: 'SELECT id, section_name, updated_at FROM cms_content;' }
  ];

  const availableModelsList = [
    "gemini-3.1-flash-lite", 
    "gemini-flash-latest",
    "gemini-2.0-flash", 
    "gemini-2.5-flash", 
    "gemini-3.5-flash", 
    "gemini-1.5-flash", 
    "gemini-1.5-pro",
    "gemini-2.0-pro-exp",
    "llama3.2",
    "mistral",
    "codellama"
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await admin.getSystemSettings();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Settings fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setStatus({ type: null, message: '' });
    try {
      await admin.updateSystemSettings(settings);
      setStatus({ type: 'success', message: 'System override successfully deployed.' });
      setTimeout(() => setStatus({ type: null, message: '' }), 4000);
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to deploy settings modulation.' });
    } finally {
      setSaving(false);
    }
  };

  const handleRunQuery = async (queryText = sqlQuery) => {
    if (!queryText.trim()) return;
    setSqlLoading(true);
    setSqlError('');
    setSqlResults(null);
    setSqlFields([]);
    try {
      const { data } = await admin.runRawQuery(queryText);
      if (data.results) {
        setSqlResults(data.results);
        setSqlFields(data.fields || []);
      }
    } catch (err) {
      setSqlError(err.response?.data?.error || err.message);
    } finally {
      setSqlLoading(false);
    }
  };

  const handleToggleModel = (model) => {
    const isSelected = settings.models.includes(model);
    let updatedModels;
    if (isSelected) {
      updatedModels = settings.models.filter(m => m !== model);
    } else {
      updatedModels = [...settings.models, model];
    }
    setSettings({ ...settings, models: updatedModels });
  };

  const handleAddCustomModel = (e) => {
    e.preventDefault();
    if (!newModel.trim() || settings.models.includes(newModel.trim())) return;
    setSettings({ ...settings, models: [...settings.models, newModel.trim()] });
    setNewModel('');
  };

  const handleMoveModel = (index, direction) => {
    const newModels = [...settings.models];
    if (direction === 'up' && index > 0) {
      const temp = newModels[index];
      newModels[index] = newModels[index - 1];
      newModels[index - 1] = temp;
    } else if (direction === 'down' && index < newModels.length - 1) {
      const temp = newModels[index];
      newModels[index] = newModels[index + 1];
      newModels[index + 1] = temp;
    }
    setSettings({ ...settings, models: newModels });
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center bg-[#030712] py-20">
       <div className="text-center space-y-4">
          <RefreshCw className="w-12 h-12 text-brand-500 animate-spin mx-auto" />
          <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.4em]">Establishing Core Settings Link...</p>
       </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20 select-none">
      
      {/* 1. Dynamic AI Coordinator (col-span-4) */}
      <div className="lg:col-span-4 bg-[#070b14] border border-white/5 rounded-[2.5rem] p-6 lg:p-8 space-y-8 relative overflow-hidden flex flex-col min-h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/[0.01] to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
           <Cpu className="w-5 h-5 text-brand-500" />
           <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">AI Engine Coordinator</h3>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Models Fallback Routing Configuration</p>
           </div>
        </div>

        {/* Dynamic Model fallback selectors */}
        <div className="space-y-4 flex-1">
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 block">Fallback Hierarchy queue</span>
           <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-2.5 max-h-[220px] overflow-y-auto no-scrollbar">
              {settings.models.map((model, idx) => (
                <div key={model} className="flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                     <span className="text-[8px] font-mono text-slate-600">#{idx + 1}</span>
                     <span className="text-[10px] font-bold text-slate-350">{model}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <button onClick={() => handleMoveModel(idx, 'up')} disabled={idx === 0} className="p-1 text-slate-600 hover:text-brand-550 disabled:opacity-30">▲</button>
                     <button onClick={() => handleMoveModel(idx, 'down')} disabled={idx === settings.models.length - 1} className="p-1 text-slate-600 hover:text-brand-550 disabled:opacity-30">▼</button>
                     <button onClick={() => handleToggleModel(model)} className="p-1 text-rose-500/60 hover:text-rose-400 ml-2">✕</button>
                  </div>
                </div>
              ))}
           </div>

           {/* Add dynamic models */}
           <form onSubmit={handleAddCustomModel} className="flex gap-2">
              <input 
                type="text" 
                placeholder="ADD CUSTOM MODEL ENGINE..." 
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                className="flex-1 px-4 py-3 bg-black/40 border border-white/5 rounded-xl text-[9px] font-black text-white focus:outline-none focus:border-brand-500/40 uppercase tracking-wider"
              />
              <button type="submit" className="px-5 py-3 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-xl text-[9px] font-black uppercase hover:bg-brand-500 hover:text-black transition-all">Add</button>
           </form>

           {/* Select models lists */}
           <div className="space-y-2">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1 block">Toggle Available Matrices</span>
              <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto no-scrollbar">
                 {availableModelsList.map(modelName => {
                    const isSelected = settings.models.includes(modelName);
                    return (
                       <button
                         key={modelName}
                         onClick={() => handleToggleModel(modelName)}
                         className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all ${isSelected ? 'bg-brand-500/10 border-brand-500/30 text-brand-500' : 'bg-transparent border-white/5 text-slate-600 hover:border-slate-800'}`}
                       >
                          {modelName}
                       </button>
                    );
                 })}
              </div>
           </div>
        </div>

        {/* Global Prompts customization */}
        <div className="space-y-2">
           <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Global System Prompt Prepend</label>
           <textarea 
             rows={3}
             value={settings.customPrompt || ''}
             onChange={(e) => setSettings({ ...settings, customPrompt: e.target.value })}
             placeholder="PREPEND SYSTEM INSTRUCTIONS DIRECTLY TO THE AI INSTRUCTIONS INJECTOR..."
             className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-[9px] font-bold text-white placeholder:text-slate-700 focus:border-brand-500/45 focus:outline-none transition-all leading-relaxed uppercase"
           />
        </div>
      </div>

      {/* 2. SQL Database Command center (col-span-5) */}
      <div className="lg:col-span-5 bg-[#070b14] border border-white/5 rounded-[2.5rem] p-6 lg:p-8 space-y-6 relative overflow-hidden flex flex-col min-h-[500px]">
         <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.01] to-transparent pointer-events-none" />
         
         <div className="flex items-center gap-3 border-b border-white/5 pb-4 justify-between">
            <div className="flex items-center gap-3">
               <Database className="w-5 h-5 text-brand-500" />
               <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Live SQL Terminal</h3>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">TiDB Query and Data Management console</p>
               </div>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse shadow-[0_0_8px_#22d3ee]" />
         </div>

         {/* Templates selection */}
         <div className="space-y-2">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1 block">Command Presets</span>
            <div className="grid grid-cols-2 gap-2">
               {queryTemplates.map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => {
                       setSqlQuery(preset.query);
                       handleRunQuery(preset.query);
                    }}
                    className="p-2.5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-xl text-[8px] font-black text-slate-500 uppercase tracking-widest text-left truncate transition-colors hover:text-brand-500"
                  >
                     &gt; {preset.label}
                  </button>
               ))}
            </div>
         </div>

         {/* SQL Query input editor */}
         <div className="relative border border-white/15 rounded-2xl overflow-hidden bg-black/60">
            <div className="absolute top-3 left-4 text-[8px] font-mono text-brand-500/40">SQL EDITOR</div>
            <textarea
              rows={4}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="SELECT * FROM users LIMIT 10;"
              className="w-full bg-transparent p-6 pt-10 text-[10px] font-mono text-brand-400 focus:outline-none resize-none leading-relaxed tracking-wider placeholder:text-slate-800"
            />
            <div className="p-3 bg-black/40 border-t border-white/5 flex justify-between items-center">
               <span className="text-[7px] font-mono text-slate-600 uppercase">RUNNING LIVE IN TIDB CLOUD</span>
               <button
                 onClick={() => handleRunQuery()}
                 disabled={sqlLoading}
                 className="px-4 py-2 bg-brand-500 text-black hover:bg-brand-400 disabled:opacity-40 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all active:scale-95"
               >
                  {sqlLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  Execute Query
               </button>
            </div>
         </div>

         {/* SQL results grid display */}
         <div className="flex-1 border border-white/5 rounded-2xl bg-black/40 overflow-hidden relative min-h-[160px] flex flex-col">
            {sqlLoading && (
               <div className="absolute inset-0 bg-[#070b14]/50 backdrop-blur-sm z-10 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-brand-500 animate-spin" />
               </div>
            )}
            
            {sqlError && (
               <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-mono leading-relaxed rounded-xl m-4 uppercase flex gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <div>
                     <span className="font-black block mb-1 text-[10px]">TIDB SYNAPSE REJECTION:</span>
                     {sqlError}
                  </div>
               </div>
            )}

            {!sqlResults && !sqlError && !sqlLoading && (
               <div className="flex-1 flex flex-col items-center justify-center opacity-30 p-8 text-center">
                  <Terminal className="w-8 h-8 text-slate-500 mb-3" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Query Output Terminal Node</span>
               </div>
            )}

            {sqlResults && !sqlLoading && (
               <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="p-3 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Query complete</span>
                     <span className="text-[8px] font-black text-emerald-400 uppercase tabular-nums tracking-widest">{sqlResults.length} Rows Synced</span>
                  </div>
                  <div className="flex-1 overflow-auto no-scrollbar">
                     <table className="w-full text-left border-collapse text-[9px] font-mono">
                        <thead>
                           <tr className="border-b border-white/5 bg-white/[0.02]">
                              {sqlFields.map(field => (
                                 <th key={field} className="p-3 text-slate-500 uppercase tracking-wider font-black border-r border-white/5 last:border-0">{field}</th>
                              ))}
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {sqlResults.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-white/[0.01] transition-colors">
                                 {sqlFields.map((field, fIdx) => (
                                    <td key={fIdx} className="p-3 text-slate-350 border-r border-white/5 last:border-0 max-w-[200px] truncate" title={String(row[field])}>
                                       {row[field] !== null ? String(row[field]) : <span className="text-slate-600">NULL</span>}
                                    </td>
                                 ))}
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}
         </div>
      </div>

      {/* 3. System settings & Global overrides (col-span-3) */}
      <div className="lg:col-span-3 bg-[#070b14] border border-white/5 rounded-[2.5rem] p-6 lg:p-8 space-y-6 relative overflow-hidden flex flex-col justify-between min-h-[500px]">
         <div className="absolute inset-0 bg-gradient-to-b from-brand-500/[0.01] to-transparent pointer-events-none" />
         
         <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
               <Settings className="w-5 h-5 text-brand-500" />
               <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">System Controls</h3>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Global override settings</p>
               </div>
            </div>

            {/* Overrides list */}
            <div className="space-y-4">
               {/* 1. Maintenance Mode */}
               <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-brand-500/20 transition-all">
                  <div className="space-y-1 pr-4">
                     <span className="block text-[10px] font-black text-white uppercase tracking-tight">Lockout Matrix</span>
                     <span className="block text-[7.5px] font-bold text-slate-600 uppercase tracking-widest">Maintenance Mode Gate</span>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none flex items-center ${settings.maintenanceMode ? 'bg-rose-500 justify-end' : 'bg-slate-800 justify-start'}`}
                  >
                     <motion.div layout className="w-4 h-4 bg-black rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
                  </button>
               </div>

               {/* 2. Biometric Scan */}
               <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-brand-500/20 transition-all">
                  <div className="space-y-1 pr-4">
                     <span className="block text-[10px] font-black text-white uppercase tracking-tight">Biometric Check</span>
                     <span className="block text-[7.5px] font-bold text-slate-600 uppercase tracking-widest">Enforce scan calibration</span>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, biometricEnforced: !settings.biometricEnforced })}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none flex items-center ${settings.biometricEnforced ? 'bg-brand-500 justify-end' : 'bg-slate-800 justify-start'}`}
                  >
                     <motion.div layout className="w-4 h-4 bg-black rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
                  </button>
               </div>

               {/* 3. Offline LLM fallback */}
               <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-brand-500/20 transition-all">
                  <div className="space-y-1 pr-4">
                     <span className="block text-[10px] font-black text-white uppercase tracking-tight">Ollama Override</span>
                     <span className="block text-[7.5px] font-bold text-slate-600 uppercase tracking-widest">Direct Local LLaMA router</span>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, offlineAiOverride: !settings.offlineAiOverride })}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none flex items-center ${settings.offlineAiOverride ? 'bg-amber-500 justify-end' : 'bg-slate-800 justify-start'}`}
                  >
                     <motion.div layout className="w-4 h-4 bg-black rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
                  </button>
               </div>
            </div>
         </div>

         {/* Deploy settings */}
         <div className="pt-6 border-t border-white/5 space-y-4">
            {status.message && (
               <div className={`p-4 rounded-xl border flex items-center gap-3 text-[9px] font-black uppercase tracking-widest leading-none ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                  {status.type === 'success' ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                  {status.message}
               </div>
            )}
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-xl transition-all ${saving ? 'bg-slate-800 text-slate-600' : 'bg-brand-500 text-black hover:bg-brand-400 shadow-brand-500/25 active:scale-95 cursor-pointer'}`}
            >
               {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
               Sync Override Settings
            </button>
         </div>
      </div>

    </div>
  );
};

export default SystemControl;
