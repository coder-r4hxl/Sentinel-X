import type { AssessmentReport, BrowserSnapshot } from '../../types';

export function buildAiSummary(args: { report: AssessmentReport; snapshot: BrowserSnapshot; overallScore: number }): string {
  const { report, snapshot, overallScore } = args;

  return `Your browser demonstrates ${overallScore >= 75 ? 'strong' : 'mixed'} compatibility and ${report.privacyScore >= 70 ? 'good' : 'moderate'} privacy posture. ${snapshot.notificationPermission === 'denied' ? 'Two permissions were denied, slightly reducing functionality.' : 'Required permissions are available for the assessment workflow.'} ${report.browserSecurityScore >= 75 ? 'No major security concerns were detected.' : 'A few browser-level issues should be reviewed.'}`;
}

