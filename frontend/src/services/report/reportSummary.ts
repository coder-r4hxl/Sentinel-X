import type { AssessmentReport, BrowserSnapshot } from '../../types';

export type SummaryCard = ReportViewModel['summaryCards'][number];

type ReportViewModel = {
  summaryCards: Array<{ label: string; score: number; status: string; detail: string }>;
};

export function buildSummaryCards(report: AssessmentReport, snapshot: BrowserSnapshot): SummaryCard[] {
  return [
    {
      label: 'Browser Security',
      score: report.browserSecurityScore,
      status: report.browserSecurityScore >= 80 ? 'Strong' : 'Needs attention',
      detail: 'Browser posture and runtime integrity.',
    },
    {
      label: 'Privacy',
      score: report.privacyScore,
      status: report.privacyScore >= 75 ? 'Protected' : 'Watchlist',
      detail: 'Privacy controls and data handling.',
    },
    {
      label: 'Compatibility',
      score: report.compatibilityScore,
      status: report.compatibilityScore >= 80 ? 'Stable' : 'Mixed',
      detail: 'Platform and API support coverage.',
    },
    {
      label: 'Performance',
      score: Math.min(
        100,
        Math.round((snapshot.webglSupport ? 20 : 0) + (snapshot.serviceWorker ? 20 : 0) + 30 + (snapshot.online ? 15 : 0) + (snapshot.connectionDownlink ? 15 : 0))
      ),
      status: 'Healthy',
      detail: 'Runtime performance and responsiveness.',
    },
    {
      label: 'Permissions',
      score:
        100 -
        (snapshot.notificationPermission === 'denied' ? 12 : 0) -
        (snapshot.cameraSupport && snapshot.notificationPermission === 'prompt' ? 5 : 0),
      status: 'Managed',
      detail: 'Grant status and browser access control.',
    },
  ];
}

