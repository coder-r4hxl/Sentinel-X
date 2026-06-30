import type { AssessmentReport, BrowserSnapshot } from '../../types';
import type { ReportViewModel } from './reportTypes';

export function buildOverview(args: {
  report: AssessmentReport;
  snapshot: BrowserSnapshot;
  summaryCards: ReportViewModel['summaryCards'];
}): ReportViewModel['overview'] {
  const { report, summaryCards } = args;

  return [
    { subject: 'Security', score: report.browserSecurityScore },
    { subject: 'Privacy', score: report.privacyScore },
    { subject: 'Compatibility', score: report.compatibilityScore },
    { subject: 'Performance', score: summaryCards[3].score },
    { subject: 'Permissions', score: summaryCards[4].score },
  ];
}

