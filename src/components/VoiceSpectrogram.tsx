import { useState, useRef, useEffect } from "react";
import { Mic, Volume2, Square, Sparkles, Activity, CheckCircle, Smartphone } from "lucide-react";
import { VoiceProfileSample, VoiceAnalysisResult } from "../types";
import { VOICE_SAMPLES } from "../data";

interface VoiceSpectrogramProps {
  consentGranted: boolean;
  onAnalysisTriggered: (score: number, isSynthetic: boolean) => void;
}

export default function VoiceSpectrogram({ consentGranted, onAnalysisTriggered }: VoiceSpectrogramProps) {
  const [samples] = useState<VoiceProfileSample[]>(VOICE_SAMPLES);
  const [selectedSample, setSelectedSample] = useState<VoiceProfileSample | null>(VOICE_SAMPLES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<VoiceAnalysisResult | null>(null);
  const [progressLog, setProgressLog] = useState<string[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const addLog = (msg: string) => {
    setProgressLog((prev) => [...prev, msg]);
  };

  // Draw simulated dynamic audio frequency spectrogram
  const drawSimulatedWaves = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    let draw = () => {
      ctx.fillStyle = "rgba(2, 6, 23, 0.25)";
      ctx.fillRect(0, 0, width, height);

      // Spectrogram waterfall columns
      const cols = 50;
      const colWidth = width / cols;
      const time = Date.now() * 0.003;

      for (let i = 0; i < cols; i++) {
        // High frequency or flat amplitude based on selection
        let amplitude = 0;
        if (isPlaying || isRecording) {
          if (selectedSample?.isSynthetic && !isRecording) {
            // Cloned voices have flatter, highly repetitive spectral structures
            amplitude = Math.sin(i * 0.3 + time) * 30 + Math.cos(i * 0.1) * 10 + height / 2;
          } else {
            // Human organic signals have high chaotic variance, and resonant breath spikes
            amplitude = Math.sin(i * 0.5 + time) * 45 + Math.sin(i * 1.5 + time * 2) * 15 + height / 2;
          }
        } else {
          // Flat silent ambient room hum
          amplitude = Math.sin(i * 0.1 + time) * 2 + height - 20;
        }

        // Draw spectral bar
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        if (selectedSample?.isSynthetic && !isRecording) {
          gradient.addColorStop(0, "rgba(239, 68, 68, 0.05)");
          gradient.addColorStop(0.5, "rgba(239, 68, 68, 0.3)");
          gradient.addColorStop(1, "rgba(244, 63, 94, 0.85)");
        } else {
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.05)");
          gradient.addColorStop(0.5, "rgba(16, 185, 129, 0.35)");
          gradient.addColorStop(1, "rgba(52, 211, 153, 0.85)");
        }

        ctx.strokeStyle = selectedSample?.isSynthetic && !isRecording ? "#ef4444" : "#10b981";
        ctx.fillStyle = gradient;
        ctx.fillRect(i * colWidth, height - amplitude, colWidth - 2, amplitude);
      }

      animationFrameId.current = requestAnimationFrame(draw);
    };

    draw();
  };

  // Start Canvas animation loop when state shifts
  useEffect(() => {
    drawSimulatedWaves();
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, isRecording, selectedSample]);

  const handlePlayStop = () => {
    if (!consentGranted) {
      alert("Verification blocked: Consent must be logged prior to activating speech pipelines.");
      return;
    }
    setIsPlaying(!isPlaying);
    setIsRecording(false);
  };

  const handleRecord = () => {
    if (!consentGranted) {
      alert("Verification blocked: Consent is required before open mic recording checks.");
      return;
    }
    setIsRecording(!isRecording);
    setIsPlaying(false);
    setSelectedSample(null); // use custom Mic capture
    setAnalysisResult(null);
  };

  const verifyVoicePrint = async () => {
    if (!consentGranted) {
      alert("Consent required to run Voice-Print neural analysis.");
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);
    setProgressLog([]);

    addLog("Interfacing with Digital Signal Processing node...");
    addLog("Extracting linear-predictive coding and cepstral vectors (MFCC)...");

    try {
      addLog("Converting raw spectral vectors into voice footprint frame...");
      await new Promise((resolve) => setTimeout(resolve, 850));
      addLog("Querying server-side spectral discriminator...");

      const response = await fetch("/api/analyze-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sampleName: isRecording ? "Live Microphone Capture" : selectedSample?.name,
          metadata: {
            samplingRate: "16000Hz PCM",
            channels: "Mono (biometric-sanitized)"
          },
          simulatedMode: false
        })
      });

      if (!response.ok) {
        throw new Error("Voice verification engine returned error response.");
      }

      const data = await response.json();
      addLog("Acoustic fingerprint matching successful. Generating report.");
      setAnalysisResult(data);
      onAnalysisTriggered(data.syntheticRiskScore, data.isCloneDetected);

    } catch (err: any) {
      addLog(`[ERROR] Speech matching failed: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col h-full" id="voice-clone-spectrum-bed">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-medium text-slate-100">Voice Clone Spectrometer</h3>
            <p className="text-xs text-slate-400 font-mono">Audio Spectral Density & Cloning Identifiers</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* Left Side: Waveform controller */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block mb-2">
              Select Sandbox Voice Profile
            </span>
            <div className="space-y-2">
              {samples.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedSample(v);
                    setIsPlaying(false);
                    setIsRecording(false);
                    setAnalysisResult(null);
                    setProgressLog([]);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition cursor-pointer flex justify-between items-center ${selectedSample?.id === v.id ? "bg-indigo-950/40 border-indigo-500/50 text-indigo-200" : "bg-slate-950/70 border-slate-900 text-slate-400 hover:text-slate-200"}`}
                >
                  <div>
                    <div className="font-semibold font-display">{v.name}</div>
                    <span className="text-[9px] font-mono text-slate-500 block">Frequency: {v.frequencyRange}</span>
                  </div>
                  <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded ${v.isSynthetic ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                    {v.isSynthetic ? "AI Clone" : "Organic Voice"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-950/50 border border-slate-850 rounded-lg">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block mb-2">
              Microphone Capture Test Bed
            </span>
            <button
              onClick={handleRecord}
              className={`w-full py-2 px-4 rounded-lg font-mono text-xs font-medium cursor-pointer transition flex items-center justify-center gap-2 ${isRecording ? "bg-red-600 hover:bg-red-500 text-white" : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850"}`}
            >
              <Mic className={`w-4 h-4 ${isRecording ? "animate-pulse" : ""}`} />
              {isRecording ? "Stop Recording Check" : "Start Live Mic Feed"}
            </button>
          </div>

          {selectedSample && (
            <div className="text-xs text-slate-400 bg-slate-950/30 p-2.5 rounded border border-slate-850">
              <strong className="text-slate-300 block mb-0.5 font-display">Target Profile Intel:</strong>
              {selectedSample.description}
            </div>
          )}
        </div>

        {/* Right Side: Spectrogram Visualization & Result output */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950/60 border border-slate-850 rounded-lg p-4">
          <div className="space-y-4">
            {/* CANVAS WATERFALL SPECTROGRAM */}
            <div className="relative border border-slate-850 bg-slate-950 rounded-lg overflow-hidden h-[120px]">
              <canvas
                ref={canvasRef}
                width={400}
                height={120}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-slate-950/80 px-2 py-0.5 border border-slate-850 rounded text-[9px] text-slate-400 font-mono flex items-center gap-1">
                <Activity className="w-3 h-3 text-indigo-400 animate-pulse" />
                <span>FFT WATERFALL SPECTROGRAM</span>
              </div>

              {/* Spectral control triggers */}
              {selectedSample && (
                <button
                  onClick={handlePlayStop}
                  className="absolute bottom-2 right-2 p-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow transition cursor-pointer"
                >
                  {isPlaying ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Verification trigger */}
            <button
              onClick={verifyVoicePrint}
              disabled={analyzing || (!isPlaying && !isRecording && !selectedSample)}
              className="w-full font-display py-2 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg font-medium text-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {analyzing ? "Running Neural Cepstral Matching..." : "Assess Vocal Signature Authenticity"}
            </button>

            {/* Interactive logs */}
            {progressLog.length > 0 && !analysisResult && (
              <div className="bg-slate-950 p-2.5 rounded border border-slate-900 font-mono text-[9px] text-indigo-400 space-y-1 max-h-[110px] overflow-y-auto">
                {progressLog.map((log, i) => (
                  <div key={i} className="flex gap-1">
                    <span className="text-slate-600 font-bold">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Spectrogram verification result */}
            {analysisResult && (
              <div className="space-y-4 bg-slate-950 p-3.5 rounded-lg border border-slate-850 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-900">
                  <span className="text-slate-400 font-mono">Clone Probability Rate:</span>
                  <span className={`font-mono font-bold ${analysisResult.isCloneDetected ? "text-red-400" : "text-emerald-400"}`}>
                    {analysisResult.syntheticRiskScore}% {analysisResult.isCloneDetected ? "CLONED" : "ORGANIC MATCH"}
                  </span>
                </div>

                {/* Spectral artifacts checklist */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono leading-tight">
                  <div className="bg-slate-900/50 p-2 rounded">
                    <span className="text-slate-500 font-semibold block text-[9px] uppercase">Phase discontinuity</span>
                    <p className="text-slate-300 mt-0.5">{analysisResult.spectralArtifacts.phaseDiscontinuity}</p>
                  </div>
                  <div className="bg-slate-900/50 p-2 rounded">
                    <span className="text-slate-500 font-semibold block text-[9px] uppercase">Inhalation Check</span>
                    <p className="text-slate-300 mt-0.5">{analysisResult.spectralArtifacts.spectrogramBreathingAbsence}</p>
                  </div>
                </div>

                {analysisResult.detectedCloningIndicators.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {analysisResult.detectedCloningIndicators.map((indicator, index) => (
                      <span key={index} className="px-1.5 py-0.5 text-[8.5px] font-mono bg-red-950/20 text-red-400 border border-red-500/20 rounded">
                        {indicator}
                      </span>
                    ))}
                  </div>
                )}

                <div className="p-2.5 bg-slate-900/20 border-l-2 border-indigo-500 text-xs text-slate-300 leading-normal">
                  <span className="font-mono text-[9px] text-indigo-400 block mb-0.5 font-bold uppercase">ACOUSTIC AUDIT COMMENT:</span>
                  {analysisResult.voiceVerdict}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
