import type { ThreatFinding } from '../../types/dashboard';
import type { ReportViewModel } from './dashboardViewModel';

export function buildThreatAndFindings(args: {
  viewModel: ReportViewModel | null;
}): ThreatFinding[] {
  const { viewModel } = args;

  if (!viewModel) return [];

  return viewModel.findings;
}