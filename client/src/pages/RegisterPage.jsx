import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Github, CheckCircle2, Loader2, ShieldCheck, Sparkles, Zap, Shield, Globe, Terminal } from 'lucide-react';
import Logo from '../components/Logo';
import { auth } from '../lib/api';
import { useCMS } from '../context/CMSContext';

const RegisterPage = () => {
  const { cmsContent } = useCMS();
  const content = cmsContent?.Register || {
    headline: 'Establish Identity.',
    subtitle: 'REGISTER A NEW OPERATIVE PROFILE IN THE ARCHIVES',
    supportText: 'Provision credentials to sync with the global simulated grid.',
    badge: 'Operative Enlistment Protocol',
    cardTheme: 'Dark Glass',
    bgStyle: 'Tech Grid'
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [step, setStep] = useState('form'); // 'form' or 'otp'
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Security mismatch: Passwords do not align.");
      setLoading(false);
      return;
    }

    try {
      await auth.sendOtp(formData.email);
      setStep('otp');
      const timer = setInterval(() => {
        setResendTimer(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
      return () => clearInterval(timer);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to transmit neural key.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setError("Incomplete key: All 6 neural nodes required.");
      setLoading(false);
      return;
    }

    try {
      await auth.verifyOtp(formData.email, enteredOtp);
      await auth.register(formData.email, formData.password, formData.fullName, enteredOtp);
      await auth.login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || "Neural rejection: Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;
    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    const nextIndex = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${nextIndex}`)?.focus();
  };

  return (
    <div className="h-screen max-h-screen bg-[#020617] flex relative overflow-hidden font-inter selection:bg-brand-500/30 selection:text-white">
      {/* Cinematic Background Layer */}
      {content.bgStyle === 'Tech Grid' && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      )}
      {content.bgStyle === 'Matrix Rain' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/0 via-[#10b981]/5 to-transparent pointer-events-none" />
      )}
      <div className="absolute top-0 right-0 w-[1000px] h-[600px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Content Section (Left) */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-center px-16 xl:px-24 py-8 relative z-10 h-full">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
        >
          <div className="mb-8 xl:mb-16">
            <Logo />
          </div>

          <h1 className="text-6xl xl:text-[6.5rem] font-black text-white leading-[0.85] tracking-tighter uppercase mb-6 xl:mb-10">
            Genesis <br />
            <span className="text-brand-500">Protocol.</span>
          </h1>
          
          <p className="text-slate-500 text-lg xl:text-xl max-w-xl font-bold uppercase tracking-widest leading-relaxed mb-10 xl:mb-16 opacity-80">
            Initialize your profile to unlock high-fidelity AI simulations and real-time biometric tracking.
          </p>

          <div className="grid grid-cols-2 gap-6 xl:gap-10">
            {[
              { icon: Zap, label: "Neural Interrogation", desc: "Adaptive AI question flow" },
              { icon: Shield, label: "Identity Sync", desc: "Hardware-level security" },
              { icon: Globe, label: "Global Archive", desc: "50,000+ career nodes" },
              { icon: Terminal, label: "ATS Override", desc: "Direct resume optimization" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="space-y-2.5 group"
              >
                <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:border-brand-500/30 group-hover:bg-brand-500/5 transition-all">
                  <feature.icon className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{feature.label}</h4>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-0.5 group-hover:text-slate-400 transition-colors">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Registration Hub (Right) */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 xl:p-12 relative z-10 h-full overflow-y-auto lg:overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div
              key="reg-form"
              initial={{ opacity: 0, scale: 0.95, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -40 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="w-full max-w-[500px]"
            >
              <div className="lg:hidden flex justify-center mb-8">
                <Logo />
              </div>

              <div className={`
                p-8 xl:p-12 rounded-[3rem] xl:rounded-[4rem] border relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]
                ${content.cardTheme === 'Dark Glass' ? 'glass-dark border-white/5 shadow-2xl' : ''}
                ${content.cardTheme === 'Sleek Grid' ? 'bg-[#070b14] border-brand-500/20 shadow-md shadow-brand-500/5' : ''}
                ${content.cardTheme === 'Sunset Neon' ? 'bg-black/80 border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.15)]' : ''}
                ${content.cardTheme === 'Emerald Vault' ? 'bg-[#022c22]/20 border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.15)]' : ''}
              `}>
                <div className="absolute top-0 right-0 p-8 xl:p-12 opacity-5 pointer-events-none">
                   <Sparkles className="w-24 h-24 xl:w-32 xl:h-32 text-brand-500" />
                </div>

                <div className="mb-8 xl:mb-12 relative z-10">
                  <h2 className="text-2xl xl:text-3xl font-black text-white tracking-tighter uppercase mb-2">{content.headline}</h2>
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">{content.subtitle}</p>
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 animate-shake"
                  >
                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleRegister} className="space-y-4 xl:space-y-6 relative z-10">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Protocol Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-brand-400 transition-colors" />
                      <input 
                        required
                        type="text" 
                        placeholder="ENTER FULL NAME"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full bg-[#030712] border border-white/5 rounded-2xl py-4 xl:py-5 pl-12 pr-6 text-xs font-black text-white placeholder:text-slate-850 focus:outline-none focus:border-brand-500/30 transition-all tracking-widest"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Data Endpoint</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-brand-400 transition-colors" />
                      <input 
                        required
                        type="email" 
                        placeholder="ENTER EMAIL ADDRESS"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-[#030712] border border-white/5 rounded-2xl py-4 xl:py-5 pl-12 pr-6 text-xs font-black text-white placeholder:text-slate-850 focus:outline-none focus:border-brand-500/30 transition-all tracking-widest"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Access Key</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-brand-400 transition-colors" />
                        <input 
                          required
                          type="password" 
                          placeholder="MIN 8 CHARS"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="w-full bg-[#030712] border border-white/5 rounded-2xl py-4 xl:py-5 pl-12 pr-6 text-xs font-black text-white placeholder:text-slate-850 focus:outline-none focus:border-brand-500/30 transition-all tracking-widest"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Confirm Key</label>
                      <div className="relative group">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-brand-400 transition-colors" />
                        <input 
                          required
                          type="password" 
                          placeholder="RE-ENTER KEY"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="w-full bg-[#030712] border border-white/5 rounded-2xl py-4 xl:py-5 pl-12 pr-6 text-xs font-black text-white placeholder:text-slate-850 focus:outline-none focus:border-brand-500/30 transition-all tracking-widest"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full py-5 xl:py-6 bg-brand-500 text-black rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-[0_20px_50px_rgba(34,211,238,0.2)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group mt-6 xl:mt-8 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Initialize Profile <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></>}
                  </button>
                </form>
                <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.2em] mt-4 xl:mt-6 text-center leading-relaxed">
                  {content.supportText}
                </p>

                <div className="mt-8 xl:mt-10 text-center relative z-10">
                   <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                     Identity confirmed? <Link to="/login" className="text-brand-400 hover:text-white transition-colors ml-2">Secure Login</Link>
                   </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, scale: 0.9, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-[500px]"
            >
              <div className="glass-dark p-8 xl:p-12 rounded-[3rem] xl:rounded-[4rem] border border-white/5 relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                <div className="mb-8 xl:mb-12 text-center relative z-10">
                  <div className="w-20 h-20 xl:w-24 xl:h-24 bg-brand-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 xl:mb-10 border border-brand-500/20 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                     <Mail className="w-8 h-8 xl:w-10 xl:h-10 text-brand-400 animate-pulse" />
                  </div>
                  <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tighter uppercase mb-4">Verify Node.</h2>
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] leading-relaxed">
                    Authentication key transmitted to: <br />
                    <span className="text-white mt-2 block tracking-widest normal-case">{formData.email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-8 xl:space-y-12 relative z-10">
                  <div className="flex justify-between gap-2.5 xl:gap-3">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={i === 0 ? handlePaste : undefined}
                        className="w-10 h-16 xl:w-12 xl:h-20 bg-[#030712] border border-white/5 rounded-2xl text-center text-2xl xl:text-3xl font-black text-brand-400 focus:outline-none focus:border-brand-500 transition-all shadow-xl"
                      />
                    ))}
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full py-5 xl:py-7 bg-white text-black rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 group"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Authorize Access <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" /></>}
                  </button>
                </form>

                <div className="mt-8 xl:mt-12 text-center relative z-10">
                  <button 
                    disabled={resendTimer > 0}
                    className="text-[9px] font-black text-brand-400 uppercase tracking-[0.3em] hover:text-white disabled:text-slate-700 transition-all"
                  >
                    {resendTimer > 0 ? `KEY RE-TRANSMISSION IN ${resendTimer}S` : 'RE-TRANSMIT AUTH KEY'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RegisterPage;
