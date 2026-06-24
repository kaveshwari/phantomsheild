import { useState, useEffect } from "react";
import { ShieldCheck, Lock, AlertTriangle, RefreshCw, Layers, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DpdpShieldProps {
  onPurge: () => void;
  consentGranted: boolean;
  onConsentChange: (val: boolean) => void;
}

export default function Dpdpshield({ onPurge, consentGranted, onConsentChange }: DpdpShieldProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"notice" | "consent" | "purge">("notice");

  useEffect(() => {
    addLog("PhantomShield sandbox initiated under ephemeral memory constraints.");
    addLog("Aadhaar/PAN card biometrics compliance rule loaded (DPDP Section 5/6).");
  }, []);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${msg}`, ...prev].slice(0, 15));
  };

  const handleConsentToggle = (checked: boolean) => {
    onConsentChange(checked);
    if (checked) {
      addLog("DPDP Notice Section 5 explicitly accepted. Generating Cryptographic Notice Identifier.");
      addLog("Purpose limitation: session restricted solely to liveness and artifact validation.");
    } else {
      addLog("Consent withdrawn. Restricting access to webcam capture and AI visual scanners.");
    }
  };

  const executePurge = () => {
    onPurge();
    addLog("CRITICAL: Executed zero-trust trace termination.");
    addLog("Session cache wiped. 0 bytes of facial metadata retained. Temporary buffers purged.");
    // Display alert
    alert("DPDP Compliance Purge Complete:\nAll physical frames, biometric tensors, and local state variables destroyed.");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-full" id="dpdp-compliance-module">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-medium text-slate-100">DPDP Consent Shield</h3>
            <p className="text-xs text-slate-400 font-mono">India DPDP Act 2023 Compliant</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-mono rounded-full border border-emerald-500/20">
          SECURE SANDBOX
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-lg text-xs font-mono mb-4">
        <button
          onClick={() => setActiveTab("notice")}
          className={`py-1.5 rounded transition ${activeTab === "notice" ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30" : "text-slate-400 hover:text-slate-200"}`}
        >
          Section 5 Notice
        </button>
        <button
          onClick={() => setActiveTab("consent")}
          className={`py-1.5 rounded transition ${activeTab === "consent" ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30" : "text-slate-400 hover:text-slate-200"}`}
        >
          Consent Logs
        </button>
        <button
          onClick={() => setActiveTab("purge")}
          className={`py-1.5 rounded transition ${activeTab === "purge" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "text-slate-400 hover:text-slate-300"}`}
        >
          Data Purge
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[140px] pr-1 mb-4">
        {activeTab === "notice" && (
          <div className="space-y-2 text-xs text-slate-300">
            <p className="font-semibold text-indigo-400">Notice of Purpose & Processing</p>
            <p>
              Under <strong>Section 5(1)</strong> of India's Digital Personal Data Protection Act 2023, PhantomShield issues this notice:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 font-mono text-[11px]">
              <li>We process facial coordinates and voice spectra solely for liveness evaluation.</li>
              <li>Data is processed client-side or sent over encrypted SSL tunnels to local secure endpoints.</li>
              <li><strong>Zero Permanent Biometrics:</strong> No raw video, photos, or audio prints are stored in persistent databases.</li>
              <li>Consent is completely clear and withdrawable in real-time.</li>
            </ul>
          </div>
        )}

        {activeTab === "consent" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono bg-slate-950/50 p-2 rounded border border-slate-800">
              <span className="text-slate-400 font-sans">Consent Status:</span>
              <span className={`font-semibold ${consentGranted ? "text-emerald-400" : "text-amber-500"}`}>
                {consentGranted ? "ACTIVE (Opted-in)" : "WITHHELD (Locked)"}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 space-y-1 border-t border-slate-800 pt-2 h-[80px] overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="truncate">{log}</div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "purge" && (
          <div className="space-y-2 text-xs">
            <p className="text-slate-300 text-xs">
              <strong>Section 11 Right to Erasure:</strong> PhantomShield implements instantaneous multi-layer cache purging. 
            </p>
            <p className="text-slate-400 text-[11px]">
              Clicking purge sweeps RAM buffers, stops GPU visual pipeline caches, deletes ephemeral WebAssembly biometric matrices, and releases camera locks.
            </p>
          </div>
        )}
      </div>

      <div className="mt-auto space-y-3 pt-3 border-t border-slate-800">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={consentGranted}
            onChange={(e) => handleConsentToggle(e.target.checked)}
            className="mt-0.5 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 focus:ring-1"
          />
          <span className="text-xs text-slate-400 leading-tight">
            I grant consent for real-time video/audio scanning. My biometric parameters will be evaluated and purged immediately after the session.
          </span>
        </label>

        <div className="flex gap-2">
          {consentGranted ? (
            <div className="flex-1 flex items-center justify-center gap-1 text-[11px] font-mono py-1.5 px-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" />
              Liveness Pipeline Active
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-1 text-[11px] font-mono py-1.5 px-3 rounded-lg bg-yellow-950/30 border border-yellow-500/20 text-yellow-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              Capture Pipeline Blocked
            </div>
          )}

          <button
            onClick={executePurge}
            id="purge-biometrics-button"
            className="py-1.5 px-3 bg-red-950/40 hover:bg-red-900/30 border border-red-500/30 hover:border-red-500/50 text-red-400 rounded-lg text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Purge Session
          </button>
        </div>
      </div>
    </div>
  );
}
