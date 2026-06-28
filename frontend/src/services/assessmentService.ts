import type { AssessmentProgress, AssessmentReport, AssessmentCheckResult, BrowserSnapshot } from '../types';
import { detectBrowserInfo } from './browserService';

const assessmentSteps = [
  'Capturing browser profile',
  'Checking runtime posture',
  'Evaluating privacy controls',
  'Auditing compatibility',
  'Generating findings',
];

function toScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

export async function runAssessment(): Promise<AssessmentReport> {
  const snapshot = detectBrowserInfo();

  const checks: AssessmentCheckResult[] = [
    { id: 'browser', label: 'Browser name', value: snapshot.browserName, detail: `Version ${snapshot.browserVersion}`, status: 'pass' },
    { id: 'os', label: 'Operating system', value: snapshot.operatingSystem, detail: `Platform: ${snapshot.platform}`, status: 'pass' },
    { id: 'cookies', label: 'Cookies enabled', value: snapshot.cookiesEnabled ? 'Enabled' : 'Disabled', detail: snapshot.cookiesEnabled ? 'Browser cookies are active.' : 'Cookies are disabled, which may limit session continuity.', status: snapshot.cookiesEnabled ? 'pass' : 'warning' },
    { id: 'storage', label: 'Storage availability', value: snapshot.localStorage ? 'Available' : 'Restricted', detail: 'Local storage is available for session state.', status: snapshot.localStorage ? 'pass' : 'warning' },
    { id: 'network', label: 'Connection', value: snapshot.connectionType, detail: `${snapshot.connectionDownlink ?? 'unknown'} Mb/s downlink`, status: 'info' },
    { id: 'privacy', label: 'Do Not Track', value: snapshot.doNotTrack, detail: 'Browser privacy preference captured locally.', status: 'info' },
    { id: 'media', label: 'Media capabilities', value: snapshot.mediaDevicesSupport ? 'Supported' : 'Unavailable', detail: 'Camera and microphone support were checked locally.', status: snapshot.mediaDevicesSupport ? 'pass' : 'warning' },
    { id: 'webgl', label: 'WebGL support', value: snapshot.webglSupport ? 'Enabled' : 'Disabled', detail: snapshot.webglSupport ? 'Hardware acceleration is available.' : 'Hardware acceleration is unavailable.', status: snapshot.webglSupport ? 'pass' : 'warning' },
  ];

  const browserSecurityScore = toScore(
    40 + (snapshot.cookiesEnabled ? 16 : 0) + (snapshot.webglSupport ? 10 : 0) + (snapshot.javascriptEnabled ? 12 : 0) + (snapshot.serviceWorker ? 8 : 0) + (snapshot.localStorage ? 8 : 0) + (snapshot.connectionType !== 'unknown' ? 6 : 0),
  );
  const privacyScore = toScore(45 + (snapshot.doNotTrack === '1' ? 20 : 0) + (snapshot.cookiesEnabled ? 10 : 0) + (snapshot.notificationPermission === 'denied' ? 8 : 0) + (snapshot.localStorage ? 8 : 0) + (snapshot.reducedMotion ? 9 : 0));
  const compatibilityScore = toScore(35 + (snapshot.canvasSupport ? 18 : 0) + (snapshot.webrtcSupport ? 15 : 0) + (snapshot.mediaDevicesSupport ? 16 : 0) + (snapshot.serviceWorker ? 10 : 0) + (snapshot.browserName !== 'Unknown' ? 6 : 0));

  let riskRating: AssessmentReport['riskRating'] = 'Excellent';
  if (browserSecurityScore < 70) riskRating = 'Moderate';
  if (browserSecurityScore < 50) riskRating = 'Poor';
  if (browserSecurityScore >= 85) riskRating = 'Excellent';
  else if (browserSecurityScore >= 70) riskRating = 'Good';

  const findings = [
    snapshot.cookiesEnabled ? 'Cookies are enabled for session continuity.' : 'Cookies are disabled, which can reduce browser-level continuity.',
    snapshot.clipboardSupport ? 'Clipboard access is available in this browser context.' : 'Clipboard access is unavailable in this environment.',
    snapshot.webglSupport ? 'Hardware acceleration is available.' : 'Hardware acceleration is unavailable.',
    snapshot.notificationPermission === 'denied' ? 'Notifications are denied, which limits inline alerts.' : 'Notifications are available for guided prompts.',
  ];

  return {
    checks,
    browserSecurityScore,
    privacyScore,
    compatibilityScore,
    riskRating,
    findings,
  };
}

export function createAssessmentProgress(totalChecks: number): AssessmentProgress {
  return {
    currentCheck: assessmentSteps[0],
    completedChecks: 0,
    remainingChecks: totalChecks,
    estimatedTimeRemaining: 8,
    progress: 0,
  };
}
