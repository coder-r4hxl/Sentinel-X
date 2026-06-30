import type { AssessmentReport, BrowserSnapshot } from '../../types';
import type { DashboardViewModel } from '../../types/dashboard';
import type { PermissionCapability } from '../../types';


import type { ReportViewModel as ReportVM } from '../report/reportViewModel';
import { buildReportViewModel } from '../reportService';
import { buildExecutiveMetrics } from './dashboardExecutiveMetrics';
import { computeOverallRisk } from './dashboardRisk';
import { buildBrowserHealth } from './dashboardBrowserHealth';
import { buildPermissionOverview } from './dashboardPermissionOverview';
import { makeTimeline } from './dashboardTimeline';
import { buildRecentHistory } from './dashboardRecentHistory';
import { buildThreatAndFindings } from './dashboardThreats';
import { buildAIRecommendations } from './dashboardRecommendations';
import { buildQuickActions } from './dashboardQuickActions';

export type ReportViewModel = ReportVM;

export function buildDashboardViewModel(args: {
  report: AssessmentReport | null;
  snapshot: BrowserSnapshot | null;
  capabilities: PermissionCapability[];
  evaluated: boolean;
  navigate: (to: string) => void;
}): DashboardViewModel {
  const { report, snapshot, capabilities, evaluated, navigate } = args;

  if (!report || !snapshot) {
    return {
      executiveScore: null,
      riskLevel: null,
      executiveMetrics: [],
      browserHealth: null,
      permissionOverview: null,
      timeline: [],
      recentHistory: [],
      threatAndFindings: [],
      aiRecommendations: [],
      quickActions: buildQuickActions({ viewModel: null, navigate }),
      reportViewModel: null,
      capabilities,
    };
  }

  const viewModel = buildReportViewModel(report, snapshot);

  const executiveScore = viewModel.score;
  const riskLevel = computeOverallRisk(executiveScore);

  const executiveMetrics = buildExecutiveMetrics({ report, viewModel, executiveScore });
  const browserHealth = buildBrowserHealth({ report, snapshot, riskLevel, viewModel });
  const permissionOverview = buildPermissionOverview({ evaluated, capabilities });

  const timeline = makeTimeline(viewModel.stages);

  const recentHistory = buildRecentHistory({ viewModel });
  const threatAndFindings = buildThreatAndFindings({ viewModel });
  const aiRecommendations = buildAIRecommendations({ viewModel });
  const quickActions = buildQuickActions({ viewModel, navigate });

  return {
    executiveScore,
    riskLevel,
    executiveMetrics,
    browserHealth,
    permissionOverview,
    timeline,
    recentHistory,
    threatAndFindings,
    aiRecommendations,
    quickActions,
    reportViewModel: {
      assessmentId: viewModel.assessmentId,
      timestamp: viewModel.timestamp,
      overview: viewModel.overview,
      capabilities: viewModel.capabilities,
      permissions: viewModel.permissions,
      stages: viewModel.stages,
      score: viewModel.score,
      risk: viewModel.risk,
      findings: viewModel.findings,
      aiSummary: viewModel.aiSummary,
    },
    capabilities,
  };
}

