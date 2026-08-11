import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as faceapi from 'face-api.js';
import { 
  Mic, MicOff, Video, VideoOff, Send, 
  Settings, MessageSquare, Activity, 
  Clock, Shield, Zap, Sparkles, Brain,
  ChevronRight, ArrowRight, User, Bot,
  Volume2, VolumeX, AlertCircle, Terminal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { interview } from '../../../lib/api';

const InterviewSession = ({ data }) => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const maxTimePerQuestion = Math.floor((data.duration * 60) / data.questionCount);
  const [timeLeft, setTimeLeft] = useState(data.duration * 60);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(maxTimePerQuestion);
  const initialOpeningQuestion = data?.interviewPlan?.openingQuestion || 
    `Welcome! To start off, could you tell me a bit about yourself, your professional background, and what draws you to this ${data?.jobTitle || 'position'} role?`;
  const [currentQuestion, setCurrentQuestion] = useState(initialOpeningQuestion);
  const [transcript, setTranscript] = useState("");
  const [history, setHistory] = useState([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [sentiment, setSentiment] = useState({ confidence: 85, stress: 12, clarity: 90 });
  const [interimTranscript, setInterimTranscript] = useState("");
  const [stream, setStream] = useState(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const videoRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  // Initialize Camera Feed
  // Cancel speech on unmount (e.g. user navigates away mid-session)
  useEffect(() => {
    return () => { synthRef.current.cancel(); };
  }, []);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setStream(mediaStream);
      } catch (err) {
        console.error("Camera access denied or unavailable", err);
      }
    };
    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Load Biometric Models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Biometric model loading failed:", err);
      }
    };
    loadModels();
  }, []);

  // Attach stream to video element when ready
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let final = "";
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setTranscript(prev => prev + final);
        setInterimTranscript(interim);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };
    }
  }, []);

  const speak = useCallback((text) => {
    if (!synthRef.current) return;
    
    // Stop any current speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => {
      setIsAiSpeaking(false);
      startRecording();
    };
    
    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error:", e);
      setIsAiSpeaking(false);
    };
    
    // Select a premium voice if available
    const setVoice = () => {
      const voices = synthRef.current.getVoices();
      const premiumVoice = voices.find(v => 
        (v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Natural')) && 
        v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
      
      if (premiumVoice) utterance.voice = premiumVoice;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      synthRef.current.speak(utterance);
    };

    if (synthRef.current.getVoices().length === 0) {
      synthRef.current.onvoiceschanged = setVoice;
    } else {
      setVoice();
    }
  }, []);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) { console.error(e); }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const finishInterview = async () => {
    // Protocol Termination: Force stop all media sensors
    synthRef.current.cancel();
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log(`[TERMINATE] Sensor track offline: ${track.kind}`);
      });
      setStream(null);
    }
    stopRecording();
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    setIsThinking(true);
    try {
      const user = JSON.parse(localStorage.getItem('genesis_user'));
      if (!user) {
        navigate('/dashboard');
        return;
      }

      const performanceScore = Math.round(75 + (history.length / data.questionCount) * 15 + (sentiment.confidence / 10));

      const sessionResult = {
        job_title: data.jobTitle,
        difficulty: data.difficulty,
        duration: Math.round((data.duration * 60 - timeLeft) / 60),
        score: performanceScore,
        accuracy: sentiment.clarity,
        history: history
      };

      try {
        const saveRes = await interview.saveSession(sessionResult);
        if (saveRes.data && saveRes.data.score !== undefined) {
          sessionResult.score = saveRes.data.score;
          sessionResult.accuracy = saveRes.data.accuracy;
        }
      } catch (saveErr) {
        console.error("Failed to fetch exact AI score on save:", saveErr);
      }

      // Cache for immediate analytics display
      localStorage.setItem('current_interview_session', JSON.stringify(sessionResult));
      localStorage.removeItem('genesis_interview_data');
      
      navigate('/dashboard/analytics');
    } catch (err) {
      console.error("Neural Commit Error:", err);
      navigate('/dashboard/analytics'); 
    } finally {
      setIsThinking(false);
    }
  };

  // Start the interview
  useEffect(() => {
    if (!data.jobTitle) {
      console.warn("Missing job title, redirecting to Phase 01");
      navigate('/dashboard/interview');
      return;
    }

    const timer = setTimeout(() => {
      speak(initialOpeningQuestion);
    }, 1000);
    return () => clearTimeout(timer);
  }, [data.jobTitle]);

  const fetchNextQuestion = async (userAnswer = "") => {
    if (history.length >= data.questionCount) {
       await finishInterview();
       return;
    }
    
    setIsThinking(true);
    stopRecording();
    setQuestionTimeLeft(maxTimePerQuestion);
    
    // Immediate state reset for next node
    const updatedHistory = userAnswer 
      ? [...history, { question: currentQuestion, answer: userAnswer }]
      : history;
    
    if (userAnswer) {
      setHistory(updatedHistory);
    }

    setTranscript("");
    setInterimTranscript("");
    
    try {
      // Pass the interview plan so the agent can use its strategy
      const response = await interview.chat({
        history: updatedHistory,
        currentAnswer: userAnswer,
        context: data,
        interviewPlan: data.interviewPlan || null
      });

      const nextQ = response.data.question;
      setIsFallbackMode(response.data.isFallback || false);
      
      setCurrentQuestion(nextQ);
      speak(nextQ);
    } catch (error) {
      console.error("Neural Bridge Error:", error);
      setIsFallbackMode(true);
      const errorMsg = "Neural Link Unstable: Initializing local interrogator protocols...";
      setCurrentQuestion(errorMsg);
      speak(errorMsg);
    } finally {
      setIsThinking(false);
    }
  };

  // Real-time Facial Expression Analysis (Stress & Confidence)
  useEffect(() => {
    if (modelsLoaded && stream && videoRef.current) {
      detectionIntervalRef.current = setInterval(async () => {
        if (!videoRef.current) return;
        
        try {
          const detections = await faceapi.detectAllFaces(
            videoRef.current, 
            new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.1 })
          ).withFaceExpressions();

          if (detections.length > 0) {
            const expressions = detections[0].expressions;
            
            // Map expressions to HUD metrics
            // High confidence = happy or neutral
            const rawConfidence = (expressions.happy * 100) + (expressions.neutral * 50);
            
            // High stress = angry, fearful, sad, disgusted
            const rawStress = (expressions.fearful * 100) + (expressions.sad * 80) + (expressions.angry * 90) + (expressions.disgusted * 70);
            
            setSentiment(prev => {
              // Smooth interpolation to prevent jitter
              const newConf = prev.confidence + (rawConfidence - prev.confidence) * 0.1;
              const newStress = prev.stress + (rawStress - prev.stress) * 0.1;
              
              // Ensure minimums so it doesn't look dead, and add slight dynamic flux
              return {
                confidence: Math.min(100, Math.max(30, newConf + (Math.random() * 2 - 1))),
                stress: Math.min(100, Math.max(5, newStress + (Math.random() * 2 - 1))),
                clarity: Math.min(100, Math.max(0, prev.clarity + (Math.random() * 1 - 0.5)))
              };
            });
          }
        } catch (e) {
          // Silent catch for intermittent detection failures
        }
      }, 500); // 2Hz refresh rate for expressions
    }

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [modelsLoaded, stream]);

  // Global & Question Timer Logic (Paused while AI is thinking or speaking)
  useEffect(() => {
    if (timeLeft <= 0 || isThinking || isAiSpeaking) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
      setQuestionTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, isThinking, isAiSpeaking]);

  // Auto-Submit Protocol trigger
  useEffect(() => {
    if (questionTimeLeft === 0 && !isThinking) {
      console.log("[AUTO-SUBMIT] Time expired for current question.");
      fetchNextQuestion(transcript);
    }
  }, [questionTimeLeft, isThinking]);


  const getWpm = () => {
    const wordsStr = (transcript + " " + interimTranscript).trim();
    if (!wordsStr) return 0;
    const words = wordsStr.split(/\s+/).filter(Boolean).length;
    const elapsed = maxTimePerQuestion - questionTimeLeft;
    if (elapsed <= 0) return 0;
    return Math.min(250, Math.round((words / elapsed) * 60));
  };
  const wpm = getWpm();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="fixed inset-0 z-[100] bg-[#010409] flex flex-col font-inter overflow-hidden"
    >
      {/* Tactical HUD Header */}
      <header className="h-24 border-b border-white/5 bg-black/40 backdrop-blur-3xl flex items-center justify-between px-12 relative z-10">
        <div className="flex items-center gap-8">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-brand-400 uppercase tracking-[0.4em] mb-1">
                {data.interviewPlan ? `${data.interviewPlan.seniorityLevel} Level Agent Interview` : 'Mission Active'}
              </span>
              <h2 className="text-xl font-black text-white tracking-tighter">{data.jobTitle} <span className="text-slate-600 mx-2">/</span> <span className="text-brand-500">{data.difficulty}</span></h2>
           </div>
           {data.interviewPlan && (
             <div className="hidden lg:flex items-center gap-2">
               {(data.interviewPlan.techStack || []).slice(0, 3).map((tech, i) => (
                 <span key={i} className="px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-lg text-[8px] font-black text-brand-400 uppercase tracking-widest">
                   {tech}
                 </span>
               ))}
               {(data.interviewPlan.techStack || []).length > 3 && (
                 <span className="text-[8px] font-black text-slate-600 uppercase">+{data.interviewPlan.techStack.length - 3} more</span>
               )}
             </div>
           )}
        </div>

        <div className="flex items-center gap-12">
           <div className="flex flex-col items-center group">
              <div className="flex items-center gap-2 mb-1">
                 <Clock className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                 <span className="text-2xl font-black text-white tabular-nums tracking-tighter">{formatTime(timeLeft)}</span>
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 group-hover:text-rose-400 transition-colors">Time Remaining</span>
           </div>

           <div className="h-10 w-[1px] bg-white/10" />

           <div className="flex flex-col items-end">
              <div className="flex items-center gap-3">
                 <div className="flex gap-1">
                    {[1,2,3].map(i => (
                       <div key={i} className={`w-1 h-3 rounded-full ${i <= (history.length / data.questionCount) * 3 ? 'bg-brand-500 shadow-[0_0_8px_#22d3ee]' : 'bg-white/5'}`} />
                    ))}
                 </div>
                 <span className="text-lg font-black text-white tabular-nums tracking-tighter">{history.length} <span className="text-slate-700 text-sm">/ {data.questionCount}</span></span>
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Question Node</span>
           </div>
        </div>

        <button 
          onClick={finishInterview}
          className="px-8 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-2xl"
        >
           Abort Session
        </button>
      </header>

      {/* Main Simulation Theater */}
      <main className="flex-1 flex gap-8 p-8 relative">
         {/* Left: AI Persona Presence */}
         <div className="flex-1 flex flex-col gap-6">
            <div className="flex-1 glass-dark border border-white/5 rounded-[4rem] relative overflow-hidden flex flex-col p-12">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 blur-[120px] -mr-64 -mt-64" />
               
               <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                        <Bot className="w-6 h-6 text-brand-400" />
                     </div>
                     <div>
                        <h3 className="text-white font-black uppercase tracking-widest">Genesis AI Interrogator</h3>
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${isAiSpeaking ? 'bg-brand-500 animate-ping' : 'bg-slate-700'}`} />
                           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{isAiSpeaking ? 'Neural Synthesis Active' : 'Waiting for Input'}</span>
                        </div>
                        {isFallbackMode && (
                           <motion.div 
                             initial={{ opacity: 0, scale: 0.8 }}
                             animate={{ opacity: 1, scale: 1 }}
                             className="mt-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full flex flex-col gap-1 w-fit"
                           >
                              <div className="flex items-center gap-2">
                                 <Zap className="w-2.5 h-2.5 text-amber-500" />
                                 <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest">Neural Redundancy Protocol Active</span>
                              </div>
                              <span className="text-[6px] text-amber-500/60 font-medium uppercase tracking-[0.2em]">Manual Interrogation Loop: Safe Mode</span>
                           </motion.div>
                        )}
                     </div>
                  </div>

                  <div className="flex gap-2">
                     <button 
                       onClick={() => speak(currentQuestion)}
                       className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 hover:bg-brand-500 hover:text-white transition-all shadow-lg group"
                       title="Manual Audio Pulse"
                     >
                        <Volume2 className={`w-4 h-4 transition-transform group-hover:scale-110 ${isAiSpeaking ? 'animate-pulse' : ''}`} />
                     </button>
                  </div>
               </div>

                <div className="flex-1 flex flex-col justify-center items-center text-center relative z-10 px-12">
                   <AnimatePresence mode="wait">
                      {isThinking ? (
                         <motion.div 
                           key="thinking"
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                           className="space-y-8"
                         >
                            <div className="flex justify-center gap-2">
                               {[0, 1, 2].map(i => (
                                  <motion.div 
                                     key={i} 
                                     animate={{ y: [0, -15, 0], opacity: [0.3, 1, 0.3] }}
                                     transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                     className="w-4 h-4 rounded-full bg-brand-500 shadow-[0_0_15px_#22d3ee]" 
                                  />
                               ))}
                            </div>
                            <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">Analyzing Semantic Response...</p>
                         </motion.div>
                      ) : (
                         <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                         >
                            <h1 className="text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight max-w-3xl italic">
                               "{currentQuestion}"
                            </h1>
                            
                            {currentQuestion.includes("interrupted") && (
                              <button 
                                onClick={() => fetchNextQuestion(transcript + interimTranscript)}
                                className="px-8 py-3 bg-brand-600/20 border border-brand-500/40 rounded-xl text-brand-400 text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all"
                              >
                                Retry Neural Pulse
                              </button>
                            )}

                            <div className="flex justify-center">
                               <div className="h-1 w-24 bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
                            </div>
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>

               {/* Waveform Visualization (Simulated) */}
               <div className="h-24 flex items-end justify-center gap-1 opacity-20">
                  {[...Array(40)].map((_, i) => (
                     <motion.div
                       key={i}
                       animate={{ 
                         height: (isAiSpeaking || isRecording) ? Math.max(10, Math.random() * 80) : 10,
                         opacity: (isAiSpeaking || isRecording) ? 1 : 0.3
                       }}
                       transition={{ duration: 0.1 }}
                       className={`w-1.5 rounded-t-full transition-colors ${isRecording ? 'bg-accent-500' : 'bg-brand-500'}`}
                     />
                  ))}
               </div>

               {/* Strict Timer Visualizer HUD */}
               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-8">
                 <div className="flex justify-between items-end mb-2">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                     <Clock className="w-3 h-3" /> Auto-Submit Protocol Active
                   </span>
                   <span className={`text-2xl font-black tabular-nums tracking-tight ${questionTimeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-brand-400'}`}>
                     {Math.floor(questionTimeLeft / 60)}:{(questionTimeLeft % 60).toString().padStart(2, '0')}
                   </span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                   <motion.div 
                     className={`h-full relative ${questionTimeLeft <= 10 ? 'bg-gradient-to-r from-rose-600 to-rose-400' : 'bg-gradient-to-r from-brand-600 to-brand-400'}`}
                     animate={{ width: `${(questionTimeLeft / maxTimePerQuestion) * 100}%` }}
                     transition={{ duration: 1, ease: "linear" }}
                   >
                     <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIvPjwvc3ZnPg==')] opacity-50" />
                   </motion.div>
                 </div>
               </div>

            </div>
         </div>

         {/* Right: Candidate Portal & Biometrics */}
         <div className="w-[450px] flex flex-col gap-8">
            {/* Camera Feed */}
            <div className="aspect-video bg-black/60 rounded-[3rem] border border-white/10 relative overflow-hidden shadow-2xl group">
               <div className="absolute inset-0 bg-brand-500/5 z-0" />
               <div className="absolute inset-0 flex items-center justify-center">
                  {stream ? (
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline 
                      muted 
                      className="w-full h-full object-cover rounded-[3rem]"
                    />
                  ) : (
                    <User className="w-20 h-20 text-slate-800" />
                  )}
               </div>
               
               <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">Candidate Feed: Live</span>
               </div>

               {/* Biometric HUD Overlays */}
               <div className="absolute inset-0 pointer-events-none p-6">
                  <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                     <div className="px-3 py-1 bg-brand-600/20 border border-brand-500/30 rounded-lg">
                        <span className="text-[8px] font-black text-brand-400 uppercase">Confidence: {Math.round(sentiment.confidence)}%</span>
                     </div>
                     <div className="px-3 py-1 bg-rose-600/20 border border-rose-500/30 rounded-lg">
                        <span className="text-[8px] font-black text-rose-400 uppercase">Stress: {Math.round(sentiment.stress)}%</span>
                     </div>
                  </div>
                  <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-white/20 rounded-bl-2xl" />
               </div>
            </div>

            {/* Live Transcript Portal */}
            <div className="flex-1 glass-dark border border-white/5 rounded-[3.5rem] p-10 flex flex-col relative overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <Terminal className="w-4 h-4 text-brand-400" />
                     <h4 className="text-xs font-black text-white uppercase tracking-widest">Neural Stream</h4>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${isRecording ? 'bg-brand-500/10 text-brand-400 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                     {isRecording ? 'Listening' : 'Standby'}
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                     {transcript}
                     <span className="text-brand-400/60">{interimTranscript}</span>
                     {isRecording && <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-1.5 h-4 bg-brand-400 ml-1 translate-y-1" />}
                  </p>
                  {!transcript && !interimTranscript && (
                     <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                        <Mic className="w-10 h-10 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Audio Pulse</p>
                     </div>
                  )}
               </div>

               <div className="mt-8 flex gap-4">
                  <button 
                     onClick={() => fetchNextQuestion(transcript + interimTranscript)}
                     disabled={isThinking || (!transcript && !interimTranscript)}
                     className="flex-1 py-5 bg-brand-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-brand-600/30 hover:bg-brand-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
                  >
                     Commit Response
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                     onClick={() => isRecording ? stopRecording() : startRecording()}
                     className={`p-5 rounded-2xl border transition-all ${isRecording ? 'bg-rose-500/20 border-rose-500/40 text-rose-500' : 'bg-white/5 border-white/10 text-slate-500'}`}
                  >
                     {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
               </div>
            </div>
         </div>
      </main>

      {/* Background Neural Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 blur-[150px]" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 blur-[150px]" />
      </div>
    </motion.div>
  );
};

export default InterviewSession;
