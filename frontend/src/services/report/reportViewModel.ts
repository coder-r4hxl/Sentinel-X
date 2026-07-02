import type { AssessmentReport, BrowserSnapshot } from '../../types';
import { buildAiSummary } from './reportAISummary';
import { computeOverallScore, computeRisk, computeSummaryCards } from './reportScoreRisk';
import { buildFindings } from './reportFindings';
import { buildOverview } from './reportOverview';
import { buildCapabilities, buildPermissions, buildStages } from './reportSignals';
import { buildSystemInfo } from './reportRuntimeSystemInfo';
import type { ReportViewModel } from './reportTypes';

export function buildReportViewModel(args: { report: AssessmentReport; snapshot: BrowserSnapshot }): ReportViewModel {
  const { report, snapshot } = args;

  const overallScore = computeOverallScore(report);
  const risk = computeRisk(overallScore);

  const summaryCards = computeSummaryCards({ report, snapshot });
  const overview = buildOverview({ report, snapshot, summaryCards });
  const findings = buildFindings({ report, snapshot });

  const capabilities = buildCapabilities(snapshot);
  const permissions = buildPermissions();
  const stages = buildStages();
  const systemInfo = buildSystemInfo(snapshot);

  const aiSummary = buildAiSummary({ report, snapshot, overallScore });

  return {
    assessmentId: `SENT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    timestamp: new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
    browser: snapshot.browserName,
    os: snapshot.operatingSystem,
    score: overallScore,
    risk,
    overview,
    summaryCards,
    findings,
    capabilities,
    permissions,
    stages,
    systemInfo,
    aiSummary,
  };
}

 
export type { ReportViewModel } from './reportTypes';
 

