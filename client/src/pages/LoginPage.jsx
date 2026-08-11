import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Github, Sparkles, TrendingUp, Loader2, ShieldCheck, Zap, Activity, Cpu, Star } from 'lucide-react';
import Logo from '../components/Logo';
import { auth } from '../lib/api';
import { useCMS } from '../context/CMSContext';

const LoginPage = () => {
  const { cmsContent } = useCMS();
  const content = cmsContent?.Login || {
    headline: 'Restore Session Link.',
    subtitle: 'INPUT YOUR OPERATIVE IDENTIFICATION HASH',
    supportText: 'Enter secure access credentials to establish a database session.',
    badge: 'Agent Authorization Required',
    cardTheme: 'Dark Glass',
    bgStyle: 'Tech Grid'
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState('login'); // 'login', 'forgot-email', 'forgot-reset'
  const [showMfa, setShowMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [tempUserId, setTempUserId] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    resetKey: '',
    newPassword: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await auth.login(formData.email, formData.password);
      if (result?.mfaRequired) {
        setTempUserId(result.userId);
        setShowMfa(true);
        setSuccess('Neural link established. Identity verification required.');
      } else {
        setSuccess('Access granted. Initializing supreme session...');
        if (result.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await auth.loginMfa(tempUserId, mfaCode);
      setSuccess('Identity confirmed. Initializing supreme session...');
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await auth.forgotPassword(formData.email);
      setStep('forgot-reset');
      setSuccess("Recovery key transmitted to your inbox.");
    } catch (err) {
      setError(err.response?.data?.error || 'Transmission failure.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await auth.resetPassword(formData.email, formData.resetKey, formData.newPassword);
      setStep('login');
      setSuccess("Neural access password modulated. You may now authorize.");
    } catch (err) {
      setError(err.response?.data?.error || 'Database modulation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex relative overflow-hidden font-inter selection:bg-brand-500/30 selection:text-white">
      {/* Background Matrix Architecture */}
      {content.bgStyle === 'Tech Grid' && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      )}
      {content.bgStyle === 'Matrix Rain' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/0 via-[#10b981]/5 to-transparent pointer-events-none" />
      )}
      <div className="absolute top-0 left-0 w-[1000px] h-[600px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Narrative Section (Left) */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-center px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
        >
          <div className="mb-16">
            <Logo />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-10 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
          >
            <Activity className="w-4 h-4 text-brand-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-400">Identity Reconnaissance Active</span>
          </motion.div>

          <h1 className="text-[6.5rem] font-black text-white leading-[0.85] tracking-tighter uppercase mb-10">
            Welcome <br />
            <span className="text-brand-500">Back.</span>
          </h1>
          
          <p className="text-slate-500 text-xl max-w-xl font-bold uppercase tracking-widest leading-relaxed mb-16 opacity-80">
            Synchronize your career milestones and access high-intensity AI simulation protocols.
          </p>

          <div className="grid grid-cols-2 gap-8 max-w-lg">
            {[
              { icon: Cpu, label: "Neural Engine", desc: "v2.4 Core Online", color: "text-brand-400" },
              { icon: Star, label: "Global Rating", desc: "Top 2% Mastery", color: "text-amber-400" }
            ].map((node, i) => (
              <div key={i} className="p-8 glass-dark rounded-[2.5rem] border border-white/5 hover:border-brand-500/30 transition-all group overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <node.icon className={`w-8 h-8 ${node.color} mb-4 relative z-10`} />
                 <h4 className="text-[10px] font-black text-white uppercase tracking-widest relative z-10">{node.label}</h4>
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1 group-hover:text-slate-400 transition-colors relative z-10">{node.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Access Hub (Right) */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          {step === 'login' ? (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, scale: 0.95, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -40 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="w-full max-w-[500px]"
            >
              <div className="lg:hidden flex justify-center mb-10">
                <Logo />
              </div>

              <div className={`
                p-12 rounded-[4rem] border relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]
                ${content.cardTheme === 'Dark Glass' ? 'glass-dark border-white/5 shadow-2xl' : ''}
                ${content.cardTheme === 'Sleek Grid' ? 'bg-[#070b14] border-brand-500/20 shadow-md shadow-brand-500/5' : ''}
                ${content.cardTheme === 'Sunset Neon' ? 'bg-black/80 border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.15)]' : ''}
                ${content.cardTheme === 'Emerald Vault' ? 'bg-[#022c22]/20 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.15)]' : ''}
              `}>
                {!showMfa ? (
                  <>
                    <div className="mb-12 relative z-10 text-center lg:text-left">
                      <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">{content.headline}</h2>
                      <div className="flex items-center gap-3 justify-center lg:justify-start">
                         <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">{content.subtitle}</p>
                      </div>
                    </div>

                    {(error || success) && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-8 p-5 rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 border ${error ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}
                      >
                        <ShieldCheck className="w-5 h-5" />
                        {error || success}
                      </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Identity Endpoint</label>
                        <div className="relative group">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-brand-400 transition-colors" />
                          <input 
                            required
                            type="email" 
                            placeholder="ENTER EMAIL ADDRESS"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-[#030712] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-xs font-black text-white placeholder:text-slate-800 focus:outline-none focus:border-brand-500/30 transition-all tracking-widest"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                          <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Neural Key</label>
                          <button 
                            type="button"
                            onClick={() => setStep('forgot-email')}
                            className="text-[9px] font-black uppercase tracking-widest text-brand-400 hover:text-white transition-colors"
                          >
                            LOST ACCESS?
                          </button>
                        </div>
                        <div className="relative group">
                          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-brand-400 transition-colors" />
                          <input 
                            required
                            type="password" 
                            placeholder="ENTER ACCESS PASSWORD"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-[#030712] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-xs font-black text-white placeholder:text-slate-800 focus:outline-none focus:border-brand-500/30 transition-all tracking-widest"
                          />
                        </div>
                      </div>

                      <button 
                        disabled={loading}
                        type="submit"
                        className="w-full py-6 bg-brand-500 text-black rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-[0_20px_50px_rgba(34,211,238,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group mt-10 disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Authorize Session <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></>}
                      </button>
                    </form>
                    <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.2em] mt-6 text-center leading-relaxed">
                      {content.supportText}
                    </p>
                  </>
                ) : (
                  <form onSubmit={handleMfaVerify} className="space-y-10 relative z-10 text-center">
                    <div className="w-24 h-24 bg-brand-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-brand-500/20 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                       <Zap className="w-10 h-10 text-brand-400 animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">Shield Sync.</h2>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] leading-relaxed mb-12">
                      Authentication key required to <br /> complete identity verification.
                    </p>
                    
                    <input 
                      autoFocus
                      required
                      type="text" 
                      maxLength="6"
                      placeholder="000000"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      className="w-full bg-[#030712] border border-white/5 rounded-2xl py-6 text-center text-3xl font-black tracking-[1rem] text-brand-400 focus:outline-none focus:border-brand-500 transition-all shadow-xl"
                    />

                    <button 
                      disabled={loading}
                      type="submit"
                      className="w-full py-7 bg-white text-black rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 group"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Confirm Identity <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" /></>}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setShowMfa(false)}
                      className="text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors"
                    >
                      BACK TO CREDENTIALS
                    </button>
                  </form>
                )}

                <div className="mt-12 text-center relative z-10 border-t border-white/5 pt-10">
                   <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                     New to the matrix? <Link to="/register" className="text-brand-400 hover:text-white transition-colors ml-2">Register Identity</Link>
                   </p>
                </div>
              </div>
            </motion.div>
          ) : step === 'forgot-email' ? (
            <motion.div
              key="forgot-email"
              initial={{ opacity: 0, scale: 0.95, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -40 }}
              className="w-full max-w-[500px]"
            >
              <div className="glass-dark p-12 rounded-[4rem] border border-white/5 relative overflow-hidden shadow-2xl">
                 <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-brand-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-brand-500/20">
                       <Mail className="w-10 h-10 text-brand-400" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">Identity Recovery.</h2>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] leading-relaxed">
                       Enter your endpoint to receive <br/> a neural re-transmission key.
                    </p>
                 </div>

                 <form onSubmit={handleForgotPassword} className="space-y-8">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Account Endpoint</label>
                       <input 
                         required
                         type="email" 
                         placeholder="ENTER EMAIL ADDRESS"
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         className="w-full bg-[#030712] border border-white/5 rounded-2xl py-5 px-6 text-xs font-black text-white placeholder:text-slate-800 focus:outline-none focus:border-brand-500/30 transition-all tracking-widest"
                       />
                    </div>

                    <button 
                      disabled={loading}
                      type="submit"
                      className="w-full py-6 bg-brand-500 text-black rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-xl"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Transmit Recovery Key"}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setStep('login')}
                      className="w-full text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors"
                    >
                      BACK TO LOGIN
                    </button>
                 </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="forgot-reset"
              initial={{ opacity: 0, scale: 0.95, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -40 }}
              className="w-full max-w-[500px]"
            >
              <div className="glass-dark p-12 rounded-[4rem] border border-white/5 relative overflow-hidden shadow-2xl">
                 <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                       <Sparkles className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">Finalize Reset.</h2>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] leading-relaxed">
                       Update your neural access key.
                    </p>
                 </div>

                 <form onSubmit={handleResetPassword} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Recovery Node</label>
                       <input 
                         required
                         type="text" 
                         maxLength="6"
                         placeholder="000000"
                         value={formData.resetKey}
                         onChange={(e) => setFormData({...formData, resetKey: e.target.value})}
                         className="w-full bg-[#030712] border border-white/5 rounded-2xl py-6 text-center text-3xl font-black tracking-[1rem] text-brand-400 focus:outline-none focus:border-brand-500 transition-all shadow-xl"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">New Neural Key</label>
                       <input 
                         required
                         type="password" 
                         placeholder="ENTER NEW PASSWORD"
                         value={formData.newPassword}
                         onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                         className="w-full bg-[#030712] border border-white/5 rounded-2xl py-5 px-6 text-xs font-black text-white placeholder:text-slate-800 focus:outline-none focus:border-brand-500/30 transition-all tracking-widest"
                       />
                    </div>

                    <button 
                      disabled={loading}
                      type="submit"
                      className="w-full py-6 bg-brand-500 text-black rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-xl"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Credentials"}
                    </button>
                 </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoginPage;
