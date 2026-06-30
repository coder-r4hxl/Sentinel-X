import type { AssessmentReport, BrowserSnapshot } from '../../types';
import type { BrowserHealth, RiskLevel } from '../../types/dashboard';

import type { ReportViewModel } from './dashboardViewModel';

export function buildBrowserHealth(args: {
  report: AssessmentReport | null;
  snapshot: BrowserSnapshot | null;
  riskLevel: RiskLevel | null;
  viewModel: ReportViewModel | null;
}): BrowserHealth | null {
  const { report, snapshot, riskLevel, viewModel } = args;
  if (!report || !snapshot || !viewModel) return null;

  const notifScore =
    snapshot.notificationPermission === 'denied'
      ? 65
      : snapshot.notificationPermission === 'prompt'
        ? 80
        : 92;

  const permBase = viewModel.permissions.find((p) => p.name === 'Denied')?.value ?? 1;
  const permissionHealth = 100 - permBase * 18;

  return {
    security: report.browserSecurityScore ?? 0,
    privacy: report.privacyScore ?? 0,
    compatibility: report.compatibilityScore ?? 0,
    permissions: Math.max(0, Math.min(100, permissionHealth)),
    notifications: notifScore,
    quickSummary:
      riskLevel === 'Excellent'
        ? 'Enterprise-ready browser posture'
        : riskLevel === 'Good'
          ? 'Generally healthy posture with minor gaps'
          : riskLevel === 'Moderate'
            ? 'Mixed posture: prioritize hardening'
            : riskLevel === 'High'
              ? 'Elevated risk: address critical permission signals'
              : 'Critical posture: immediate remediation recommended',
  };
}

