export type PhantomChannel = "video-kyc" | "voice-clone" | "document-forgery" | "behavioral-biometric" | "dpdp-compliance";

export interface GazeChallenge {
  action: string;
  duration: string;
  instruction: string;
}

export interface ChallengeResponse {
  challengeToken: string;
  gazeChallenges: GazeChallenge[];
  timestamp: string;
  expiresIn: string;
}

export interface MediaAnalysisResult {
  success: boolean;
  riskScore: number;
  isSynthetic: boolean;
  livenessPassed: boolean;
  isMock?: boolean;
  auditDetails: {
    eyeballsGaze: string;
    facialBoundary: string;
    lightingConsistency: string;
    moirePatterns: string;
    metadataDissonance?: string;
  };
  detectedArtifacts: string[];
  explainableVerdict: string;
}

export interface VoiceAnalysisResult {
  success: boolean;
  syntheticRiskScore: number;
  isCloneDetected: boolean;
  spectralArtifacts: {
    phaseDiscontinuity: string;
    roboticTransitions: string;
    spectrogramBreathingAbsence: string;
    noiseFingerprint: string;
  };
  detectedCloningIndicators: string[];
  voiceVerdict: string;
}

export interface DocumentSample {
  id: string;
  name: string;
  documentType: "Aadhaar Card" | "PAN Card" | "Voter ID" | "Passport";
  category: "Organic (Verify)" | "Synthetic / Fabricated (Alert)";
  description: string;
  imagePlaceholder: string; // fallback SVG or pattern
  indicatorList: string[];
  // If we can embed high quality direct base64 vectors or representations, let's put them here
  simulatedAnomalies: string[];
  isSynthetic: boolean;
}

export interface FacelockSample {
  id: string;
  name: string;
  category: "Organic Biometric" | "Deepfake Generative";
  description: string;
  imagePlaceholder: string;
  indicatorList: string[];
  simulatedAnomalies: string[];
  isSynthetic: boolean;
}

export interface VoiceProfileSample {
  id: string;
  name: string;
  category: "Organic Sound Spectrum" | "AI Voice Clone";
  description: string;
  frequencyRange: string;
  isSynthetic: boolean;
}

export interface KeystrokeStroke {
  key: string;
  pressTime: number;
  releaseTime: number;
  duration: number;
}
