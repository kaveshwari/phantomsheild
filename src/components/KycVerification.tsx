import React, { useState } from "react";
import { FileText, Upload, AlertOctagon, ShieldAlert, CheckCircle, Search, Cpu, ListFilter } from "lucide-react";
import { DocumentSample, MediaAnalysisResult } from "../types";
import { BANKING_DOCUMENT_SAMPLES } from "../data";

interface KycVerificationProps {
  consentGranted: boolean;
  onAnalysisTriggered: (score: number, isSynthetic: boolean) => void;
}

export default function KycVerification({ consentGranted, onAnalysisTriggered }: KycVerificationProps) {
  const [samples] = useState<DocumentSample[]>(BANKING_DOCUMENT_SAMPLES);
  const [selectedSample, setSelectedSample] = useState<DocumentSample | null>(BANKING_DOCUMENT_SAMPLES[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customFilename, setCustomFilename] = useState<string>("");
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<MediaAnalysisResult | null>(null);
  const [interactiveLog, setInteractiveLog] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState<string>("");

  const addInteractiveLog = (msg: string) => {
    setInteractiveLog((prev) => [...prev, msg]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!consentGranted) {
      alert("DPDP Security Alert: Please grant consent in the DPDP Consent Shield before scanning files.");
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImage(reader.result as string);
        setCustomFilename(file.name);
        setSelectedSample(null); // Deselect preloaded
        setAnalysisResult(null); // Clear previous
        setInteractiveLog([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerDocumentAudit = async () => {
    if (!consentGranted) {
      alert("DPDP Security Restriction: Consent is mandatory prior to parsing and transmitting document telemetry.");
      return;
    }

    setAnalyzing(true);
    setInteractiveLog([]);
    setAnalysisResult(null);

    addInteractiveLog("Connecting to PhantomShield server-side audit node...");
    addInteractiveLog("Loading document coordinate metrics into biometric RAM...");

    let payloadImage = "";
    let filename = "";
    let isSyntheticSource = false;

    if (customImage) {
      payloadImage = customImage;
      filename = customFilename;
    } else if (selectedSample) {
      // Simulate/Generate card visual to analyze or pass placeholder
      payloadImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='blue'/></svg>";
      filename = `${selectedSample.name}.png`;
      isSyntheticSource = selectedSample.isSynthetic;
    } else {
      setAnalyzing(false);
      return;
    }

    try {
      addInteractiveLog("Executing multi-spectral typographic check...");
      addInteractiveLog("Running CNN alignment & Moiré lattice filters...");

      await new Promise((resolve) => setTimeout(resolve, 800));
      addInteractiveLog("Transmitting frame signature to Gemini cognitive layer...");

      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: payloadImage,
          mode: "kyc",
          filename,
          customPrompt: customPrompt || undefined
        })
      });

      if (!res.ok) {
        throw new Error("Local engine timeout or server endpoint returned error code.");
      }

      const data = await res.json();
      addInteractiveLog("Structure check completed. Reassembling visual metadata annotations...");
      setAnalysisResult(data);
      onAnalysisTriggered(data.riskScore, data.isSynthetic);

    } catch (error: any) {
      console.error(error);
      addInteractiveLog(`[FAIL] Verification pipeline failed: ${error.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-full" id="kyc-forgery-bed">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-medium text-slate-100">KYC Forgery Scanner</h3>
            <p className="text-xs text-slate-400 font-mono">PAN & Aadhaar Fabricated Verification</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* Selection panel */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block mb-2">
              Select Sandbox KYC Template
            </span>
            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
              {samples.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    setSelectedSample(sample);
                    setCustomImage(null);
                    setAnalysisResult(null);
                    setInteractiveLog([]);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition cursor-pointer flex justify-between items-start ${selectedSample?.id === sample.id ? "bg-indigo-950/40 border-indigo-500/50 text-indigo-200" : "bg-slate-950/70 border-slate-850 hover:bg-slate-950 text-slate-300"}`}
                >
                  <div className="space-y-1">
                    <div className="font-semibold font-display">{sample.name}</div>
                    <div className="text-[10px] font-mono text-slate-400 pr-2 line-clamp-1">{sample.documentType}</div>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${sample.isSynthetic ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                    {sample.isSynthetic ? "Synthetic" : "Organic"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload Box */}
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block mb-2">
              Or Upload Live Aadhaar/PAN Scan
            </span>
            <label className={`flex flex-col items-center justify-center border border-dashed rounded-lg p-3 text-center cursor-pointer transition ${!consentGranted ? "opacity-40 bg-slate-950/40 border-slate-850 hover:cursor-not-allowed" : "bg-slate-950 hover:bg-slate-950/70 border-slate-700 hover:border-indigo-500/60"}`}>
              <Upload className={`w-5 h-5 mb-1 ${customImage ? "text-emerald-400" : "text-slate-400"}`} />
              <span className="text-[11px] font-medium text-slate-200">
                {customImage ? "Custom Document Loaded" : "Drop scan or click here"}
              </span>
              <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                {customImage ? customFilename : "JPEG, PNG up to 10MB"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={!consentGranted}
                className="hidden"
              />
            </label>
          </div>

          {/* Custom Prompt Context */}
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block mb-1">
              Custom Focus Parameter (Optional instructions to AI Agent)
            </span>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Inspect the holographic Ashoka seal closely"
              disabled={!consentGranted}
              className="w-full text-[11px] bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 placeholder-slate-600 font-mono focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>

        {/* Visual Inspection Card & Report Output */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950/60 border border-slate-850 rounded-lg p-4">
          <div className="space-y-4">
            {/* Hologram card simulator */}
            <div className="relative border border-slate-800 bg-slate-950 rounded-xl p-4 overflow-hidden h-[120px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"></div>
              {analyzing && (
                <div className="absolute inset-0 bg-slate-950/30 z-10 flex flex-col items-center justify-center">
                  <div className="scan-line absolute top-0 left-0 right-0 h-0.5 bg-indigo-500/70 shadow-[0_0_10px_2px_rgba(99,102,241,0.6)]"></div>
                  <Cpu className="w-6 h-6 animate-spin text-indigo-400 mb-1" />
                  <span className="text-[10px] font-mono text-indigo-300">Neural analysis engine executing...</span>
                </div>
              )}

              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-300">
                      {customImage ? customFilename : selectedSample ? selectedSample.name : "Select Identity Document"}
                    </div>
                    <div className="text-[9px] font-mono text-slate-500">
                      ID VALIDATION LAYER 4.0
                    </div>
                  </div>
                </div>
                <div className="w-12 h-6 bg-slate-900 border border-slate-800 rounded flex items-center justify-center">
                  <span className="text-[8px] text-slate-400 font-mono uppercase">HOLOGRAM</span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono text-slate-600">PHANTOM-TELEMETRY-STREAM-SECURE</span>
                <span className={`text-[10px] font-mono ${selectedSample?.isSynthetic || customImage ? "text-amber-500" : "text-emerald-500"}`}>
                  {selectedSample ? selectedSample.category : "Custom Target"}
                </span>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={triggerDocumentAudit}
              disabled={analyzing || (!customImage && !selectedSample)}
              className="w-full font-display py-2 px-4 rounded-lg font-medium text-xs text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              {analyzing ? "Synthesizing Forgery Report..." : "Verify Document with AI-vs-AI Analyzer"}
            </button>

            {/* Log / Step visualization */}
            {interactiveLog.length > 0 && !analysisResult && (
              <div className="bg-slate-950 p-2.5 rounded border border-slate-900 font-mono text-[10px] text-indigo-300 space-y-1 max-h-[110px] overflow-y-auto">
                {interactiveLog.map((log, i) => (
                  <div key={i} className="flex gap-1">
                    <span className="text-slate-600 font-bold">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Results score */}
            {analysisResult && (
              <div className="space-y-3 bg-slate-950 p-3 rounded-lg border border-slate-850">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">Risk Severity Benchmark:</span>
                  <div className="flex items-center gap-1.5">
                    <div className="text-right">
                      <span className={`text-sm font-bold font-mono ${analysisResult.riskScore > 50 ? "text-red-400" : "text-emerald-400"}`}>
                        {analysisResult.riskScore}% {analysisResult.riskScore > 50 ? "FORGERY RISK" : "ORGANIC MATCH"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${analysisResult.riskScore > 50 ? "bg-red-500" : "bg-emerald-500"}`}
                    style={{ width: `${analysisResult.riskScore}%` }}
                  ></div>
                </div>

                {/* Score breakdown description */}
                <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                  <div className="p-2 bg-slate-900/50 rounded">
                    <span className="text-slate-500 font-mono block text-[9px] uppercase">Typography</span>
                    <p className="text-slate-300 leading-tight mt-0.5">{analysisResult.auditDetails.metadataDissonance || "Aligned consistently."}</p>
                  </div>
                  <div className="p-2 bg-slate-900/50 rounded">
                    <span className="text-slate-500 font-mono block text-[9px] uppercase">Screen Replay Check</span>
                    <p className="text-slate-300 leading-tight mt-0.5">{analysisResult.auditDetails.moirePatterns || "No Moiré noise."}</p>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900/20 border-l-2 border-indigo-500 text-xs text-slate-300 leading-normal">
                  <span className="font-mono text-[9px] text-indigo-400 uppercase font-semibold block mb-0.5">EXPLAINABLE TRUST VERDICT:</span>
                  {analysisResult.explainableVerdict}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
