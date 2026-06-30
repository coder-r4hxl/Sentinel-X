import type { AssessmentReport, BrowserSnapshot } from '../../types';
import type { ReportViewModel, RiskLevel } from './reportTypes';

export function computeOverallScore(report: AssessmentReport): number {
  return Math.round((report.browserSecurityScore + report.privacyScore + report.compatibilityScore) / 3);
}

export function computeRisk(overallScore: number): RiskLevel {
  return overallScore >= 90
    ? 'Excellent'
    : overallScore >= 78
      ? 'Good'
      : overallScore >= 62
        ? 'Moderate'
        : overallScore >= 45
          ? 'High'
          : 'Critical';
}

export function computeSummaryCards(args: {
  report: AssessmentReport;
  snapshot: BrowserSnapshot;
}): ReportViewModel['summaryCards'] {
  const { report, snapshot } = args;

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
        Math.round(
          (snapshot.webglSupport ? 20 : 0) +
            (snapshot.serviceWorker ? 20 : 0) +
            30 +
            (snapshot.online ? 15 : 0) +
            (snapshot.connectionDownlink ? 15 : 0)
        )
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

