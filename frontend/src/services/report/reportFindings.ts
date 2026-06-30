import type { AssessmentReport, BrowserSnapshot } from '../../types';
import type { Finding } from './reportTypes';

export function buildFindings(args: {
  report: AssessmentReport;
  snapshot: BrowserSnapshot;
}): Finding[] {
  const { report, snapshot } = args;

  return [
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
}

