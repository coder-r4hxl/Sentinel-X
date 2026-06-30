import type { AssessmentReport, BrowserSnapshot } from '../../types';

export type RiskLevel = 'Excellent' | 'Good' | 'Moderate' | 'High' | 'Critical';

export type ReportOverview = Array<{ subject: string; score: number }>;
export type SummaryCard = { label: string; score: number; status: string; detail: string };
export type FindingSeverity = 'critical' | 'warning' | 'recommendation' | 'passed';
export type Finding = {
  title: string;
  severity: FindingSeverity;
  description: string;
  action: string;
};
export type CapabilityPoint = { name: string; value: number };
export type PermissionPoint = { name: string; value: number };
export type StagePoint = { name: string; value: number };
export type SystemInfoSection = { title: string; items: Array<{ label: string; value: string }> };

export type ReportViewModel = {
  assessmentId: string;
  timestamp: string;
  browser: string;
  os: string;
  score: number;
  risk: RiskLevel;
  overview: ReportOverview;
  summaryCards: SummaryCard[];
  findings: Finding[];
  capabilities: CapabilityPoint[];
  permissions: PermissionPoint[];
  stages: StagePoint[];
  systemInfo: SystemInfoSection[];
  aiSummary: string;
};

// Small helpers to keep imports consistent in other report modules.
export type ReportInput = { report: AssessmentReport; snapshot: BrowserSnapshot };

