import type { AIRecommendationItem } from '../../types/dashboard';
import type { ReportViewModel } from './dashboardViewModel';

export function buildAIRecommendations(args: {
  viewModel: ReportViewModel | null;
}): AIRecommendationItem[] {
  const { viewModel } = args;

  if (!viewModel) return [];

  const recs = viewModel.findings
    .filter(
      (f) =>
        f.severity === 'critical' ||
        f.severity === 'warning' ||
        f.severity === 'recommendation'
    )
    .slice(0, 6)
    .map((f) => ({
      title: f.title,
      recommendation: f.action,
      severity: f.severity,
    }));

  if (!recs.length) {
    return [
      {
        title: 'Maintain strong posture',
        recommendation:
          'Continue monitoring browser permissions and keep the browser runtime and extensions updated.',
        severity: 'passed',
      },
    ];
  }

  return recs;
}