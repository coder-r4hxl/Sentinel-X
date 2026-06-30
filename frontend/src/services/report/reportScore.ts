import type { AssessmentReport } from '../../types';

export type RiskRating = AssessmentReport['riskRating'];

export function computeOverallScore(report: AssessmentReport): number {
  return Math.round((report.browserSecurityScore + report.privacyScore + report.compatibilityScore) / 3);
}

export function computeRisk(score: number): RiskRating {
  // Report view-model expects broader risk bands, but AssessmentReport riskRating type is limited.
  // Preserve runtime behavior while matching the narrower RiskRating union.
  return score >= 90
    ? 'Excellent'
    : score >= 78
      ? 'Good'
      : score >= 62
        ? 'Moderate'
        : 'Poor';
}



