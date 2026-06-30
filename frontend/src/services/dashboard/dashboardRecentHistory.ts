import type { RecentAssessmentEntry } from '../../types/dashboard';
import type { ReportViewModel } from './dashboardViewModel';

export function buildRecentHistory(args: { viewModel: ReportViewModel | null }): RecentAssessmentEntry[] {
  const { viewModel } = args;
  if (!viewModel) return [];

  const base = {
    id: viewModel.assessmentId,
    date: viewModel.timestamp,
    score: viewModel.score,
    risk: viewModel.risk,
  } satisfies RecentAssessmentEntry;

  return [base];
}


