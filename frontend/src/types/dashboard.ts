import type { PermissionCapability } from '../types';

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

export type RiskLevel = 'Excellent' | 'Good' | 'Moderate' | 'High' | 'Critical';

export type Tone = 'good' | 'info' | 'warn' | 'bad';

export type EnterpriseMetric = {
  label: string;
  value: number;
  sublabel: string;
  tone: Tone;
};

export type BrowserHealth = {
  security: number;
  privacy: number;
  compatibility: number;
  permissions: number;
  notifications: number;
  quickSummary: string;
};

export type PermissionOverviewData = {
  byState: Record<'granted' | 'prompt' | 'denied' | 'unavailable', number>;
  permissionScore: number;
};

export type TimelineStage = {
  id: string;
  index: number;
  title: string;
  value: number;
  timestamp: string;
};

export type RecentAssessmentEntry = {
  id: string;
  date: string;
  score: number;
  risk: RiskLevel;
};

export type ThreatFinding = {
  title: string;
  severity: 'critical' | 'warning' | 'recommendation' | 'passed';
  description: string;
  action: string;
};

export type AIRecommendationItem = {
  title: string;
  recommendation: string;
  severity: 'critical' | 'warning' | 'recommendation' | 'passed';
};

export type QuickActionItem = {
  id: string;
  label: string;
  desc: string;
  // lucide icon component type is intentionally left as unknown to avoid coupling;
  // UI components will import icons locally.
  icon: unknown;
  onClick: () => void;
};

export type DashboardViewModel = {
  executiveScore: number | null;
  riskLevel: RiskLevel | null;
  executiveMetrics: EnterpriseMetric[];
  browserHealth: BrowserHealth | null;
  permissionOverview: PermissionOverviewData | null;
  timeline: TimelineStage[];
  recentHistory: RecentAssessmentEntry[];
  threatAndFindings: ThreatFinding[];
  aiRecommendations: AIRecommendationItem[];
  quickActions: QuickActionItem[];
  // original report view model pieces needed by existing components
  reportViewModel: {
    assessmentId: string;
    timestamp: string;
    overview: Array<{ subject: string; score: number }>;
    capabilities: Array<{ name: string; value: number }>;
    permissions: Array<{ name: string; value: number }>;
    stages: Array<{ name: string; value: number }>;
    score: number;
    risk: RiskLevel;
    findings: ThreatFinding[];
    aiSummary: string;
  } | null;
  capabilities: PermissionCapability[];
};

