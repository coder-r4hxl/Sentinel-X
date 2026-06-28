export type PermissionState = 'granted' | 'denied' | 'prompt' | 'unavailable';
export type AssessmentStatus = 'idle' | 'running' | 'complete' | 'error';
export type RiskRating = 'Excellent' | 'Good' | 'Moderate' | 'Poor';

export interface PermissionCapability {
  id: 'notifications' | 'clipboard-read' | 'clipboard-write' | 'camera' | 'microphone' | 'geolocation';
  label: string;
  description: string;
  required: boolean;
  state: PermissionState;
  supported: boolean;
  compatibility: string;
}

export interface BrowserSnapshot {
  browserName: string;
  browserVersion: string;
  operatingSystem: string;
  platform: string;
  userAgent: string;
  language: string;
  timezone: string;
  cookiesEnabled: boolean;
  javascriptEnabled: boolean;
  doNotTrack: string;
  online: boolean;
  touchSupport: boolean;
  screenResolution: string;
  colorDepth: number;
  pixelRatio: number;
  hardwareConcurrency: number;
  deviceMemory: number | null;
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
  serviceWorker: boolean;
  notificationPermission: PermissionState;
  clipboardSupport: boolean;
  cameraSupport: boolean;
  microphoneSupport: boolean;
  batterySupport: boolean;
  bluetoothSupport: boolean;
  usbSupport: boolean;
  webglSupport: boolean;
  canvasSupport: boolean;
  webrtcSupport: boolean;
  mediaDevicesSupport: boolean;
  connectionType: string;
  connectionDownlink: number | null;
  connectionRtt: number | null;
  darkMode: boolean;
  reducedMotion: boolean;
  installedPwa: boolean;
}

export interface AssessmentCheckResult {
  id: string;
  label: string;
  value: string;
  detail: string;
  status: 'pass' | 'warning' | 'info';
}

export interface AssessmentReport {
  checks: AssessmentCheckResult[];
  browserSecurityScore: number;
  privacyScore: number;
  compatibilityScore: number;
  riskRating: RiskRating;
  findings: string[];
}

export interface AssessmentProgress {
  currentCheck: string;
  completedChecks: number;
  remainingChecks: number;
  estimatedTimeRemaining: number;
  progress: number;
}
