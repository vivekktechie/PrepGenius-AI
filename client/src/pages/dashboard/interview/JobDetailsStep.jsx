import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, FileText, Target, ArrowRight, Sparkles, 
  Cpu, Search, AlertCircle, CheckCircle2, ShieldCheck, 
  XCircle, Zap, Brain, ScanLine, Layers, Code2, ChevronRight,
  Activity, Star, Tag, BarChart2, RefreshCw
} from 'lucide-react';
import { interview } from '../../../lib/api';

const VALID_ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Engineer', 
  'UI/UX Designer', 'Product Manager', 'Data Scientist', 
  'DevOps Engineer', 'Mobile App Developer', 'Cybersecurity Analyst',
  'Cloud Architect', 'QA Engineer', 'Machine Learning Engineer',
  'Software Engineer', 'React Developer', 'Node.js Developer', 'Java Developer',
  'Python Developer', 'System Administrator', 'Project Manager', 'Technical Lead',
  'Software Systems Architect', 'Database Administrator', 'Network Engineer'
];

const JOB_KEYWORDS = [
  'developer', 'engineer', 'designer', 'manager', 'lead', 'architect', 
  'analyst', 'specialist', 'consultant', 'administrator', 'scientist',
  'frontend', 'backend', 'fullstack', 'mobile', 'cloud', 'data', 'qa',
  'devops', 'security', 'software', 'systems', 'product', 'ux', 'ui', 'react', 'node', 'java', 'python', 'aws', 'azure'
];

const PRIORITY_COLORS = {
  High: 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
  Low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
};

const SENIORITY_COLORS = {
  Junior: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]',
  Mid: 'text-brand-400 bg-brand-500/10 border-brand-500/20 shadow-[0_0_15px_rgba(14,165,233,0.05)]',
  Senior: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]',
  Lead: 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.05)]',
};

const SCAN_STAGES = [
  { label: 'PARSING BLUEPRINT CORPUS', detail: 'Tokenizing job description and resolving semantic nodes.' },
  { label: 'EXTRACTING TECHNOLOGY MATRIX', detail: 'Mapping required frameworks, libraries, and language vectors.' },
  { label: 'CALIBRATING EXPERIENCE SENIORITY', detail: 'Evaluating target parameters and profile expectations.' },
  { label: 'SYNTHESIZING INTERVIEW STRATEGY', detail: 'Compiling targeted questions, difficulty curve, and assessment focus.' }
];

const JobDetailsStep = ({ data, updateData, onNext }) => {
  const [roleStatus, setRoleStatus] = useState('idle'); 
  const [descStatus, setDescStatus] = useState('idle');
  const [suggestions, setSuggestions] = useState([]);
  const [analysisState, setAnalysisState] = useState('idle'); // idle | analyzing | done | error
  const [agentPlan, setAgentPlan] = useState(data.interviewPlan || null);
  const [analysisError, setAnalysisError] = useState('');
  
  const [scanStage, setScanStage] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    let stageInterval;
    let progressInterval;
    if (analysisState === 'analyzing') {
      setScanStage(0);
      setScanProgress(0);
      
      // Cycle through scanning text stages faster (every 700ms)
      stageInterval = setInterval(() => {
        setScanStage(prev => (prev < 3 ? prev + 1 : 3));
      }, 700);

      // Fast-walking progress bar (ticks every 150ms)
      progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 95) return 95; // Hold at 95% until API returns
          const increment = Math.random() * 12 + 6;
          return Math.min(95, prev + increment);
        });
      }, 150);
    } else {
      setScanStage(0);
      setScanProgress(0);
    }
    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, [analysisState]);

  const validateProfessionalRole = (str) => {
    if (!str || str.length < 5) return false;
    if (/(.)\1{2,}/.test(str)) return false; 
    if (!/[aeiouy]/i.test(str)) return false; 
    
    const words = str.toLowerCase().trim().split(/[\s_-]+/);
    const hasProfessionalKeyword = words.some(word => 
      JOB_KEYWORDS.includes(word) || 
      VALID_ROLES.some(r => r.toLowerCase().includes(word))
    );
    if (!hasProfessionalKeyword) return false;

    const consonants = str.match(/[^aeiouy\s\d\W]/gi);
    if (consonants && consonants.length / str.length > 0.75) return false;
    return true;
  };

  const validateRole = (val) => {
    if (!val) { setRoleStatus('idle'); return; }
    setRoleStatus('checking');
    setTimeout(() => {
      const isValid = validateProfessionalRole(val);
      setRoleStatus(isValid ? 'valid' : 'invalid');
    }, 600);
  };

  const validateDesc = (val) => {
    if (!val) { setDescStatus('idle'); return; }
    setDescStatus('checking');
    setTimeout(() => {
      const isLongEnough = val.length >= 50;
      const hasKeywords = /(skill|experience|requirement|responsibilit|work|team|tech|build|develop|developer|knowledge|proficient|expert|familiar)/i.test(val);
      const isGibberish = !/[aeiouy]/i.test(val) || val.length < 20;
      setDescStatus(isLongEnough && hasKeywords && !isGibberish ? 'valid' : 'invalid');
    }, 800);
  };

  useEffect(() => { validateRole(data.jobTitle); }, [data.jobTitle]);
  useEffect(() => { 
    validateDesc(data.jobDescription); 
    // Reset plan if JD changes
    if (agentPlan) {
      setAgentPlan(null);
      setAnalysisState('idle');
      updateData({ interviewPlan: null });
    }
  }, [data.jobDescription]);

  useEffect(() => { validateRole(data.jobTitle); }, []);

  const handleRoleChange = (val) => {
    updateData({ jobTitle: val });
    if (val.length > 1) {
       const filtered = VALID_ROLES.filter(r => r.toLowerCase().includes(val.toLowerCase())).slice(0, 5);
       setSuggestions(filtered);
    } else { setSuggestions([]); }
  };

  const canAnalyze = roleStatus === 'valid' && descStatus === 'valid' && analysisState !== 'analyzing';
  const isComplete = agentPlan !== null;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setAnalysisState('analyzing');
    setAnalysisError('');
    try {
      const response = await interview.analyzeJobDescription({
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        difficulty: data.difficulty || 'Medium'
      });
      const plan = response.data.plan;
      
      // Perform immediate completion sweep to 100%
      setScanProgress(100);
      setScanStage(3);
      
      // Brief delay to let the user see the 100% scan complete state
      setTimeout(() => {
        setAgentPlan(plan);
        updateData({ interviewPlan: plan });
        setAnalysisState('done');
      }, 500);
    } catch (err) {
      console.error('Analysis failed:', err);
      setAnalysisError('Neural analysis failed. Check your connection and try again.');
      setAnalysisState('error');
    }
  };

  const handleReAnalyze = () => {
    setAgentPlan(null);
    updateData({ interviewPlan: null });
    setAnalysisState('idle');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 max-w-6xl mx-auto">
      {/* Primary Data Input Matrix */}
      <div className="lg:col-span-8 space-y-8">
        <AnimatePresence mode="wait">
          {/* STATE B: Holographic Neural Scanner */}
          {analysisState === 'analyzing' && (
            <motion.div
              key="scanner-container"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              className="glass-dark border border-brand-500/20 rounded-[3rem] p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)]"
            >
              {/* Embedded keyframe styles */}
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes scanbeam {
                  0% { top: 0%; opacity: 0.2; }
                  50% { top: 100%; opacity: 0.8; }
                  100% { top: 0%; opacity: 0.2; }
                }
                @keyframes rotateRadar {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes rotateRadarReverse {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(-360deg); }
                }
                @keyframes pulseGlow {
                  0%, 100% { transform: scale(1); opacity: 0.5; filter: drop-shadow(0 0 10px rgba(14,165,233,0.1)); }
                  50% { transform: scale(1.06); opacity: 0.9; filter: drop-shadow(0 0 25px rgba(14,165,233,0.35)); }
                }
              `}} />

              {/* Cyber Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
              
              {/* Scan laser */}
              <div 
                className="absolute left-0 w-full h-[2.5px] bg-gradient-to-r from-transparent via-brand-500 to-transparent shadow-[0_0_20px_#0ea5e9] pointer-events-none z-10"
                style={{ animation: 'scanbeam 2.8s linear infinite', top: '0%' }}
              />

              {/* Holographic Concentric Core */}
              <div className="relative w-56 h-56 flex items-center justify-center mb-10">
                <div 
                  className="absolute inset-0 border border-dashed border-brand-500/25 rounded-full"
                  style={{ animation: 'rotateRadar 20s linear infinite' }}
                />
                <div 
                  className="absolute w-[80%] h-[80%] border border-dashed border-accent-500/20 rounded-full"
                  style={{ animation: 'rotateRadarReverse 14s linear infinite' }}
                />
                <div 
                  className="absolute w-[60%] h-[60%] bg-gradient-to-tr from-brand-500/5 to-accent-500/5 rounded-full border border-white/5 shadow-2xl"
                />
                <div className="relative z-10 w-20 h-20 rounded-3xl bg-brand-500/10 flex items-center justify-center border border-brand-500/30 shadow-[0_0_30px_rgba(14,165,233,0.15)]" style={{ animation: 'pulseGlow 2.5s ease-in-out infinite' }}>
                  <Brain className="w-10 h-10 text-brand-400" />
                </div>
              </div>

              {/* Dynamic Readout */}
              <div className="text-center space-y-4 max-w-md px-6 relative z-10">
                <div className="inline-block px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-[9px] font-black tracking-[0.3em] text-brand-400 uppercase">
                  Analyzing Blueprint
                </div>
                <h3 className="text-white text-4xl font-black tracking-tighter tabular-nums leading-none">
                  {Math.round(scanProgress)}% <span className="text-slate-600 font-medium text-lg">/ 100</span>
                </h3>
                <div className="h-1.5 w-64 bg-slate-950 border border-white/5 rounded-full overflow-hidden mx-auto shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-brand-600 via-brand-400 to-accent-500"
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="space-y-2 pt-3">
                  <p className="text-slate-200 text-xs font-black uppercase tracking-widest min-h-[16px] text-brand-300">
                    {SCAN_STAGES[scanStage]?.label}
                  </p>
                  <p className="text-slate-500 text-[10px] leading-relaxed max-w-xs mx-auto font-medium">
                    {SCAN_STAGES[scanStage]?.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STATE C: Completed Plan Dashboard & Target Summary */}
          {agentPlan && analysisState !== 'analyzing' && (
            <motion.div
              key="plan-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Consolidated Target Summary Banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-dark border border-white/5 rounded-[2rem] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group shadow-lg"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-[50px] pointer-events-none" />
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20 shadow-md">
                    <Briefcase className="w-6 h-6 text-brand-400" />
                  </div>
                  <div>
                    <h4 className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Target Zenith</h4>
                    <p className="text-white text-xl font-extrabold tracking-tight">{data.jobTitle}</p>
                  </div>
                </div>
                <button
                  onClick={handleReAnalyze}
                  className="px-5 py-3.5 bg-white/5 border border-white/10 hover:border-brand-500/30 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-white transition-all flex items-center gap-2.5 hover:bg-white/10 active:scale-95 shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Modify Blueprint
                </button>
              </motion.div>

              {/* Holographic Agent Plan Card */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-[2.5rem] border border-brand-500/20 bg-gradient-to-br from-slate-950/90 to-black p-10 lg:p-12 shadow-2xl"
              >
                {/* Glow outlines */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/8 blur-[90px] -mr-40 -mt-40 pointer-events-none" />

                {/* Header HUD */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-brand-500/15 flex items-center justify-center border border-brand-500/30 shadow-[0_0_20px_rgba(14,165,233,0.15)]">
                      <ScanLine className="w-7 h-7 text-brand-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-black tracking-tight text-2xl">Agent Analysis Complete</h3>
                      <p className="text-brand-400/60 text-[9px] font-black uppercase tracking-[0.4em] mt-1">Custom Interview Plan Configured</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className={`px-4.5 py-2.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${SENIORITY_COLORS[agentPlan.seniorityLevel] || 'text-brand-400 border-white/10'}`}>
                      {agentPlan.seniorityLevel} Level
                    </span>
                  </div>
                </div>

                {/* Assessment Focus Container */}
                <div className="mb-10 px-8 py-5 border-l-2 border-brand-500 bg-brand-500/5 rounded-r-3xl rounded-l-md relative z-10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                  <p className="text-[9px] font-black text-brand-400/60 uppercase tracking-[0.3em] mb-1.5">Assessment Focus</p>
                  <p className="text-slate-200 text-sm font-semibold leading-relaxed tracking-wide">{agentPlan.assessmentFocus}</p>
                </div>

                {/* Unified Skills & Technologies Matrix */}
                <div className="relative z-10 border-t border-white/5 pt-8">
                  <div className="flex items-center justify-between mb-6 px-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                        <Code2 className="w-4 h-4 text-brand-400" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Core Skills & Technologies</span>
                    </div>
                    <span className="text-[8px] font-black text-accent-400 uppercase tracking-widest px-3 py-1 bg-accent-500/10 rounded-full border border-accent-500/20">
                      {Array.from(new Set([...(agentPlan.coreSkills || []), ...(agentPlan.techStack || [])])).length} Parameters Identified
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {Array.from(new Set([...(agentPlan.coreSkills || []), ...(agentPlan.techStack || [])])).map((skill, i) => (
                      <motion.span 
                        key={i} 
                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: i * 0.03, type: 'spring', stiffness: 120 }}
                        className="px-5 py-2.5 bg-slate-900/40 border border-white/5 hover:border-brand-500/40 hover:text-white rounded-xl text-slate-300 text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-[1.05] hover:bg-slate-900/80 shadow-[0_2px_10px_rgba(0,0,0,0.5)] cursor-default flex items-center gap-2 group/skill"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500/50 group-hover/skill:bg-brand-400 transition-colors" />
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
                {/* Removed Interview Strategy Topics */}
              </motion.div>
            </motion.div>
          )}

          {/* STATE A: Raw Input Configuration Parameters */}
          {analysisState !== 'analyzing' && !agentPlan && (
            <motion.div
              key="inputs-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-dark border border-white/5 rounded-[3rem] p-10 lg:p-14 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/5 blur-[100px] -mr-48 -mt-48 pointer-events-none" />
              
              <div className="mb-12 relative z-10 flex items-center justify-between">
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20 shadow-xl">
                       <Cpu className="w-7 h-7 text-brand-400" />
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-white tracking-tighter">Neural Intel.</h2>
                       <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Strategic Parameter Entry</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-10 relative z-10">
                {/* Job Title Module */}
                <div className="group relative">
                  <div className="flex items-center justify-between mb-4 px-2">
                     <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] group-focus-within:text-brand-400 transition-colors">
                        <Briefcase className="w-4 h-4" />
                        Target Zenith
                     </div>
                     <div className="flex items-center gap-2">
                        <AnimatePresence mode="wait">
                           {roleStatus === 'valid' ? (
                              <motion.span key="v" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[8px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />Authenticated</motion.span>
                           ) : roleStatus === 'invalid' ? (
                              <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Invalid Title</motion.span>
                           ) : null}
                        </AnimatePresence>
                     </div>
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="text" 
                      value={data.jobTitle}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      placeholder="e.g., Software Architect"
                      className={`
                        w-full bg-black/40 border rounded-2xl py-6 px-8 text-white focus:outline-none transition-all placeholder:text-slate-800 text-xl font-bold tracking-tight pr-12
                        ${roleStatus === 'valid' ? 'border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)] focus:border-emerald-500/40' : roleStatus === 'invalid' ? 'border-rose-500/20 focus:border-rose-500/40' : 'border-white/5 focus:border-brand-500/30'}
                      `}
                    />
                    
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                       {roleStatus === 'valid' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : roleStatus === 'invalid' ? <AlertCircle className="w-5 h-5 text-rose-500" /> : <Search className="w-5 h-5 text-slate-700" />}
                    </div>

                    {/* Suggestions & Warning Container */}
                    <div className="absolute z-[100] left-0 right-0">
                      <AnimatePresence mode="wait">
                         {suggestions.length > 0 ? (
                           <motion.div 
                             key="suggestions"
                             initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                             className="mt-3 p-2 glass-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                           >
                              {suggestions.map((s, i) => (
                                 <button key={i} onClick={() => { updateData({ jobTitle: s }); setSuggestions([]); }} className="w-full text-left px-6 py-4 rounded-xl hover:bg-brand-500/10 hover:text-brand-400 transition-all text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    {s}
                                 </button>
                              ))}
                           </motion.div>
                         ) : (roleStatus === 'invalid' && data.jobTitle.length > 0) ? (
                            <motion.div 
                              key="warning"
                              initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                              className="mt-4 px-6 py-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 backdrop-blur-md"
                            >
                               <AlertCircle className="w-4 h-4 text-rose-500" />
                               <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Invalid Role: Please enter a recognized professional title.</span>
                            </motion.div>
                         ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Job Description Module */}
                <div className="group relative pt-8">
                  <div className="flex items-center justify-between mb-4 px-2">
                     <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] group-focus-within:text-brand-400 transition-colors">
                        <FileText className="w-4 h-4" />
                        Mission Blueprint
                     </div>
                     <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
                        {descStatus === 'valid' ? (
                           <span className="text-emerald-500">Verified Blueprint</span>
                        ) : (
                           <span className="text-slate-600">{data.jobDescription.length} / 50 Units</span>
                        )}
                     </div>
                  </div>
                  
                  <div className="relative">
                     <textarea 
                       rows={10}
                       value={data.jobDescription}
                       onChange={(e) => updateData({ jobDescription: e.target.value })}
                       placeholder="Paste the full job description here — the agent will extract skills, tech stack, and build a custom interview strategy..."
                       className={`
                        w-full bg-black/40 border rounded-3xl py-8 px-10 text-white focus:outline-none transition-all placeholder:text-slate-800 resize-none font-medium text-base leading-relaxed no-scrollbar
                        ${descStatus === 'valid' ? 'border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)] focus:border-emerald-500/40' : descStatus === 'invalid' ? 'border-rose-500/20 focus:border-rose-500/40' : 'border-white/5 focus:border-brand-500/30'}
                      `}
                     />
                     
                     <div className="absolute bottom-6 right-6 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${descStatus === 'valid' ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/5'}`}>
                           {descStatus === 'valid' ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <Sparkles className="w-4 h-4 text-slate-800" />}
                        </div>
                     </div>
                  </div>
                </div>

                {/* Agent Analysis CTA */}
                <AnimatePresence>
                  {canAnalyze && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="pt-2"
                    >
                      <button
                        onClick={handleAnalyze}
                        disabled={analysisState === 'analyzing'}
                        className="w-full group relative overflow-hidden py-6 rounded-2xl bg-gradient-to-r from-accent-600/20 to-brand-600/20 border border-brand-500/20 hover:border-brand-500/50 transition-all text-white font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <Brain className="w-5 h-5 text-brand-400 relative z-10" />
                        <span className="relative z-10">Activate Agent Analysis</span>
                        <Zap className="w-4 h-4 text-accent-400 relative z-10" />
                      </button>
                      {analysisError && (
                        <motion.p
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="mt-3 text-[10px] text-rose-400 font-black uppercase tracking-widest text-center"
                        >
                          {analysisError}
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Strategic Info & Deploy Column */}
      <div className="lg:col-span-4 space-y-10">


        {/* Agent Status Card */}
        <div className="p-8 bg-brand-500/[0.02] border border-brand-500/10 rounded-[2.5rem] relative">
           <div className="flex items-center gap-3 mb-4">
              <div className={`w-2 h-2 rounded-full ${agentPlan ? 'bg-emerald-500' : canAnalyze ? 'bg-brand-500 animate-ping' : 'bg-slate-700'}`} />
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-400">
                {agentPlan ? 'Agent Ready' : canAnalyze ? 'Analysis Available' : 'Awaiting Parameters'}
              </span>
           </div>
           <p className="text-slate-500 text-xs leading-relaxed font-medium">
              {agentPlan 
                ? 'The AI agent has analysed your job description and built a targeted interview strategy. Review the plan and proceed.' 
                : canAnalyze 
                ? 'Your job description is ready for agent analysis. Click "Activate Agent Analysis" to generate a targeted interview strategy.'
                : 'Enter a valid job title and detailed job description (50+ characters with role keywords) to enable agent analysis.'}
           </p>
        </div>

        <button 
          onClick={onNext}
          disabled={!isComplete}
          className={`
            w-full py-7 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-4 group relative overflow-hidden
            ${isComplete 
              ? 'bg-brand-600 text-white shadow-2xl shadow-brand-600/20 hover:bg-brand-500 hover:scale-[1.02] active:scale-95' 
              : 'bg-white/5 text-slate-800 cursor-not-allowed opacity-50'}
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative z-10 tracking-widest text-sm">
            {isComplete ? 'CONFIRM & CALIBRATE' : agentPlan === null && canAnalyze ? 'ANALYSE FIRST' : 'VALIDATION PENDING'}
          </span>
          <ArrowRight className={`w-5 h-5 transition-transform ${isComplete ? 'group-hover:translate-x-2' : 'opacity-0'}`} />
        </button>
      </div>
    </div>
  );
};

export default JobDetailsStep;

