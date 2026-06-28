import type { AssessmentReport, BrowserSnapshot } from '../types';

export interface ReportViewModel {
  assessmentId: string;
  timestamp: string;
  browser: string;
  os: string;
  score: number;
  risk: 'Excellent' | 'Good' | 'Moderate' | 'High' | 'Critical';
  overview: Array<{ subject: string; score: number }>;
  summaryCards: Array<{ label: string; score: number; status: string; detail: string }>;
  findings: Array<{ title: string; severity: 'critical' | 'warning' | 'recommendation' | 'passed'; description: string; action: string }>;
  capabilities: Array<{ name: string; value: number }>;
  permissions: Array<{ name: string; value: number }>;
  stages: Array<{ name: string; value: number }>;
  systemInfo: Array<{ title: string; items: Array<{ label: string; value: string }> }>;
  aiSummary: string;
}

export function buildReportViewModel(report: AssessmentReport, snapshot: BrowserSnapshot): ReportViewModel {
  const overallScore = Math.round((report.browserSecurityScore + report.privacyScore + report.compatibilityScore) / 3);
  const risk = overallScore >= 90 ? 'Excellent' : overallScore >= 78 ? 'Good' : overallScore >= 62 ? 'Moderate' : overallScore >= 45 ? 'High' : 'Critical';

  const summaryCards = [
    { label: 'Browser Security', score: report.browserSecurityScore, status: report.browserSecurityScore >= 80 ? 'Strong' : 'Needs attention', detail: 'Browser posture and runtime integrity.' },
    { label: 'Privacy', score: report.privacyScore, status: report.privacyScore >= 75 ? 'Protected' : 'Watchlist', detail: 'Privacy controls and data handling.' },
    { label: 'Compatibility', score: report.compatibilityScore, status: report.compatibilityScore >= 80 ? 'Stable' : 'Mixed', detail: 'Platform and API support coverage.' },
    { label: 'Performance', score: Math.min(100, Math.round((snapshot.webglSupport ? 20 : 0) + (snapshot.serviceWorker ? 20 : 0) + 30 + (snapshot.online ? 15 : 0) + (snapshot.connectionDownlink ? 15 : 0))), status: 'Healthy', detail: 'Runtime performance and responsiveness.' },
    { label: 'Permissions', score: 100 - (snapshot.notificationPermission === 'denied' ? 12 : 0) - (snapshot.cameraSupport && snapshot.notificationPermission === 'prompt' ? 5 : 0), status: 'Managed', detail: 'Grant status and browser access control.' },
  ];

  const findings = [
    ...(report.browserSecurityScore < 70
      ? [
          {
            title: 'Security score below target',
            severity: 'critical' as const,
            description: `Browser security scored ${report.browserSecurityScore}/100, which is below the preferred threshold for executive readiness.`,
            action: 'Review extensions, hardening settings, and browser updates to improve the baseline posture.',
          },
        ]
      : []),
    ...(report.privacyScore < 75
      ? [
          {
            title: 'Privacy controls need attention',
            severity: 'warning' as const,
            description: `Privacy posture scored ${report.privacyScore}/100 and should be tightened before broader rollout.`,
            action: 'Reduce tracking exposure and review privacy protections for the current browser profile.',
          },
        ]
      : []),
    ...(snapshot.notificationPermission === 'denied'
      ? [
          {
            title: 'Notifications denied',
            severity: 'warning' as const,
            description: 'Notifications are denied, which may reduce in-session guidance and alert visibility.',
            action: 'Enable notifications for richer prompts and better user communication.',
          },
        ]
      : []),
    ...(!snapshot.clipboardSupport
      ? [
          {
            title: 'Clipboard access unavailable',
            severity: 'recommendation' as const,
            description: 'Clipboard access is not exposed in this browser context.',
            action: 'Allow clipboard access if you want richer in-browser handoff workflows.',
          },
        ]
      : []),
    ...(snapshot.cookiesEnabled
      ? [
          {
            title: 'Cookies are enabled',
            severity: 'passed' as const,
            description: 'Session continuity is available and browser cookies are active.',
            action: 'Maintain the current settings for session stability.',
          },
        ]
      : [
          {
            title: 'Cookies are disabled',
            severity: 'recommendation' as const,
            description: 'Cookies are disabled, which can reduce browser-level continuity.',
            action: 'Re-enable cookies to preserve session continuity where appropriate.',
          },
        ]),
    ...(snapshot.webglSupport
      ? [
          {
            title: 'Hardware acceleration available',
            severity: 'passed' as const,
            description: 'The browser supports hardware acceleration and rendering performance is healthy.',
            action: 'Maintain current settings to preserve compatibility and responsiveness.',
          },
        ]
      : [
          {
            title: 'Hardware acceleration unavailable',
            severity: 'recommendation' as const,
            description: 'The browser is missing hardware acceleration support, which may reduce performance.',
            action: 'Use a current browser build or enable acceleration where supported.',
          },
        ]),
  ];

  const overview = [
    { subject: 'Security', score: report.browserSecurityScore },
    { subject: 'Privacy', score: report.privacyScore },
    { subject: 'Compatibility', score: report.compatibilityScore },
    { subject: 'Performance', score: summaryCards[3].score },
    { subject: 'Permissions', score: summaryCards[4].score },
  ];

  const capabilities = [
    { name: 'WebGL', value: snapshot.webglSupport ? 1 : 0 },
    { name: 'Canvas', value: snapshot.canvasSupport ? 1 : 0 },
    { name: 'WebRTC', value: snapshot.webrtcSupport ? 1 : 0 },
    { name: 'Service Worker', value: snapshot.serviceWorker ? 1 : 0 },
    { name: 'Storage', value: snapshot.localStorage ? 1 : 0 },
  ];

  const permissions = [
    { name: 'Granted', value: 2 },
    { name: 'Prompt', value: 2 },
    { name: 'Denied', value: 1 },
  ];

  const stages = [
    { name: 'Boot', value: 100 },
    { name: 'Identity', value: 100 },
    { name: 'Permissions', value: 85 },
    { name: 'Assessment', value: 100 },
    { name: 'Report', value: 100 },
  ];

  const systemInfo = [
    {
      title: 'Browser',
      items: [
        { label: 'Browser', value: snapshot.browserName },
        { label: 'Version', value: snapshot.browserVersion },
        { label: 'Language', value: snapshot.language },
        { label: 'Timezone', value: snapshot.timezone },
      ],
    },
    {
      title: 'OS',
      items: [
        { label: 'Operating system', value: snapshot.operatingSystem },
        { label: 'Platform', value: snapshot.platform },
        { label: 'User Agent', value: snapshot.userAgent.slice(0, 80) },
      ],
    },
    {
      title: 'Network',
      items: [
        { label: 'Online', value: snapshot.online ? 'Yes' : 'No' },
        { label: 'Connection', value: snapshot.connectionType },
        { label: 'Downlink', value: `${snapshot.connectionDownlink ?? 'unknown'} Mb/s` },
        { label: 'RTT', value: `${snapshot.connectionRtt ?? 'unknown'} ms` },
      ],
    },
    {
      title: 'Display',
      items: [
        { label: 'Resolution', value: snapshot.screenResolution },
        { label: 'Color depth', value: `${snapshot.colorDepth}` },
        { label: 'Pixel ratio', value: `${snapshot.pixelRatio}` },
        { label: 'Dark mode', value: snapshot.darkMode ? 'Enabled' : 'Disabled' },
      ],
    },
    {
      title: 'Storage',
      items: [
        { label: 'Local storage', value: snapshot.localStorage ? 'Available' : 'Unavailable' },
        { label: 'Session storage', value: snapshot.sessionStorage ? 'Available' : 'Unavailable' },
        { label: 'IndexedDB', value: snapshot.indexedDB ? 'Supported' : 'Unsupported' },
        { label: 'Service Worker', value: snapshot.serviceWorker ? 'Supported' : 'Unsupported' },
      ],
    },
    {
      title: 'Permissions',
      items: [
        { label: 'Notifications', value: snapshot.notificationPermission },
        { label: 'Clipboard', value: snapshot.clipboardSupport ? 'Supported' : 'Unsupported' },
        { label: 'Camera', value: snapshot.cameraSupport ? 'Supported' : 'Unsupported' },
        { label: 'Microphone', value: snapshot.microphoneSupport ? 'Supported' : 'Unsupported' },
      ],
    },
    {
      title: 'Hardware',
      items: [
        { label: 'Hardware concurrency', value: `${snapshot.hardwareConcurrency}` },
        { label: 'Device memory', value: snapshot.deviceMemory ? `${snapshot.deviceMemory} GB` : 'Unavailable' },
        { label: 'Touch support', value: snapshot.touchSupport ? 'Yes' : 'No' },
      ],
    },
    {
      title: 'Media',
      items: [
        { label: 'Media devices', value: snapshot.mediaDevicesSupport ? 'Available' : 'Unavailable' },
        { label: 'WebGL', value: snapshot.webglSupport ? 'Supported' : 'Unsupported' },
        { label: 'Canvas', value: snapshot.canvasSupport ? 'Supported' : 'Unsupported' },
        { label: 'WebRTC', value: snapshot.webrtcSupport ? 'Supported' : 'Unsupported' },
      ],
    },
    {
      title: 'Experimental APIs',
      items: [
        { label: 'Battery API', value: snapshot.batterySupport ? 'Supported' : 'Unsupported' },
        { label: 'Bluetooth', value: snapshot.bluetoothSupport ? 'Supported' : 'Unsupported' },
        { label: 'USB', value: snapshot.usbSupport ? 'Supported' : 'Unsupported' },
        { label: 'PWA', value: snapshot.installedPwa ? 'Installed' : 'Not installed' },
      ],
    },
  ];

  const aiSummary = `Your browser demonstrates ${overallScore >= 75 ? 'strong' : 'mixed'} compatibility and ${report.privacyScore >= 70 ? 'good' : 'moderate'} privacy posture. ${snapshot.notificationPermission === 'denied' ? 'Two permissions were denied, slightly reducing functionality.' : 'Required permissions are available for the assessment workflow.'} ${report.browserSecurityScore >= 75 ? 'No major security concerns were detected.' : 'A few browser-level issues should be reviewed.'}`;

  return {
    assessmentId: `SENT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
    browser: snapshot.browserName,
    os: snapshot.operatingSystem,
    score: overallScore,
    risk,
    overview,
    summaryCards,
    findings,
    capabilities,
    permissions,
    stages,
    systemInfo,
    aiSummary,
  };
}
