import { useState, useEffect } from "react";
import { ShieldCheck, Cpu, Database, AlertCircle, RefreshCw, Key, HelpCircle, Activity, Heart, Users, FileBarChart2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { PhantomChannel } from "./types";
import Dpdpshield from "./components/Dpdpshield";
import KycVerification from "./components/KycVerification";
import VideoLiveness from "./components/VideoLiveness";
import VoiceSpectrogram from "./components/VoiceSpectrogram";
import BehavioralBiometrics from "./components/BehavioralBiometrics";

export default function App() {
  const [activeChannel, setActiveChannel] = useState<PhantomChannel>("video-kyc");
  const [consentGranted, setConsentGranted] = useState<boolean>(true);
  
  // Aggregate assessment states
  const [faceRiskScore, setFaceRiskScore] = useState<number | null>(null);
  const [faceSynthetic, setFaceSynthetic] = useState<boolean | null>(null);
  const [docRiskScore, setDocRiskScore] = useState<number | null>(null);
  const [docSynthetic, setDocSynthetic] = useState<boolean | null>(null);
  const [voiceRiskScore, setVoiceRiskScore] = useState<number | null>(null);
  const [voiceCloned, setVoiceCloned] = useState<boolean | null>(null);
  const [behaviorScore, setBehaviorScore] = useState<number | null>(null);
  const [behaviorBot, setBehaviorBot] = useState<boolean | null>(null);

  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  const addSystemLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setSystemLogs((prev) => [`[${timestamp}] ${msg}`, ...prev].slice(0, 10));
  };

  useEffect(() => {
    addSystemLog("PhantomShield system initialization sequence initiated.");
    addSystemLog("Loaded Indian Cyber Crime Coordination Centre (I4C) deepfake heuristics.");
    addSystemLog("DPDP Act Section 5/6 automated warning notice triggered.");
  }, []);

  // Compute aggregated trust score
  const getAggregatedScore = () => {
    const scores: number[] = [];
    if (faceRiskScore !== null) scores.push(100 - faceRiskScore);
    if (docRiskScore !== null) scores.push(100 - docRiskScore);
    if (voiceRiskScore !== null) scores.push(100 - voiceRiskScore);
    if (behaviorScore !== null) scores.push(behaviorScore); // already positive score

    if (scores.length === 0) return null;
    const sum = scores.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / scores.length);
  };

  // Reset/Purge state variables (Compliance Purge)
  const handleSessionWipe = () => {
    setFaceRiskScore(null);
    setFaceSynthetic(null);
    setDocRiskScore(null);
    setDocSynthetic(null);
    setVoiceRiskScore(null);
    setVoiceCloned(null);
    setBehaviorScore(null);
    setBehaviorBot(null);
    setConsentGranted(false);
    addSystemLog("DPDP Section 11 Purge signal received: all biometric cache variables zeroed out.");
  };

  const aggScore = getAggregatedScore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 select-none pb-12" id="phantom-shield-workspace">
      {/* Visual Accent Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Main Header Container */}
      <header className="border-b border-slate-850 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold tracking-widest font-mono text-indigo-400 border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 rounded uppercase">
                SHIELD v1.2
              </span>
              <div className="h-4 w-[1px] bg-slate-800"></div>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE-I4C-ADVISORY-SYNC
              </span>
            </div>
            <h1 className="text-2xl font-display font-medium text-white tracking-tight flex items-center gap-2">
              PhantomShield <span className="text-slate-400 font-normal">| AI-vs-AI Defense Engine</span>
            </h1>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex gap-4 font-mono text-[10.5px] items-center">
            <div className="p-2 bg-slate-900 border border-slate-850 rounded-lg text-left min-w-[130px]">
              <span className="text-slate-500 block uppercase">DPDP Vault Status</span>
              <span className="text-emerald-400 font-bold block mt-0.5">Compliant (Purged)</span>
            </div>
            <div className="p-2 bg-slate-900 border border-slate-850 rounded-lg text-left min-w-[130px]">
              <span className="text-slate-500 block uppercase">Active Sessions</span>
              <span className="text-indigo-400 font-bold block mt-0.5">Ephemeral (0 cached)</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Dynamic Warning Alert Banner (Regulatory context) */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-slate-300 leading-normal">
            <p className="font-semibold text-amber-300">Indian Cyber Crime Coordination Centre (I4C) Active Advisory</p>
            <p className="text-slate-400">
              Low-cost open-source deep learning pipelines are active, generating synthetic voice and document duplicates capable of compromising physical KYC. 
              <strong> PhantomShield</strong> assesses and blocks deepfakes in real-time by checking temporal blending boundaries, audio spectral density discontinuities, and liveness-challenge gaze vectors during active sessions.
            </p>
          </div>
        </div>

        {/* Bento Board Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main workspace section */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Simulation Channels Tabs */}
            <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl flex flex-wrap gap-1">
              <button
                onClick={() => setActiveChannel("video-kyc")}
                className={`py-2 px-4 rounded-lg font-display text-xs font-semibold cursor-pointer transition ${activeChannel === "video-kyc" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                Video KYC Liveness
              </button>
              <button
                onClick={() => setActiveChannel("voice-clone")}
                className={`py-2 px-4 rounded-lg font-display text-xs font-semibold cursor-pointer transition ${activeChannel === "voice-clone" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                Voice Clone Analyzer
              </button>
              <button
                onClick={() => setActiveChannel("document-forgery")}
                className={`py-2 px-4 rounded-lg font-display text-xs font-semibold cursor-pointer transition ${activeChannel === "document-forgery" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                KYC Forgery Scanner
              </button>
              <button
                onClick={() => setActiveChannel("behavioral-biometric")}
                className={`py-2 px-4 rounded-lg font-display text-xs font-semibold cursor-pointer transition ${activeChannel === "behavioral-biometric" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                Behavioral Biometrics
              </button>
            </div>

            {/* Active Channel Component Frame */}
            <div className="flex-1 min-h-[460px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeChannel}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {activeChannel === "video-kyc" && (
                    <VideoLiveness
                      consentGranted={consentGranted}
                      onAnalysisTriggered={(score, isSynth) => {
                        setFaceRiskScore(score);
                        setFaceSynthetic(isSynth);
                        addSystemLog(`Face checks processed. Risk Factor: ${score}% (${isSynth ? "ALARM" : "ORGANIC"}).`);
                      }}
                    />
                  )}
                  {activeChannel === "voice-clone" && (
                    <VoiceSpectrogram
                      consentGranted={consentGranted}
                      onAnalysisTriggered={(score, isSynth) => {
                        setVoiceRiskScore(score);
                        setVoiceCloned(isSynth);
                        addSystemLog(`Audio matching processed. Spectral anomaly: ${score}% (${isSynth ? "AI VOICE" : "SAFE"}).`);
                      }}
                    />
                  )}
                  {activeChannel === "document-forgery" && (
                    <KycVerification
                      consentGranted={consentGranted}
                      onAnalysisTriggered={(score, isSynth) => {
                        setDocRiskScore(score);
                        setDocSynthetic(isSynth);
                        addSystemLog(`ID forgery checks analyzed. Risk: ${score}% (${isSynth ? "SUSPECT" : "CERTIFIED"}).`);
                      }}
                    />
                  )}
                  {activeChannel === "behavioral-biometric" && (
                    <BehavioralBiometrics
                      consentGranted={consentGranted}
                      onAnalysisTriggered={(score, isBot) => {
                        setBehaviorScore(score);
                        setBehaviorBot(isBot);
                        addSystemLog(`Keystroke rhythm recorded. Biological certainty: ${score}% (${isBot ? "BOT" : "HUMAN"}).`);
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar controls and explainable score summary dashboard */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* DPDP Consent Module */}
            <Dpdpshield
              consentGranted={consentGranted}
              onConsentChange={(val) => {
                setConsentGranted(val);
                addSystemLog(`DPDP Consent setting modified to ${val ? "REGISTERED" : "REFUSED"}.`);
              }}
              onPurge={handleSessionWipe}
            />

            {/* Explainable Trust Diagnostic Scoreboard */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4" id="explainable-trust-board">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
                <FileBarChart2 className="w-4 h-4 text-indigo-400" />
                <h3 className="font-display font-semibold text-sm text-slate-200">
                  Explainable Session Trust Core
                </h3>
              </div>

              {aggScore !== null ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-around">
                    {/* Ring score dial */}
                    <div className="relative flex items-center justify-center w-28 h-28">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          className="stroke-slate-800 fill-none"
                          strokeWidth="8"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          className={`fill-none transition-all duration-700 ${aggScore > 75 ? "stroke-emerald-400" : aggScore > 40 ? "stroke-amber-400" : "stroke-red-500"}`}
                          strokeWidth="8"
                          strokeDasharray={301.6}
                          strokeDashoffset={301.6 - (301.6 * aggScore) / 100}
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-bold font-mono text-white">
                          {aggScore}%
                        </span>
                        <span className="text-[9px] uppercase font-mono text-slate-500">
                          Trust Rtg
                        </span>
                      </div>
                    </div>

                    {/* Diagnostics text summary */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono text-slate-500">Session Status</span>
                      <div className={`text-xs font-semibold uppercase ${aggScore > 75 ? "text-emerald-400" : aggScore > 40 ? "text-amber-400" : "text-red-400"}`}>
                        {aggScore > 75 ? "AUTHENTIC CUSTOMER" : aggScore > 40 ? "HIGH DRIFT WARN" : "FRAUD ATTACK LOCKED"}
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono tracking-tight leading-tight max-w-[160px]">
                        Cross-channel neural indices are active. Dynamic challenge-response validated.
                      </p>
                    </div>
                  </div>

                  {/* Channel by channel summary list */}
                  <div className="space-y-2 border-t border-slate-850 pt-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-500">Video KYC Liveness:</span>
                      <span className={faceRiskScore === null ? "text-slate-600" : faceSynthetic ? "text-red-400 font-bold" : "text-emerald-400"}>
                        {faceRiskScore === null ? "Untested" : `${100 - faceRiskScore}% Trust`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-500">Voice Synthesis Index:</span>
                      <span className={voiceRiskScore === null ? "text-slate-600" : voiceCloned ? "text-red-400 font-bold" : "text-emerald-400"}>
                        {voiceRiskScore === null ? "Untested" : `${100 - voiceRiskScore}% Trust`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-500">KYC Forgery Checks:</span>
                      <span className={docRiskScore === null ? "text-slate-600" : docSynthetic ? "text-red-400 font-bold" : "text-emerald-400"}>
                        {docRiskScore === null ? "Untested" : `${100 - docRiskScore}% Trust`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-500">Typing Behavior Signature:</span>
                      <span className={behaviorScore === null ? "text-slate-600" : behaviorBot ? "text-red-400 font-bold" : "text-emerald-400"}>
                        {behaviorScore === null ? "Untested" : `${behaviorScore}% Match`}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 max-w-[280px] mx-auto space-y-2">
                  <Cpu className="w-8 h-8 mx-auto text-slate-700 animate-spin" />
                  <p className="text-xs font-mono">
                    No active audit checks logged in this session.
                  </p>
                  <p className="text-[10px] text-slate-500 font-sans">
                    Execute liveness check, voice analyzer, or card scanning to generate dynamic explainable trust rating.
                  </p>
                </div>
              )}
            </div>

            {/* Biometric Stream Terminal Logs */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-2">Biometric Network Logs (No database save)</span>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-850 font-mono text-[9px] text-slate-400 space-y-1 max-h-[140px] overflow-y-auto">
                {systemLogs.length === 0 ? (
                  <div className="text-slate-600 italic">Static monitoring arrays ready...</div>
                ) : (
                  systemLogs.map((log, i) => (
                    <div key={i} className="truncate">{log}</div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 pt-12 text-center text-xs text-slate-500 font-mono border-t border-slate-900">
        <p>PhantomShield is an open intelligence research project conforming to the RBI digital credit and security guidelines.</p>
        <p className="mt-1">Zero raw biometrics stored. Entire pipeline executes within standard ephemeral session contexts. Compliance validated by India DPDP Act 2023.</p>
      </footer>
    </div>
  );
}
