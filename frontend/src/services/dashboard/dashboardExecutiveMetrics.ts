import type { AssessmentReport } from '../../types';
import type { EnterpriseMetric } from '../../types/dashboard';
import type { ReportViewModel } from './dashboardViewModel';
import { scoreTone } from './dashboardRisk';

export function buildExecutiveMetrics(args: {
  report: AssessmentReport | null;
  viewModel: ReportViewModel | null;
  executiveScore: number | null;
}): EnterpriseMetric[] {
  const { report, viewModel, executiveScore } = args;

  if (!report || !viewModel) return [];

  const score = viewModel.score ?? executiveScore ?? 0;

  return [
    {
      label: 'Executive Security Score',
      value: score,
      sublabel: 'Overall readiness for enterprise rollout',
      tone: scoreTone(score),
    },
    {
      label: 'Browser Health',
      value: report.browserSecurityScore,
      sublabel: 'Runtime posture & integrity checks',
      tone: scoreTone(report.browserSecurityScore),
    },
    {
      label: 'Privacy Posture',
      value: report.privacyScore,
      sublabel: 'Controls, preference signals, & permission posture',
      tone: scoreTone(report.privacyScore),
    },
    {
      label: 'Compatibility Coverage',
      value: report.compatibilityScore,
      sublabel: 'API support & environment compatibility',
      tone: scoreTone(report.compatibilityScore),
    },
  ];
}