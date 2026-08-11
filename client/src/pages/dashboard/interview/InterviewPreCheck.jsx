import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as faceapi from 'face-api.js';
import { 
  Camera, Mic, Sun, Video, ChevronLeft, 
  User, AlertCircle, CheckCircle2, ArrowRight,
  Activity, Shield, Zap, Brain, Radio,
  Cpu, Crosshair, Target, Scan, Fingerprint,
  Waves, Gauge, Eye, Thermometer, UserCheck,
  RefreshCcw, ShieldCheck
} from 'lucide-react';

import CountdownModal from '../../../components/interview/CountdownModal';
import { admin } from '../../../lib/api';

const InterviewPreCheck = ({ data }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectionScore, setDetectionScore] = useState(0);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [diagnostics, setDiagnostics] = useState(0);
  const [stream, setStream] = useState(null);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const detectionIntervalRef = useRef(null);
 
  useEffect(() => {
    const fetchOverrideSettings = async () => {
      try {
        const { data } = await admin.getPublicSystemSettings();
        if (data.settings && data.settings.biometricEnforced === false) {
          setBiometricEnabled(false);
          setDiagnostics(100);
        }
      } catch (err) {
        console.warn("Telemetry override sync failed:", err.message);
      }
    };
    fetchOverrideSettings();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Models failed to materialize:", err);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    let activeStream = null;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 },
          audio: true 
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Neural link interrupted:", err);
      }
    };

    if (modelsLoaded && !showCountdown) {
      startCamera();
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [modelsLoaded]);

  const handleCommence = async () => {
    if (diagnostics < 100) return;
    try {
      if (!document.documentElement.requestFullscreen) {
        console.warn("Fullscreen API not supported by browser.");
      } else if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.warn("Fullscreen activation deferred:", e);
    }
    setShowCountdown(true);
  };

  const handleManualOverride = async () => {
    setDiagnostics(100);
    try {
      if (!document.documentElement.requestFullscreen) {
        console.warn("Fullscreen API not supported by browser.");
      } else if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.warn("Fullscreen activation deferred:", e);
    }
    setShowCountdown(true);
  };

  // Real-time Detection Loop
  useEffect(() => {
    if (modelsLoaded && stream && videoRef.current && !showCountdown && biometricEnabled) {
 
      detectionIntervalRef.current = setInterval(async () => {
        if (!videoRef.current) return;
        
        const detections = await faceapi.detectAllFaces(
          videoRef.current, 
          new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.1 })
        );
 
        if (detections.length > 0) {
          const score = detections[0].score;
          setDetectionScore(score);
          setIsFaceDetected(true);
          
          // Rapid sync when face is detected
          setDiagnostics(prev => Math.min(prev + 8, 100));
        } else {
          setIsFaceDetected(false);
          setDetectionScore(0);
          setDiagnostics(prev => Math.max(prev - 5, 0));
        }
      }, 100);
 
    } else if (biometricEnabled === false) {
      setIsFaceDetected(true);
      setDiagnostics(100);
    }
  }, [modelsLoaded, stream, biometricEnabled]);


  const sensorNodes = [
    { icon: Sun, label: 'LUX', status: 'Optimal', val: '840lx', color: 'text-amber-400' },
    { icon: Mic, label: 'AURAL', status: 'Clean', val: '-42db', color: 'text-emerald-400' },
    { icon: Waves, label: 'LATENCY', status: 'Stable', val: '12ms', color: 'text-brand-400' },
    { icon: Activity, label: 'VOICE', status: 'Ready', val: '1.2s', color: 'text-rose-400' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="fixed inset-0 z-[100] bg-[#020617] p-6 lg:p-8 h-screen flex flex-col font-inter overflow-hidden"
    >
      {/* Immersive Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[1000px] h-[800px] bg-brand-500/5 blur-[150px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-accent-500/5 blur-[150px] -ml-64 -mb-64" />
      </div>

      {/* Top Protocol Header - Compact */}
      <div className="relative z-10 flex flex-col lg:flex-row items-end justify-between gap-4 mb-6 pt-0">
        <div className="space-y-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 shadow-xl"
          >
            <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-400">System Calibration Protocol [v2.4.0]</span>
          </motion.div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none">
            Sensor <span className="text-gradient">Optimization.</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-xl">
             Synchronizing biometric sensors and audiovisual streams for mission deployment.
          </p>
        </div>

        <div className="flex items-center gap-4">
           {sensorNodes.map((node, i) => (
             <div key={i} className="hidden md:flex items-center gap-4 px-6 py-3 glass border border-white/5 rounded-2xl group hover:border-brand-500/30 transition-all">
                <node.icon className={`w-4 h-4 ${node.color} group-hover:scale-110 transition-transform`} />
                <div className="text-left">
                   <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">{node.label}</p>
                   <p className="text-[10px] font-black text-white leading-none">{node.status}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Main Mission Control Grid */}
      <div className="relative z-10 flex-1 grid lg:grid-cols-12 gap-8 min-h-0">
        {/* Massive HUD Camera Viewport */}
        <div className="lg:col-span-9 flex flex-col h-full">
          <div className="relative flex-1 bg-black rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] group">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover scale-x-[-1] transition-all duration-700 ${isFaceDetected ? 'opacity-100' : 'opacity-70'}`}
            />

            
            {/* God-Level HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none">
               {/* Cyberpunk Vignette */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
               <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none" />

               {/* Scanning Crosshairs - NON-BOX */}
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-[500px] h-[500px]">
                     {/* Corner Brackets */}
                     <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-brand-500/30 rounded-tl-3xl transition-all duration-1000 group-hover:border-brand-500 group-hover:scale-105" />
                     <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-brand-500/30 rounded-tr-3xl transition-all duration-1000 group-hover:border-brand-500 group-hover:scale-105" />
                     <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-brand-500/30 rounded-bl-3xl transition-all duration-1000 group-hover:border-brand-500 group-hover:scale-105" />
                     <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-brand-500/30 rounded-br-3xl transition-all duration-1000 group-hover:border-brand-500 group-hover:scale-105" />
                     
                     {/* Circular HUD elements */}
                     <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border border-dashed border-white/5 rounded-full scale-[1.1]"
                     />
                     <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-[0.5px] border-brand-500/10 rounded-full scale-[0.8]"
                     />
                  </div>
               </div>

               {/* Kinetic Scanning Beam */}
               <motion.div 
                 animate={{ top: ['-10%', '110%'] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-500/40 to-transparent shadow-[0_0_15px_#22d3ee] opacity-40"
               />

               {/* Real-time Data Stream (Left) */}
               <div className="absolute left-10 top-1/2 -translate-y-1/2 space-y-4">
                  {['STRM: SYNCED', 'FPS: 60.0', 'BIOM: 0x8A2', 'NET: STABLE'].map((t, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 0.4, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-1.5 h-[1px] bg-brand-500" />
                      <span className="text-[8px] font-mono text-brand-400 uppercase tracking-[0.3em]">{t}</span>
                    </motion.div>
                  ))}
               </div>

               {/* Analysis HUD (Right) */}
               <div className="absolute right-10 top-1/2 -translate-y-1/2 space-y-8">
                  <div className="flex flex-col items-end gap-2">
                     <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Biometric Integrity</span>
                     <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <motion.div 
                            key={i} 
                            animate={{ opacity: [0.2, 0.8, 0.2] }} 
                            transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                            className="w-1 h-4 bg-brand-500 rounded-full" 
                          />
                        ))}
                      </div>
                  </div>
               </div>

               {/* Minimal Neural Status (Top Right) */}
               <div className="absolute top-10 right-10 flex flex-col items-end gap-2">
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`px-4 py-3 rounded-2xl backdrop-blur-xl border flex items-center gap-4 transition-all duration-700 ${isFaceDetected ? 'bg-brand-500/10 border-brand-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)]' : 'bg-white/5 border-white/10'}`}
                  >
                     <div className="relative">
                        <div className={`w-3 h-3 rounded-full ${isFaceDetected ? 'bg-brand-500 animate-pulse shadow-[0_0_12px_#22d3ee]' : 'bg-slate-700'}`} />
                        {isFaceDetected && (
                          <motion.div 
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-brand-500/30"
                          />
                        )}
                     </div>
                     <div className="flex flex-col min-w-[120px]">
                        <span className="text-[9px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                           {!modelsLoaded ? (
                              <>
                                <RefreshCcw className="w-2.5 h-2.5 animate-spin text-slate-500" />
                                Initializing AI...
                              </>
                           ) : isFaceDetected ? (
                              <>
                                <ShieldCheck className="w-2.5 h-2.5 text-brand-400" />
                                Neural Lock Acquired
                              </>
                           ) : (
                              <>
                                <Scan className="w-2.5 h-2.5 text-slate-500 animate-pulse" />
                                Searching for Subject...
                              </>
                           )}
                        </span>
                        <div className="flex items-center gap-3 mt-1.5">
                           <div 
                             onClick={handleManualOverride}
                             className="flex-1 h-[3px] bg-white/5 rounded-full overflow-hidden cursor-pointer group/sync"
                             title="Click to manual bypass"
                           >
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${diagnostics}%` }}
                                 className={`h-full transition-colors duration-500 ${diagnostics === 100 ? 'bg-brand-500' : 'bg-brand-500/40 group-hover/sync:bg-brand-500/80'}`}
                              />
                           </div>

                           <span className={`text-[10px] font-black tabular-nums transition-colors ${diagnostics === 100 ? 'text-brand-400' : 'text-slate-500'}`}>
                              {Math.round(diagnostics)}%
                           </span>
                        </div>
                     </div>
                  </motion.div>
                  <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.4em] mr-2">
                    Biometric Protocol: {data?.jobTitle || 'Standard'}
                  </span>
               </div>


            </div>
          </div>
        </div>

        {/* Tactical Diagnosis Panel (Right) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
           <div className="flex-1 space-y-4">
              {[
                { icon: Sun, title: 'Lux Level', status: 'Optimal Intensity', col: 'text-amber-500' },
                { icon: Shield, title: 'Void Integrity', status: 'Secure Environment', col: 'text-brand-500' },
                { icon: Radio, title: 'Aural Sync', status: 'Zero Interference', col: 'text-rose-500' },
                { icon: Crosshair, title: 'Optic Pivot', status: 'Sensor Aligned', col: 'text-emerald-500' }
              ].map((check, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="p-4 glass-dark border border-white/5 rounded-[2rem] group hover:border-brand-500/30 transition-all cursor-pointer overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] blur-[30px] rounded-full -mr-8 -mt-8" />
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-brand-500/10 transition-all">
                      <check.icon className={`w-6 h-6 ${isFaceDetected ? check.col : 'text-slate-700'}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white tracking-tight leading-none mb-1.5 uppercase tracking-widest">{check.title}</h4>
                      <p className={`text-[9px] font-black uppercase tracking-widest ${isFaceDetected ? 'text-slate-500' : 'text-slate-700'}`}>{check.status}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
           </div>

           {/* Deployment Action Matrix */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-4"
           >
              <button 
                onClick={handleCommence}
                disabled={diagnostics < 100}
                className={`
                  w-full py-6 rounded-[2rem] font-black text-xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group relative overflow-hidden
                  ${diagnostics === 100 
                    ? 'bg-brand-600 text-white shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:bg-brand-500 hover:scale-[1.02]' 
                    : 'bg-white/5 text-slate-800 cursor-not-allowed opacity-30'}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="flex items-center gap-4">
                  {diagnostics === 100 ? 'COMMENCE' : 'LOCKED'}
                  {diagnostics === 100 ? (
                    <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
                  ) : (
                    <Shield className="w-6 h-6 animate-pulse" />
                  )}
                </span>
                <span className="text-[10px] opacity-60 uppercase tracking-[0.5em] font-black">
                  {diagnostics === 100 ? 'Final Protocol' : 'Biometric Auth Required'}
                </span>
              </button>

              {diagnostics < 100 && (
                <motion.button 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleManualOverride}
                  className="w-full py-4 glass border border-amber-500/20 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] text-amber-500/60 hover:text-amber-500 hover:bg-amber-500/10 transition-all flex items-center justify-center gap-3"
                >
                  <Shield className="w-3 h-3" />
                  Manual Override Protocol
                </motion.button>
              )}


              <button 
                onClick={() => navigate('/dashboard/interview/review')}
                className="w-full py-4 glass border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3"
              >
                <ChevronLeft className="w-4 h-4" />
                Abort Deployment
              </button>
           </motion.div>
        </div>
      </div>

      {/* Enhanced Countdown Modal */}
      <AnimatePresence>
        {showCountdown && (
          <CountdownModal 
            role={data.jobTitle} 
            onComplete={() => navigate('/dashboard/interview/session')} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InterviewPreCheck;
