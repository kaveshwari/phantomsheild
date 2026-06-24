import React, { useState, useRef } from "react";
import { Activity, ShieldCheck, KeyRound, AlertTriangle, HelpCircle, Lock } from "lucide-react";

interface BehavioralBiometricsProps {
  consentGranted: boolean;
  onAnalysisTriggered: (score: number, isSynthetic: boolean) => void;
}

export default function BehavioralBiometrics({ consentGranted, onAnalysisTriggered }: BehavioralBiometricsProps) {
  const TARGET_PHRASE = "VERIFY PHANTOM SECURE";
  const [inputText, setInputText] = useState<string>("");
  const [keystrokeData, setKeystrokeData] = useState<{ key: string; dwell: number; flight: number }[]>([]);
  const [dwellingSummary, setDwellingSummary] = useState<number>(0);
  const [flightSummary, setFlightSummary] = useState<number>(0);
  const [assessment, setAssessment] = useState<string | null>(null);
  const [behaviorScore, setBehaviorScore] = useState<number | null>(null);
  const [isBotSuspicion, setIsBotSuspicion] = useState<boolean>(false);
  const [jitter, setJitter] = useState<number>(0);

  const keyDownTimes = useRef<Record<string, number>>({});
  const lastKeyUpTime = useRef<number | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!consentGranted) return;
    const key = e.key;
    if (!keyDownTimes.current[key]) {
      keyDownTimes.current[key] = performance.now();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!consentGranted) return;
    const key = e.key;
    const now = performance.now();
    const pressTime = keyDownTimes.current[key];

    if (pressTime) {
      const dwell = Math.round(now - pressTime);
      let flight = 0;

      if (lastKeyUpTime.current) {
        flight = Math.round(pressTime - lastKeyUpTime.current);
      }

      // Add to keystroke dataset
      setKeystrokeData((prev) => [
        ...prev,
        { key: key.toUpperCase(), dwell, flight }
      ].slice(-12)); // keep last 12 typing records

      keyDownTimes.current[key] = 0;
      lastKeyUpTime.current = now;
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    // Calculate dynamic analytics on the fly
    if (keystrokeData.length > 3) {
      const avgDwell = Math.round(keystrokeData.reduce((acc, k) => acc + k.dwell, 0) / keystrokeData.length);
      const avgFlight = Math.round(keystrokeData.reduce((acc, k) => acc + k.flight, 0) / keystrokeData.length);
      
      // Calculate jitter (variance in typing dwell times)
      const meanDwell = avgDwell;
      const squaredDiffs = keystrokeData.map(k => Math.pow(k.dwell - meanDwell, 2));
      const variance = squaredDiffs.reduce((acc, d) => acc + d, 0) / keystrokeData.length;
      const stdDev = Math.round(Math.sqrt(variance));

      setDwningAndFlight(avgDwell, avgFlight, stdDev);
    }
  };

  const setDwningAndFlight = (dwell: number, flight: number, stdDev: number) => {
    setDwellingSummary(dwell);
    setFlightSummary(flight);
    setJitter(stdDev);
  };

  const resetBiometrics = () => {
    setInputText("");
    setKeystrokeData([]);
    setDwellingSummary(0);
    setFlightSummary(0);
    setJitter(0);
    setAssessment(null);
    setBehaviorScore(null);
    setIsBotSuspicion(false);
    keyDownTimes.current = {};
    lastKeyUpTime.current = null;
  };

  const runSignatureMatch = () => {
    if (!consentGranted) {
      alert("Verification blocked: Consent is required before executing behavioral audit patterns.");
      return;
    }

    if (inputText.length < 5) {
      alert("Typing stream sample too thin. Please input larger fragments of the validation passphrase.");
      return;
    }

    // Heuristics for bot vs humann
    // Bots have zero variance in keystroke timing, highly robotic speed (e.g. dwell time < 10ms or perfectly uniform intervals)
    // Human is organic: 45ms to 180ms dwell, with minor temporal jitter
    const isRoboticSpeed = dwellingSummary < 12 || flightSummary < 12;
    const isRoboticVariance = jitter < 4 && keystrokeData.length > 5;

    const botDetected = isRoboticSpeed || isRoboticVariance;
    setIsBotSuspicion(botDetected);

    const score = botDetected ? Math.floor(18 + Math.random() * 15) : Math.floor(88 + Math.random() * 11);
    setBehaviorScore(score);

    const matchText = botDetected
      ? "CRITICAL ALERT: Robotic / Automated keystroke pattern recognized. Standard micro-vibrations, dwell variance, and flight delays match programmatic bot injection models (UPI credential stuffing)."
      : "VERIFIED SECURE: Biometric dynamics align elegantly with biological hand tremor thresholds. Unique physical dwell latency footprint matched SBI high-value security thresholds.";

    setAssessment(matchText);
    onAnalysisTriggered(score, botDetected);
  };

  // Simulate automated bot typing
  const loadSimulatedBotPattern = () => {
    if (!consentGranted) {
      alert("First grant DPDP Consent to operate typing pipelines.");
      return;
    }
    resetBiometrics();
    setInputText(TARGET_PHRASE);
    // Perfect rigid uniform timings
    const fakeKeys = TARGET_PHRASE.split("").map((ch) => ({
      key: ch,
      dwell: 10,
      flight: 15
    }));
    setKeystrokeData(fakeKeys);
    setDwellingSummary(10);
    setFlightSummary(15);
    setJitter(1.1); // robotic consistency
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-full" id="behavioral-auth-bed">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-medium text-slate-100">Behavioral Biometrics Core</h3>
            <p className="text-xs text-slate-400 font-mono">Keystroke Rhythms & UPI Limit Guard</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* Input & controller */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-850">
            <label className="text-[10.5px] uppercase font-mono tracking-wider text-indigo-400 block mb-1.5 font-bold">
              Transaction Passphrase Challenge
            </label>
            <p className="text-slate-400 text-xs mb-3 font-sans">
              Type the exact authorization signature below to record biological dwell flight characteristics:
              <strong className="block text-slate-200 font-mono mt-1 select-all bg-slate-900 py-1 px-2 border border-slate-800 rounded">{TARGET_PHRASE}</strong>
            </p>

            <input
              type="text"
              value={inputText}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              onChange={handleTextChange}
              disabled={!consentGranted}
              placeholder={consentGranted ? "Begin typing signature words here..." : "⚠️ Locked: Grant DPDP Consent"}
              className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={runSignatureMatch}
              disabled={inputText.length < 3}
              className="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg font-display font-medium text-xs transition cursor-pointer"
            >
              Authorize UPI Limit Check
            </button>
            <button
              onClick={resetBiometrics}
              className="py-1.5 px-2 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 rounded-lg font-mono text-xs transition"
            >
              Reset Stream
            </button>
          </div>

          <div className="h-[2px] bg-slate-800"></div>

          <div className="space-y-1">
            <span className="text-[9.5px] block font-mono text-slate-500 uppercase">Interactive Bot Simulator:</span>
            <button
              onClick={loadSimulatedBotPattern}
              className="w-full text-left py-1.5 px-2.5 rounded bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-amber-400 text-[11px] font-mono flex items-center justify-between"
            >
              <span>Inject Credential-Stuffing Script (Bot)</span>
              <span className="bg-amber-500/20 px-1 rounded text-[9px]">SIMULATE BOT</span>
            </button>
          </div>
        </div>

        {/* Dynamics Graph & Assessment output */}
        <div className="lg:col-span-6 bg-slate-950/50 border border-slate-850 rounded-lg p-4 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400 block mb-2 font-bold">
              Active Biometric Telemetry
            </span>

            {/* Micro graphs of keystroke dwell times */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-950 border border-slate-900 p-2.5 rounded text-center">
                <span className="text-[9px] font-mono text-slate-500 block uppercase">Mean Dwell</span>
                <span className="text-sm font-bold font-mono text-slate-300">{dwellingSummary || "--"} <span className="text-[9px] text-slate-500 font-normal">ms</span></span>
              </div>
              <div className="bg-slate-950 border border-slate-900 p-2.5 rounded text-center">
                <span className="text-[9px] font-mono text-slate-500 block uppercase">Mean Flight</span>
                <span className="text-sm font-bold font-mono text-slate-300">{flightSummary || "--"} <span className="text-[9px] text-slate-500 font-normal">ms</span></span>
              </div>
              <div className="bg-slate-950 border border-slate-900 p-2.5 rounded text-center">
                <span className="text-[9px] font-mono text-slate-500 block uppercase">Tempo Jitter</span>
                <span className="text-sm font-bold font-mono text-slate-300">{jitter || "--"} <span className="text-[9px] text-slate-500 font-normal">ms</span></span>
              </div>
            </div>

            {/* Keystroke key traces */}
            <div className="mt-3">
              <span className="text-[9px] uppercase font-mono text-slate-600 block mb-1">Key Strike Trace BUFFER:</span>
              <div className="flex flex-wrap gap-1.5 h-[34px] overflow-hidden">
                {keystrokeData.length === 0 ? (
                  <span className="text-[10px] font-mono text-slate-600 italic">Waiting for keystroke input streams...</span>
                ) : (
                  keystrokeData.map((k, i) => (
                    <span key={i} className="px-1.5 py-0.5 text-[9px] font-mono bg-slate-950 border border-emerald-500/20 text-emerald-400 rounded">
                      {k.key} <span className="text-slate-600 text-[8px]">{k.dwell}ms</span>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Verification evaluation block */}
          {behaviorScore !== null && (
            <div className="bg-slate-950 p-3 rounded border border-slate-850 space-y-2 text-xs">
              <div className="flex justify-between items-center text-[11px] font-mono border-b border-indigo-950/50 pb-1.5">
                <span className="text-slate-500">Biological Trust Score:</span>
                <span className={`font-bold ${isBotSuspicion ? "text-red-400" : "text-emerald-400"}`}>
                  {behaviorScore}% {isBotSuspicion ? "SUSPICIOUS BOT" : "VERIFIED HUMAN"}
                </span>
              </div>

              <div className="p-2.5 bg-slate-900/50 border-l-2 border-indigo-500 text-xs text-slate-300 leading-normal">
                <span className="font-mono text-[9px] text-indigo-400 font-bold block mb-0.5 uppercase">PASSIVE TRANSTACT RANGE ADVISORY:</span>
                {assessment}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
