import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import JobDetailsStep from './interview/JobDetailsStep';
import SettingsStep from './interview/SettingsStep';
import ReviewStep from './interview/ReviewStep';
import InterviewPreCheck from './interview/InterviewPreCheck';
import InterviewSession from './interview/InterviewSession';
import { Briefcase, FileText, Target, ArrowRight, ChevronLeft, Sparkles, CheckCircle2, Zap, Shield, Activity, RefreshCcw } from 'lucide-react';


const InterviewFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [interviewData, setInterviewData] = useState({
    jobTitle: '',
    jobDescription: '',
    focusArea: '',
    difficulty: 'Medium',
    questionCount: 10,
    duration: 30,
    tone: 'Professional',
    environment: 'Tech Lab',
    interviewPlan: null  // Agent analysis plan — populated after JD analysis
  });


  const steps = [
    { id: 1, label: 'Neural Intel', sub: 'PHASE 01', path: '/dashboard/interview' },
    { id: 2, label: 'Calibration', sub: 'PHASE 02', path: '/dashboard/interview/settings' },
    { id: 3, label: 'Briefing', sub: 'PHASE 03', path: '/dashboard/interview/review' }
  ];

  // Fail-safe step detection
  const getStepFromPath = (path) => {
    if (path.includes('/settings')) return 2;
    if (path.includes('/review')) return 3;
    if (path.includes('/pre-check')) return 4;
    if (path.includes('/session')) return 5;
    return 1;
  };

  const activeStep = getStepFromPath(location.pathname);

  // Neural Scroll Protocol: High-fidelity zenith reset on phase transition
  useEffect(() => {
    const performScrollReset = () => {
      // Target the primary dashboard viewport
      const viewport = document.querySelector('.overflow-y-auto');
      if (viewport) {
        viewport.scrollTop = 0;
      }
      window.scrollTo(0, 0);
    };

    // Immediate Reset
    performScrollReset();

    // Delayed Sync (Handles AnimatePresence transitions)
    const syncTimer = setTimeout(performScrollReset, 150);
    return () => clearTimeout(syncTimer);
  }, [location.pathname]);

  const updateData = (newData) => {
    setInterviewData(prev => ({ ...prev, ...newData }));
  };

  const handleNavigate = (stepId) => {
    const step = steps.find(s => s.id === stepId);
    if (step) navigate(step.path);
    else if (stepId === 4) navigate('/dashboard/interview/pre-check');
    else if (stepId === 5) navigate('/dashboard/interview/session');
  };

  const nextStep = () => handleNavigate(activeStep + 1);
  const prevStep = () => handleNavigate(activeStep - 1);

  if (activeStep >= 4) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="pre-check" element={<InterviewPreCheck data={interviewData} />} />
          <Route path="session" element={<InterviewSession data={interviewData} />} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 px-6">
      {/* Cinematic Header - Persistent */}
      <motion.div 
        className="relative overflow-hidden rounded-[2.5rem] p-8 lg:p-10 mb-10 bg-[#030712] border border-white/5 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-accent-500/5 opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20 shadow-xl">
               <Activity className="w-6 h-6 text-brand-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter leading-none mb-1">
                Genesis <span className="text-gradient">Protocol.</span>
              </h1>
              <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] opacity-70">
                Neural Matrix Calibration In Progress
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-3 px-6 py-3 glass rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/5 hover:border-brand-500/30 transition-all active:scale-95 shadow-lg"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-brand-400" />
            Abort Sync
          </button>


        </div>
      </motion.div>

      {/* Progress Nav - Manual navigation disabled for future steps */}
      {activeStep <= 3 && (
        <div className="mb-14 relative max-w-xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/5 -translate-y-1/2" />
          <motion.div 
            className="absolute top-1/2 left-0 h-[1px] bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500 -translate-y-1/2 shadow-[0_0_10px_#22d3ee]"
            initial={false}
            animate={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
          />
          
          <div className="flex items-center justify-between relative z-10">
            {steps.map((step) => {
              const Icon = step.id === 1 ? Briefcase : step.id === 2 ? Zap : Shield;
              const isLocked = step.id > activeStep;
              
              return (
                <div key={step.id} className="flex flex-col items-center gap-4 group">
                  <motion.div 
                    onClick={() => !isLocked && navigate(step.path)}
                    className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 relative overflow-hidden
                      ${activeStep >= step.id 
                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20 cursor-pointer hover:scale-110' 
                        : 'bg-slate-900 text-slate-700 border border-white/10 cursor-not-allowed'}
                    `}
                  >
                    {activeStep > step.id ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className={`w-5 h-5 ${activeStep === step.id ? 'animate-pulse' : ''}`} />
                    ) }
                  </motion.div>

                  <div className="text-center">
                    <h4 className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-500 ${activeStep === step.id ? 'text-white' : activeStep > step.id ? 'text-brand-400' : 'text-slate-600'}`}>
                      {step.label}
                    </h4>
                  </div>

                  {activeStep === step.id && (
                     <motion.div 
                       layoutId="nav-indicator"
                       className="w-1 h-1 rounded-full bg-brand-500 shadow-[0_0_8px_#22d3ee] absolute -bottom-4"
                     />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Deployment Viewport */}
      <div className="relative min-h-[500px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {activeStep === 1 && <JobDetailsStep data={interviewData} updateData={updateData} onNext={nextStep} />}
            {activeStep === 2 && <SettingsStep data={interviewData} updateData={updateData} onNext={nextStep} onBack={prevStep} />}
            {activeStep === 3 && <ReviewStep data={interviewData} onNext={nextStep} onBack={prevStep} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterviewFlow;
