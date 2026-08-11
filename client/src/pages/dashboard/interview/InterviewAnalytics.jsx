import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Clock, Target, BarChart3, ArrowRight,
  RefreshCcw, LayoutDashboard, FileText, Download,
  CheckCircle2, Lightbulb, Video, HelpCircle,
  FileSpreadsheet, ShieldCheck, ChevronRight, Zap,
  TrendingUp, Activity, MessageSquare, Brain,
  Sparkles, Award, Cpu, Star, Bot, UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { interview } from '../../../lib/api';
import { jsPDF } from 'jspdf';

const InterviewAnalytics = () => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const downloadTranscriptPDF = () => {
    if (!sessionData) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Top Branded Header
    doc.setFillColor(3, 7, 18); // #030712 Dark HUD theme
    doc.rect(0, 0, pageWidth, 45, "F");
    
    // Grid Accents
    doc.setDrawColor(34, 211, 238); // Cyan Accent border
    doc.setLineWidth(0.8);
    doc.line(15, 37, pageWidth - 15, 37);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(34, 211, 238); // Cyan
    doc.text("PREPGENIUS AI", 15, 16);
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255); // White
    doc.text("NEURAL INTERVIEW TRANSCRIPT REPORT", 15, 23);
    
    // Document ID & Date stacked
    const dateStr = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // Slate text
    doc.text(`VERIFICATION SIGNATURE: INTERVIEW-${Math.random().toString(36).substr(2, 9).toUpperCase()}   |   EXTRACTED ON: ${dateStr}`, 15, 30);

    const drawPageHeader = (pageNumber) => {
      if (pageNumber > 1) {
        doc.setFillColor(34, 211, 238);
        doc.rect(15, 10, pageWidth - 30, 1, 'F');
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("PREPGENIUS AI // MISSION LOG PROTOCOL", 15, 16);
        doc.text(`PAGE ${pageNumber}`, pageWidth - 15 - doc.getTextWidth(`PAGE ${pageNumber}`), 16);
      }
      doc.setDrawColor(241, 245, 249);
      doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text("CONFIDENTIAL • EXPERT TELEMETRY DATA", 15, pageHeight - 10);
      doc.text("GENERATED VIA GENESIS NEURAL ARCHIVE", pageWidth - 15 - doc.getTextWidth("GENERATED VIA GENESIS NEURAL ARCHIVE"), pageHeight - 10);
    };
    
    let pageNum = 1;
    drawPageHeader(pageNum);
    
    // Section: Executive Summary Card
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 52, pageWidth - 30, 42, "FD");
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("1. MISSION INTERVIEW SPECS", 20, 60);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Target Role Zenith: ${sessionData.job_title || 'Software Developer'}`, 20, 70);
    doc.text(`Calibration Difficulty: ${sessionData.difficulty || 'Medium'}`, 20, 76);
    doc.text(`Interview Duration: ${sessionData.duration || 0} Minutes`, 20, 82);
    doc.text(`Assessment Type: Full Interactive Interrogation Matrix`, 20, 88);

    // Section 2: Core Matrix Telemetry
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("2. CORE TELEMETRY METRICS", 15, 104);
    
    // Left Box: Global Purity Score
    doc.setFillColor(241, 245, 249);
    doc.rect(15, 110, (pageWidth - 34) / 2, 22, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("GLOBAL PURITY SCORE", 19, 117);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(14, 165, 233);
    doc.text(`${finalScore} / 100`, 19, 126);
    
    // Right Box: Neural Accuracy
    doc.setFillColor(241, 245, 249);
    doc.rect(15 + (pageWidth - 34) / 2 + 4, 110, (pageWidth - 34) / 2, 22, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("NEURAL ACCURACY", 15 + (pageWidth - 34) / 2 + 8, 117);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(`${finalAccuracy}%`, 15 + (pageWidth - 34) / 2 + 8, 126);

    let y = 142;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("3. CHRONOLOGICAL RESPONSE MANIFEST", 15, y);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, y + 3, pageWidth - 15, y + 3);
    y += 12;
    
    history.forEach((node, idx) => {
      const qText = node.question || '';
      const aText = node.answer || 'DATA STREAM INTERRUPTED: NO RESPONSE SUBMITTED';
      const score = node.sentiment?.confidence || 0;
      
      const qLines = doc.splitTextToSize(qText, pageWidth - 44);
      const aLines = doc.splitTextToSize(aText, pageWidth - 54);
      
      const qHeight = qLines.length * 4.5;
      const aHeight = aLines.length * 4.5;
      
      // Calculate total dynamic envelope block height
      const nodeHeight = qHeight + aHeight + 57;
      
      if (y + nodeHeight > pageHeight - 20) {
        doc.addPage();
        pageNum += 1;
        drawPageHeader(pageNum);
        y = 30;
      }
      
      // Outer card envelope background
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, pageWidth - 30, nodeHeight - 8, "F");
      
      // Left vertical accent bar (Cyan)
      doc.setFillColor(34, 211, 238);
      doc.rect(15, y, 2.5, nodeHeight - 8, "F");
      
      // Node Index Badge
      doc.setFillColor(15, 23, 42); // Dark Navy
      doc.rect(22, y + 6, 12, 6, "F");
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`0${idx + 1}`, 28, y + 10.5, { align: "center" });
      
      // Interrogator Title
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text("INTERROGATOR PROBE", 38, y + 10.5);
      
      // Question Text
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      let qY = y + 17;
      qLines.forEach(line => {
        doc.text(line, 22, qY);
        qY += 4.5;
      });
      
      // Answer Sub-Card Container
      let aY = qY + 2;
      doc.setFillColor(241, 245, 249);
      doc.rect(22, aY, pageWidth - 44, aHeight + 10, "F");
      
      // Inner vertical divider bar (Slate)
      doc.setFillColor(148, 163, 184);
      doc.rect(22, aY, 2.5, aHeight + 10, "F");
      
      // Candidate Response Title
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("CANDIDATE RESPONSE", 28, aY + 6);
      
      // Candidate Response Text
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      let textY = aY + 12;
      aLines.forEach(line => {
        doc.text(line, 28, textY);
        textY += 4.5;
      });
      
      // Integrity Scan Pill Badge
      let pillY = textY + 4;
      const isGood = score >= 70;
      doc.setFillColor(isGood ? 240 : 254, isGood ? 253 : 242, isGood ? 244 : 242);
      doc.rect(22, pillY, 40, 7, "F");
      
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(isGood ? 22 : 220, isGood ? 101 : 38, isGood ? 52 : 38);
      doc.text(`INTEGRITY SCAN: ${score}%`, 25, pillY + 5);
      
      y += nodeHeight;
    });
    doc.save(`PrepGenius-Interview-Transcript-${(sessionData.job_title || 'Expert').replace(/\s+/g, '-')}.pdf`);
  };

  useEffect(() => {
    const saved = localStorage.getItem('current_interview_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessionData(parsed);
        performAiAnalysis(parsed);
      } catch (err) {
        console.error("Neural data corruption detected:", err);
      }
    }
  }, []);

  const performAiAnalysis = async (session) => {
    setIsAnalyzing(true);
    try {
      const response = await interview.analyzeSession({ 
        id: session.id,
        history: session.history,
        role: session.job_title,
        difficulty: session.difficulty
      });
      setAnalysis(response.data);
    } catch (err) {
      console.error("AI Analysis Interrupted:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!sessionData) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="relative mb-10">
           <div className="w-24 h-24 rounded-[2rem] bg-brand-500/5 flex items-center justify-center border border-brand-500/10 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
             <HelpCircle className="w-12 h-12 text-brand-500/40 animate-pulse" />
           </div>
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
             className="absolute -inset-4 border border-dashed border-brand-500/10 rounded-full"
           />
        </div>
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Manifest Offline</h2>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] max-w-md leading-relaxed">
           Neural synchronization required. Initiate a mission deployment to generate tactical performance analytics.
        </p>
        <button 
          onClick={() => navigate('/dashboard/interview')}
          className="mt-10 px-10 py-5 bg-brand-500 text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(34,211,238,0.2)]"
        >
          Initialize Mission Phase 01
        </button>
      </div>
    );
  }

  // Use AI-generated metrics if available, otherwise use placeholders during analysis
  const finalScore = analysis?.totalScore || sessionData.score || sessionData.performance_score || 0;
  const finalAccuracy = analysis?.totalAccuracy || sessionData.accuracy || 0;
  const statusTitle = analysis?.statusTitle || (isAnalyzing ? "Neural Audit Active" : "Mission Complete");
  const statusSubtitle = analysis?.statusSubtitle || (isAnalyzing ? "Performing deep semantic scan of response manifest..." : "Tactical calibration complete. Reviewing mission nodes.");
  const history = sessionData.history || [];

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-brand-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
              Mission <span className="text-brand-400">Post-Mortem</span>
            </h1>
          </div>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] ml-5">
            Neural Response Analytics • Archive ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </motion.div>

        <div className="flex items-center gap-4">
          <button onClick={downloadTranscriptPDF} className="px-8 py-3.5 bg-brand-500 text-black hover:bg-brand-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:scale-105 active:scale-95 flex items-center gap-2">
            <Download className="w-3.5 h-3.5" />
            Download PDF Report
          </button>
          <button onClick={() => navigate('/dashboard')} className="px-8 py-3.5 bg-[#030712] border border-white/5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest hover:border-brand-500/30 transition-all shadow-xl">
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 glass border border-white/5 rounded-[4rem] p-12 lg:p-16 relative overflow-hidden shadow-2xl group">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/5 blur-[120px] -mr-64 -mt-64 group-hover:bg-brand-500/10 transition-colors duration-1000" />
          
          <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
            <div className="relative group">
             <div className="w-72 h-72 rounded-full flex items-center justify-center relative group">
                {/* Layer 1: Outer Rotating Ring (Decorative) */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-20px] border border-brand-500/10 rounded-full border-dashed"
                />

                {/* Layer 2: Glowing Aura */}
                <div className="absolute inset-0 bg-brand-500/5 blur-[80px] rounded-full group-hover:bg-brand-500/15 transition-all duration-1000" />

                {/* Layer 3: Glassmorphic Core Container */}
                <div className="w-full h-full rounded-full bg-[#0a0a0a] border border-white/5 flex items-center justify-center relative shadow-[inset_0_0_40px_rgba(34,211,238,0.05)] overflow-hidden">
                  
                  {/* Layer 4: Scanning Radar Beam */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 via-transparent to-transparent opacity-40 pointer-events-none"
                    style={{ transformOrigin: 'center' }}
                  />

                  {/* Layer 5: Background Grid (HUD Style) */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                       style={{ backgroundImage: 'radial-gradient(#22d3ee 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }} />

                  {/* Layer 6: Main Progress Ring */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_25px_rgba(34,211,238,0.4)]">
                    {/* Ghost Track */}
                    <circle 
                        cx="144" cy="144" r="128" 
                        fill="transparent" 
                        stroke="rgba(255,255,255,0.02)" 
                        strokeWidth="16" 
                    />
                    
                    {isAnalyzing ? (
                      <circle 
                        cx="144" cy="144" r="128" 
                        fill="transparent" 
                        stroke="rgba(34,211,238,0.2)" 
                        strokeWidth="4" 
                        className="animate-pulse"
                      />
                    ) : (
                      <motion.circle 
                          cx="144" cy="144" r="128" 
                          fill="transparent" 
                          stroke="url(#holographicGradient)" 
                          strokeWidth="18" 
                          strokeDasharray={804}
                          initial={{ strokeDashoffset: 804 }}
                          animate={{ strokeDashoffset: 804 - (finalScore / 100) * 804 }}
                          transition={{ duration: 3.5, ease: [0.34, 1.56, 0.64, 1] }}
                          strokeLinecap="round"
                      />
                    )}
                    
                    <defs>
                      <linearGradient id="holographicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="50%" stopColor="#0891b2" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Layer 7: Internal HUD Accents */}
                  <div className="absolute inset-10 border border-white/5 rounded-full pointer-events-none" />
                  <div className="absolute inset-14 border border-brand-500/5 rounded-full pointer-events-none" />

                  {/* Layer 8: Central Identity Node */}
                  <div className="text-center relative z-10">
                     <motion.div
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ duration: 1 }}
                     >
                       <span className="text-8xl font-black text-white tabular-nums tracking-tighter block drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                         {isAnalyzing ? "..." : finalScore}
                       </span>
                       <div className="flex flex-col items-center gap-1 mt-2">
                          <div className="flex items-center gap-2 text-brand-400">
                             <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-[0.4em] leading-none">Global Purity</span>
                          </div>
                          <div className="w-12 h-0.5 bg-brand-500/20 rounded-full mt-2 overflow-hidden">
                             <motion.div 
                               initial={{ x: "-100%" }}
                               animate={{ x: "100%" }}
                               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                               className="w-full h-full bg-brand-500"
                             />
                          </div>
                       </div>
                     </motion.div>
                  </div>
               </div>

               {/* Layer 9: Orbiting Data Nodes */}
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-[-40px] pointer-events-none"
               >
                  <div className="absolute top-1/2 left-0 w-2 h-2 bg-brand-500 rounded-full shadow-[0_0_15px_#22d3ee]" />
                  <div className="absolute top-0 left-1/2 w-1 h-1 bg-white/20 rounded-full" />
               </motion.div>
            </div>
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -inset-6 border border-dashed border-white/10 rounded-full" />
            </div>

            <div className="flex-1 space-y-8 min-w-0">
              <div className="max-w-full">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full mb-4">
                  <Award className="w-3 h-3 text-brand-400" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-400">
                    {isAnalyzing ? "Neural Audit Active" : "Neural Calibration Complete"}
                  </span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-4 break-words">
                  {statusTitle.split(' ')[0]} <br/>
                  <span className="text-brand-400">{statusTitle.split(' ').slice(1).join(' ')}</span>
                </h2>
                <p className="text-slate-500 font-bold text-lg leading-relaxed italic max-w-sm">
                  "{statusSubtitle}"
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 relative z-10">
            {[
              { icon: Target, label: 'Questions', value: `${history.length}/${sessionData.questionCount || 15}`, color: 'text-brand-400', bg: 'bg-brand-500/10' },
              { icon: Brain, label: 'Accuracy', value: isAnalyzing ? "..." : `${finalAccuracy}%`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { icon: Clock, label: 'Duration', value: `${sessionData.duration || 0}m`, color: 'text-purple-400', bg: 'bg-purple-500/10' },
              { icon: Cpu, label: 'Difficulty', value: sessionData.difficulty || 'Medium', color: 'text-accent-400', bg: 'bg-accent-500/10' }
            ].map((stat, i) => (
              <div key={i} className="group p-6 glass border border-white/5 rounded-3xl text-center hover:bg-white/5 transition-all">
                <div className={`w-10 h-10 mx-auto mb-4 rounded-xl ${stat.bg} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
                   <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-1">{stat.label}</span>
                <span className="text-base font-black text-white tracking-tight uppercase">{stat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="lg:col-span-4 space-y-8">
           <motion.div 
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
             className="p-10 glass border border-white/5 rounded-[3.5rem] relative overflow-hidden group shadow-2xl h-full flex flex-col"
           >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Lightbulb className="w-24 h-24 text-brand-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-8 tracking-tighter leading-tight uppercase">Tactical AI<br/>Feedback.</h3>
              
              <div className="space-y-8 flex-1">
                 {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-4">
                       <RefreshCcw className="w-8 h-8 text-brand-500 animate-spin" />
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Analyzing Neural Stream...</p>
                    </div>
                 ) : (analysis?.analysis || []).length > 0 ? (
                    analysis.analysis.map((note, i) => (
                      <div key={i} className="flex gap-5">
                         <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0 group-hover:border-brand-500/20 transition-colors">
                           <TrendingUp className="w-5 h-5 text-slate-500 group-hover:text-brand-400" />
                         </div>
                         <div>
                           <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{note.title}</h4>
                           <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"{note.desc}"</p>
                         </div>
                      </div>
                    ))
                 ) : (
                    <div className="text-center py-10">
                       <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                         {isAnalyzing ? "Processing Neural Links..." : "Awaiting Analysis Data"}
                       </p>
                    </div>
                 )}
              </div>
            </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl"
      >
        <div className="px-12 py-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
           <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                 <FileText className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-white tracking-tighter uppercase">Response Manifest.</h3>
                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mt-1">Archived Tactical Node History</p>
              </div>
           </div>
        </div>

        {/* High-End Scrollable Viewport */}
        <div className="relative">
           <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#030712] to-transparent z-20 pointer-events-none" />
           
           <div className="h-[800px] overflow-y-auto custom-scrollbar px-8 py-10 relative space-y-2">
              {history.map((item, i) => (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.05 }}
                   key={i} 
                   className="group relative flex gap-8 p-8 rounded-[2.5rem] hover:bg-white/[0.01] transition-all border border-transparent hover:border-white/5"
                 >
                    {/* Timeline Anchor Node */}
                    <div className="relative z-10 shrink-0 hidden lg:flex flex-col items-center">
                       <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center font-black text-xs text-brand-400 shadow-md">
                          0{i+1}
                       </div>
                       <div className="w-px flex-1 bg-gradient-to-b from-brand-500/30 via-white/5 to-transparent mt-4" />
                    </div>

                    {/* Dialogue Stream Grid */}
                    <div className="flex-1 space-y-6">
                       {/* Interviewer Message */}
                       <div className="space-y-2">
                          <div className="flex items-center gap-2.5">
                             <Bot className="w-3.5 h-3.5 text-brand-400" />
                             <span className="text-[9px] font-black text-brand-400 uppercase tracking-[0.3em]">Genesis AI Interrogator</span>
                          </div>
                          <div className="bg-[#0b0f19]/70 border border-white/5 rounded-2xl rounded-tl-none p-6 shadow-md max-w-4xl">
                             <p className="text-slate-100 text-sm font-semibold tracking-wide leading-relaxed">
                               {item.question}
                             </p>
                          </div>
                       </div>

                       {/* Candidate Answer Message */}
                       <div className="space-y-2 pl-6 lg:pl-10">
                          <div className="flex items-center gap-2.5">
                             <UserCheck className="w-3.5 h-3.5 text-accent-400" />
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Candidate Response</span>
                          </div>
                          <div className="bg-brand-500/[0.03] border border-brand-500/15 rounded-2xl rounded-tr-none p-6 shadow-inner max-w-3xl">
                             <p className="text-slate-300 text-xs font-semibold leading-relaxed italic">
                               "{item.answer || "DATA STREAM INTERRUPTED: NO RESPONSE SUBMITTED"}"
                             </p>
                          </div>
                          
                          {/* Integrated Telemetry Badge */}
                          <div className="pt-2 flex items-center gap-4">
                             <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl">
                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Integrity Scan</span>
                                <span className="text-xs font-black text-white tabular-nums">
                                  {item.sentiment?.confidence || 0}%
                                </span>
                                <div className={`w-1.5 h-1.5 rounded-full ${(item.sentiment?.confidence || 0) > 80 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`} />
                             </div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               ))}
           </div>

           <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#030712] to-transparent z-20 pointer-events-none" />
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
           .custom-scrollbar::-webkit-scrollbar {
             width: 4px;
           }
           .custom-scrollbar::-webkit-scrollbar-track {
             background: rgba(255, 255, 255, 0.02);
             border-radius: 10px;
           }
           .custom-scrollbar::-webkit-scrollbar-thumb {
             background: rgba(34, 211, 238, 0.1);
             border-radius: 10px;
             border: 1px solid rgba(34, 211, 238, 0.2);
           }
           .custom-scrollbar::-webkit-scrollbar-thumb:hover {
             background: rgba(34, 211, 238, 0.3);
           }
        `}} />
      </motion.div>

      {/* Global Actions Protocol */}
      <div className="flex flex-wrap justify-center gap-6 mt-12">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard/interview')}
          className="flex items-center gap-4 px-12 py-6 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-brand-500/20 transition-all"
        >
          <RefreshCcw className="w-5 h-5" /> Initialize Retake
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-4 px-12 py-6 bg-[#030712] border border-white/10 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:border-brand-500/40 transition-all"
        >
          <LayoutDashboard className="w-5 h-5" /> View Dashboard
        </motion.button>
      </div>
    </div>
  );
};

export default InterviewAnalytics;
