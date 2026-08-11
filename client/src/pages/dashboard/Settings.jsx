import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Shield, Save, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, Fingerprint, Activity, UserCheck, QrCode, Upload, Hexagon, Key, Terminal, Globe, ShieldAlert, Target, Mail
} from 'lucide-react';
import { auth } from '../../lib/api';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [mfaError, setMfaError] = useState(false);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    full_name: '',
    career_goal: '',
    bio: '',
    mfa_enabled: false,
    avatar_url: ''
  });

  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [mfaData, setMfaData] = useState(null);
  const [mfaCode, setMfaCode] = useState('');
  const [isMfaEnrolling, setIsMfaEnrolling] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userStr = localStorage.getItem('genesis_user');
      if (userStr) {
        const u = JSON.parse(userStr);
        setUser(u);
        setFormData({
          full_name: u.full_name || '',
          career_goal: u.career_goal || '',
          bio: u.bio || '',
          mfa_enabled: !!u.mfa_enabled,
          avatar_url: u.avatar_url || ''
        });
      }
    };
    fetchUser();
  }, []);

  const showToast = (msg, isError = false) => {
    if (isError) setError(msg);
    else setSuccess(msg);
    setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 4000);
  };

  const handleUpdateProfile = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const { user: updatedUser } = await auth.updateProfile({
        full_name: formData.full_name,
        career_goal: formData.career_goal,
        bio: formData.bio,
        avatar_url: formData.avatar_url
      });
      setUser(updatedUser);
      setIsAvatarSelectorOpen(false);
      showToast('Profile Cache Synchronized (Local)');
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (err) {
      showToast(err.response?.data?.error || 'Profile sync failed.', true);
    } finally {
      setLoading(false);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 512;
          const MAX_HEIGHT = 512;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
      };
    });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const compressedDataUrl = await compressImage(file);
        setFormData({ ...formData, avatar_url: compressedDataUrl });
        showToast('Neural Image Optimized');
      } catch (err) {
        showToast('Image optimization failed.', true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', true);
      return;
    }
    setLoading(true);
    try {
      await auth.changePassword(newPassword);
      showToast('Neural Access Key Updated');
      setIsPasswordModalOpen(false);
      setNewPassword('');
    } catch (err) {
      showToast(err.response?.data?.error || 'Credential update failed.', true);
    } finally {
      setLoading(false);
    }
  };

  const handleMfaToggle = async () => {
    if (formData.mfa_enabled) {
      setLoading(true);
      try {
        await auth.disableMfa();
        showToast('Identity Shield Offline');
        setFormData({ ...formData, mfa_enabled: false });
        const updatedUser = { ...user, mfa_enabled: false };
        setUser(updatedUser);
        localStorage.setItem('genesis_user', JSON.stringify(updatedUser));
      } catch (err) {
        showToast('Failed to disable Identity Shield.', true);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        const data = await auth.setupMfa();
        setMfaData(data);
        setMfaCode('');
        setMfaError(false);
        setIsMfaEnrolling(true);
      } catch (err) {
        showToast('Failed to initialize Identity Shield.', true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMfaVerify = async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      setMfaError(true);
      return;
    }
    setLoading(true);
    try {
      await auth.verifyMfa(mfaCode);
      setFormData({ ...formData, mfa_enabled: true });
      setIsMfaEnrolling(false);
      showToast('Identity Shield Activated');
      const updatedUser = { ...user, mfa_enabled: true };
      setUser(updatedUser);
      localStorage.setItem('genesis_user', JSON.stringify(updatedUser));
    } catch (err) {
      setMfaError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto py-10 px-6 lg:px-12 min-h-screen relative font-inter">
      {/* Premium Futuristic Background Aura System */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 bg-[#020617]">
        {/* Animated Aurora Blobs */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.15, 0.9, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-[900px] h-[900px] bg-brand-500/15 blur-[160px] opacity-60 translate-x-1/4 -translate-y-1/4"
        />
        <motion.div
          animate={{
            x: [0, -30, 30, 0],
            y: [0, 40, -30, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-accent-500/15 blur-[160px] opacity-50 -translate-x-1/4 translate-y-1/4"
        />
        <motion.div
          animate={{
            x: [-20, 20, -20],
            y: [20, -20, 20],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-purple-500/10 blur-[180px] opacity-30"
        />
        {/* Soft Noise Overlay for premium depth */}
        <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />

      {/* Hero Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5 relative">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-400 text-[10px] font-black uppercase tracking-[0.4em]">
            <Terminal className="w-3 h-3" /> System Configuration
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none relative">
            Neural <span className="text-gradient filter drop-shadow-[0_0_30px_rgba(14,165,233,0.3)]">Matrix.</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-xl text-sm leading-relaxed">
            Calibrate your digital identity and fortify your security perimeter in a unified tactical dashboard.
          </p>
        </motion.div>

        <div className="flex items-center gap-4">
          {/* Matrix Pulse Indicator */}
          <div className="hidden lg:flex items-center gap-4 px-6 py-4 bg-white/[0.01] border border-white/10 rounded-[2rem] shadow-xl backdrop-blur-xl hover:bg-white/[0.02] hover:border-white/20 transition-all duration-300">
            <div className="relative flex items-center justify-center">
              <div className={`w-3 h-3 rounded-full ${loading ? 'bg-brand-500 animate-pulse' : 'bg-emerald-500'} shadow-[0_0_15px_currentColor]`} />
              <div className={`absolute inset-[-4px] rounded-full border border-current opacity-20 animate-pulse`} style={{ color: loading ? '#0ea5e9' : '#10b981' }} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Global Pulse</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">{loading ? 'Synchronizing Data...' : 'System Nominal'}</span>
            </div>
          </div>

          <button
            onClick={handleUpdateProfile}
            disabled={loading}
            className="relative px-10 py-5 bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-400 hover:to-accent-500 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.25em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(14,165,233,0.3)] hover:shadow-[0_0_50px_rgba(14,165,233,0.5)] border border-white/10 flex items-center gap-3 group overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
            Sync Configuration
          </button>
        </div>
      </div>

      {/* Global Toast */}
      <AnimatePresence>
        {(success || error) && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100]"
          >
            <div className={`px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border backdrop-blur-xl ${success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.15)]' : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_40px_rgba(244,63,94,0.15)]'
              }`}>
              {success ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {success || error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widescreen Tactical Dashboard Console */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch relative z-10">

        {/* LEFT CHAMBER: IDENTITY CONSOLE */}
        <div className="xl:col-span-7 flex flex-col">
          <div className="glass-dark border border-white/[0.08] rounded-[3rem] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between h-full shadow-[0_30px_100px_rgba(0,0,0,0.45)] hover:border-white/15 transition-all duration-300">
            {/* Glowing Accent */}
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-brand-500/5 blur-[120px] -mr-48 -mt-48 pointer-events-none" />
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-brand-500 via-brand-400 to-transparent" />

            <div className="space-y-10 relative z-10">
              {/* Section Title */}
              <div className="flex items-center justify-between pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center text-brand-400 shadow-[0_0_20px_rgba(14,165,233,0.15)]">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight leading-none">Identity Node</h2>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1.5 block">Visual & Profile Signature</span>
                  </div>
                </div>
                <div className="text-[9px] font-black text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                  Primary
                </div>
              </div>

              {/* Elite Avatar System */}
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="relative shrink-0 flex flex-col items-center">
                  <div className="relative w-40 h-40">
                    {/* Animated Frame */}
                    <div className="absolute inset-[-10px] border border-white/10 rounded-[3rem] border-dashed animate-[spin_25s_linear_infinite]" />
                    <div className="absolute inset-[-4px] border border-brand-500/25 rounded-[2.8rem]" />

                    <div
                      onClick={() => setIsAvatarSelectorOpen(!isAvatarSelectorOpen)}
                      className="w-full h-full rounded-[2.5rem] bg-gradient-to-br from-brand-500 to-accent-600 p-0.5 shadow-2xl cursor-pointer group/avatar overflow-hidden transition-all hover:scale-[1.03] active:scale-95 duration-300"
                    >
                      <div className="w-full h-full bg-[#020617] rounded-[2.4rem] flex items-center justify-center overflow-hidden relative">
                        {formData.avatar_url ? (
                          <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-16 h-16 text-brand-500 opacity-55" />
                        )}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                          <Hexagon className="w-6 h-6 text-brand-400 animate-pulse" />
                          <span className="text-[8px] font-black text-white uppercase tracking-[0.25em]">Access Grid</span>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-400 shadow-[0_0_20px_#22d3ee] -translate-y-full group-hover/avatar:animate-[scan_2s_ease-in-out_infinite]" />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-6 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-white text-[9px] font-black uppercase tracking-widest hover:bg-brand-500 hover:border-brand-400 hover:text-black hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all flex items-center gap-2 duration-300"
                  >
                    <Upload className="w-3 h-3" /> Direct Inject
                  </button>

                  {/* Floating Avatar Options Popover */}
                  <AnimatePresence>
                    {isAvatarSelectorOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full mb-6 z-[100] w-72 p-6 bg-slate-950/95 border border-brand-500/30 rounded-3xl shadow-[0_15px_50px_rgba(0,245,255,0.2)] backdrop-blur-2xl"
                      >
                        {/* Triangle indicator pointing down to the avatar */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-brand-500/30" />
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[9px] border-t-slate-950" />

                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                          <h4 className="text-[9px] font-black text-white uppercase tracking-[0.25em]">Generated Matrices</h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsAvatarSelectorOpen(false);
                            }}
                            className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest"
                          >
                            Close
                          </button>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                          {[
                            'Felix', 'Aneka', 'Buster', 'Midnight', 'Zoe', 'Leo', 'Nova', 'Shadow'
                          ].map((seed) => (
                            <button
                              key={seed}
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData({ ...formData, avatar_url: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}` });
                                setIsAvatarSelectorOpen(false);
                              }}
                              className={`aspect-square rounded-[1rem] overflow-hidden border-2 transition-all hover:scale-110 shadow-md p-1 bg-black/40
                                  ${formData.avatar_url.includes(seed) ? 'border-brand-500 bg-brand-500/25 shadow-[0_0_15px_rgba(34,211,238,0.25)]' : 'border-white/5 hover:border-white/20'}`}
                            >
                              <img src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}`} alt={seed} className="w-full h-full" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1 space-y-6 w-full">
                  <div className="space-y-3 group/input relative p-5 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.02] focus-within:bg-white/[0.02] focus-within:border-brand-500/25 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Visual Signature</span>
                      <Activity className="w-3.5 h-3.5 text-slate-600 group-focus-within/input:text-brand-400 group-focus-within/input:animate-pulse transition-all" />
                    </div>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Identify Protocol Name"
                      className="w-full bg-transparent py-1.5 text-xl font-black text-white focus:outline-none transition-all placeholder:text-slate-700"
                    />
                    <div className="h-[2px] w-full bg-white/5 relative overflow-hidden rounded-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-400 scale-x-0 group-focus-within/input:scale-x-100 origin-left transition-transform duration-500" />
                    </div>
                  </div>

                  <div className="space-y-3 group/input relative p-5 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.02] focus-within:bg-white/[0.02] focus-within:border-accent-500/25 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Strategic Target</span>
                      <Target className="w-3.5 h-3.5 text-slate-600 group-focus-within/input:text-accent-400 group-focus-within/input:scale-110 transition-all" />
                    </div>
                    <input
                      type="text"
                      value={formData.career_goal}
                      onChange={(e) => setFormData({ ...formData, career_goal: e.target.value })}
                      placeholder="Ultimate Professional Zenith"
                      className="w-full bg-transparent py-1.5 text-lg font-black text-accent-400 focus:outline-none transition-all placeholder:text-slate-700"
                    />
                    <div className="h-[2px] w-full bg-white/5 relative overflow-hidden rounded-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-accent-400 scale-x-0 group-focus-within/input:scale-x-100 origin-left transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Biography box integrated directly underneath */}
              <div className="space-y-4 pt-4 border-t border-white/5 group/bio">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-slate-500 group-focus-within/bio:text-brand-400 transition-colors" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] group-focus-within/bio:text-brand-400 transition-colors">Neural Biography</span>
                </div>
                <textarea
                  rows="5"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Articulate your narrative pulse. Detail your journey, your expertise, and your vision for the future architecture of technology."
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-slate-300 text-sm font-medium focus:outline-none focus:border-brand-500/35 focus:shadow-[0_0_30px_rgba(14,165,233,0.04)] transition-all resize-none shadow-inner leading-relaxed placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CHAMBER: SECURITY MATRIX CONSOLE */}
        <div className="xl:col-span-5 flex flex-col gap-8 h-full justify-between">

          {/* MFA Panel */}
          <div className="glass-dark border border-white/[0.08] rounded-[3rem] p-8 md:p-10 relative overflow-hidden group shadow-[0_30px_100px_rgba(0,0,0,0.45)] hover:border-white/15 transition-all duration-300 flex-1 flex flex-col justify-between min-h-[300px]">
            <div className={`absolute top-0 right-0 w-[400px] h-[400px] blur-[120px] -mr-48 -mt-48 transition-all duration-1000 pointer-events-none ${formData.mfa_enabled ? 'bg-emerald-500/10' : 'bg-rose-500/5'}`} />
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-emerald-500 via-emerald-400 to-transparent" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-700 ${formData.mfa_enabled ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-rose-500/5 border-rose-500/20'}`}>
                    <Shield className={`w-6 h-6 transition-colors duration-500 ${formData.mfa_enabled ? 'text-emerald-400' : 'text-rose-500/55'}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white leading-none tracking-tight">Identity Shield</h3>
                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1 block">Multi-Factor Biometrics</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-black/60 p-1.5 rounded-[1.5rem] border border-white/5 shadow-inner scale-90">
                  <span className={`pl-3 text-[8px] font-black uppercase tracking-[0.15em] transition-colors duration-300 ${formData.mfa_enabled ? 'text-emerald-500' : 'text-slate-600'}`}>
                    {formData.mfa_enabled ? 'Active' : 'Offline'}
                  </span>
                  <button
                    type="button"
                    onClick={handleMfaToggle}
                    className={`w-12 h-6 rounded-full transition-all relative p-0.5 cursor-pointer ${formData.mfa_enabled ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-slate-800'}`}
                  >
                    <motion.div
                      animate={{ x: formData.mfa_enabled ? 24 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-5 h-5 rounded-full bg-white shadow-md"
                    />
                  </button>
                </div>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed font-medium">Activate high-intensity verification layers. Requires a secondary device to authenticate your neural signature upon matrix entry.</p>
            </div>

            <div className={`mt-8 flex items-center gap-4 p-5 border rounded-2xl relative z-10 transition-colors duration-500 ${formData.mfa_enabled ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/10'}`}>
              <div className="relative flex items-center justify-center shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full ${formData.mfa_enabled ? 'bg-emerald-500' : 'bg-rose-500'} z-10 relative`} />
                <div className={`absolute inset-[-4px] rounded-full border border-current opacity-20 animate-ping`} style={{ color: formData.mfa_enabled ? '#10b981' : '#f43f5e' }} />
              </div>
              <div>
                <span className={`block text-[10px] font-black uppercase tracking-widest ${formData.mfa_enabled ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formData.mfa_enabled ? 'Maximum Security Achieved' : 'Vulnerable State Detected'}
                </span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 block">Level 2 Encryption</span>
              </div>
              <UserCheck className={`ml-auto w-5 h-5 ${formData.mfa_enabled ? 'text-emerald-500/40' : 'text-rose-500/20'}`} />
            </div>
          </div>

          {/* Password Keys Panel */}
          <div className="glass-dark border border-white/[0.08] rounded-[3rem] p-8 md:p-10 relative overflow-hidden group shadow-[0_30px_100px_rgba(0,0,0,0.45)] hover:border-white/15 transition-all duration-300 flex-1 flex flex-col justify-between min-h-[250px]">
            <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-brand-500/5 blur-[100px] -ml-36 -mt-36 pointer-events-none" />
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-brand-500 via-brand-400 to-transparent" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-brand-500/10 rounded-2xl flex items-center justify-center border border-brand-500/20 shadow-[0_0_15px_rgba(34,211,238,0.15)] group-hover:scale-105 duration-300 transition-transform">
                  <Key className="w-6 h-6 text-brand-400" />
                </div>
                <Fingerprint className="w-8 h-8 text-slate-800 group-hover:text-brand-500/20 duration-300 transition-colors" />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Neural Key</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">Update your master encryption pulse. Regular key rotation is recommended for optimal system integrity.</p>
            </div>

            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full mt-8 py-5 bg-white/[0.01] border border-white/10 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.25em] hover:bg-brand-500 hover:border-brand-400 hover:text-black hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] transition-all duration-500 flex items-center justify-center gap-3 group/btn relative z-10"
            >
              Initialize Key Rotation <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1.5 transition-transform" />
            </button>
          </div>

        </div>

      </div>

      {/* MFA Enrollment Modal */}
      <AnimatePresence>
        {isMfaEnrolling && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMfaEnrolling(false)} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md glass-dark border border-emerald-500/30 rounded-[3rem] p-12 overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)]"
            >
              <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                  <QrCode className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-4xl font-black text-white tracking-tighter">Establish Shield.</h3>
                  <p className="text-slate-400 text-xs font-medium">Scan the frequency with your authenticator app.</p>
                </div>

                <div className="bg-white p-4 rounded-[2rem] border-4 border-white/10 shadow-2xl">
                  <img src={mfaData?.qrCodeDataUrl} alt="MFA QR" className="w-48 h-48 rounded-xl" />
                </div>

                <div className="w-full space-y-4 pt-4">
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    placeholder="000000"
                    className={`w-full bg-black/50 border py-5 px-8 rounded-2xl text-white font-black tracking-[0.7em] text-center text-2xl focus:outline-none transition-all duration-300
                             ${mfaError ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.25)]' : 'border-white/10 focus:border-emerald-500 focus:shadow-[0_0_25px_rgba(16,185,129,0.15)]'}`}
                  />
                  <div className="flex gap-4">
                    <button onClick={() => setIsMfaEnrolling(false)} className="flex-1 py-5 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all duration-300">Cancel</button>
                    <button onClick={handleMfaVerify} className="flex-[2] py-5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] duration-300">Finalize Sync</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPasswordModalOpen(false)} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm glass-dark border border-brand-500/30 rounded-[3rem] p-12 overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.15)]"
            >
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-500/10 blur-[80px] -mr-32 -mt-32 pointer-events-none" />

              <div className="relative z-10 space-y-8">
                <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center border border-brand-500/20 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                  <Key className="w-8 h-8 text-brand-400 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white tracking-tighter">Recode Matrix.</h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Neural Access Encryptor</p>
                </div>
                <div className="space-y-4 pt-4">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Inject New Key"
                    className="w-full bg-black/50 border border-white/10 py-5 px-6 rounded-2xl text-white font-black tracking-widest focus:outline-none focus:border-brand-500 focus:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all duration-300 placeholder:text-slate-700"
                  />
                  <button
                    onClick={handleUpdatePassword}
                    className="w-full py-5 bg-brand-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(34,211,238,0.25)] duration-300 mt-2"
                  >
                    Execute Override
                  </button>
                  <button
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="w-full py-4 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors duration-300"
                  >
                    Cancel Sequence
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default Settings;
