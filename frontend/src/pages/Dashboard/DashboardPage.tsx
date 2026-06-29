import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Gauge,
  Globe,
  Shield,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  TriangleAlert,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  useAssessmentStore,
} from '@/store/assessmentStore';
import { usePermissionStore } from '@/store/permissionStore';
import { detectBrowserInfo } from '@/services/browserService';
import { buildReportViewModel } from '@/services/reportService';
import { ReportCharts } from '@/components/report/charts/ReportCharts';
import { ReportFindings } from '@/components/report/findings/ReportFindings';

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

type RiskLevel = 'Excellent' | 'Good' | 'Moderate' | 'High' | 'Critical';

type EnterpriseMetric = {
  label: string;
  value: number;
  sublabel: string;
  tone: 'good' | 'info' | 'warn' | 'bad';
};

function scoreTone(score: number) {
  if (score >= 85) return 'good';
  if (score >= 70) return 'info';
  if (score >= 50) return 'warn';
  return 'bad';
}

function toneStyles(tone: EnterpriseMetric['tone']) {
  switch (tone) {
    case 'good':
      return {
        pillBg: 'border-[#14F195]/20 bg-[#14F195]/10 text-[#14F195]',
        bar: 'from-[#14F195] via-[#00B8FF] to-[#14F195]',
        icon: 'text-[#14F195]',
      };
    case 'info':
      return {
        pillBg: 'border-[#00B8FF]/20 bg-[#00B8FF]/10 text-[#00B8FF]',
        bar: 'from-[#00B8FF] via-[#2dc8ff] to-[#00B8FF]',
        icon: 'text-[#00B8FF]',
      };
    case 'warn':
      return {
        pillBg: 'border-[#f5c76b]/20 bg-[#f5c76b]/10 text-[#f5c76b]',
        bar: 'from-[#f5c76b] via-[#00B8FF] to-[#f5c76b]',
        icon: 'text-[#f5c76b]',
      };
    default:
      return {
        pillBg: 'border-[#ff7a59]/20 bg-[#ff7a59]/10 text-[#ff7a59]',
        bar: 'from-[#ff7a59] via-[#00B8FF] to-[#ff7a59]',
        icon: 'text-[#ff7a59]',
      };
  }
}

function computeOverallRisk(score: number): RiskLevel {
  if (score >= 90) return 'Excellent';
  if (score >= 78) return 'Good';
  if (score >= 62) return 'Moderate';
  if (score >= 45) return 'High';
  return 'Critical';
}

function riskTone(level: RiskLevel) {
  switch (level) {
    case 'Excellent':
      return {
        pillBg: 'border-[#14F195]/20 bg-[#14F195]/10 text-[#14F195]',
        icon: 'text-[#14F195]',
      };
    case 'Good':
      return {
        pillBg: 'border-[#00B8FF]/20 bg-[#00B8FF]/10 text-[#00B8FF]',
        icon: 'text-[#00B8FF]',
      };
    case 'Moderate':
      return {
        pillBg: 'border-[#f5c76b]/20 bg-[#f5c76b]/10 text-[#f5c76b]',
        icon: 'text-[#f5c76b]',
      };
    case 'High':
      return {
        pillBg: 'border-[#ff7a59]/20 bg-[#ff7a59]/10 text-[#ff7a59]',
        icon: 'text-[#ff7a59]',
      };
    default:
      return {
        pillBg: 'border-[#ff7a59]/30 bg-[#ff7a59]/15 text-[#ff7a59]',
        icon: 'text-[#ff7a59]',
      };
  }
}

function fmtPct(n: number) {
  return `${Math.round(n)}%`;
}

function makeTimeline(stages: Array<{ name: string; value: number }>) {
  // Convert stages into a timeline-friendly series.
  // If we only have static stages, we still render them as an ordered audit trail.
  return stages.map((s, idx) => ({
    id: s.name,
    index: idx,
    title: s.name,
    value: s.value,
    timestamp: `T+${idx + 1}m`,
  }));
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { status: assessmentStatus, progress, report } = useAssessmentStore();
  const { capabilities, evaluated, loadCapabilities, loading: permissionsLoading } = usePermissionStore();

  const [loadStatus, setLoadStatus] = useState<LoadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const snapshot = useMemo(() => {
    try {
      return detectBrowserInfo();
    } catch {
      // detectBrowserInfo relies on browser APIs, may fail in some contexts.
      return null;
    }
  }, []);

  const viewModel = useMemo(() => {
    if (!report || !snapshot) return null;
    return buildReportViewModel(report, snapshot);
  }, [report, snapshot]);

  const executiveScore: number | null = viewModel ? viewModel.score : null;
  const riskLevel: RiskLevel | null = executiveScore != null ? computeOverallRisk(executiveScore) : null;

  const executiveMetrics: EnterpriseMetric[] = useMemo(() => {
    if (!report || !snapshot) return [];
    const score = viewModel?.score ?? executiveScore ?? 0;
    return [
      {
        label: 'Executive Security Score',
        value: score,
        sublabel: 'Overall readiness for enterprise rollout',
        tone: scoreTone(score) as EnterpriseMetric['tone'],
      },
      {
        label: 'Browser Health',
        value: report.browserSecurityScore,
        sublabel: 'Runtime posture & integrity checks',
        tone: scoreTone(report.browserSecurityScore) as EnterpriseMetric['tone'],
      },
      {
        label: 'Privacy Posture',
        value: report.privacyScore,
        sublabel: 'Controls, preference signals, & permission posture',
        tone: scoreTone(report.privacyScore) as EnterpriseMetric['tone'],
      },
      {
        label: 'Compatibility Coverage',
        value: report.compatibilityScore,
        sublabel: 'API support & environment compatibility',
        tone: scoreTone(report.compatibilityScore) as EnterpriseMetric['tone'],
      },
    ];
  }, [report, snapshot, viewModel, executiveScore]);

  const browserHealth = useMemo(() => {
    if (!viewModel || !snapshot) return null;

    // Approximate a browser health overview derived from report view model.
    const notifScore = snapshot.notificationPermission === 'denied' ? 65 : snapshot.notificationPermission === 'prompt' ? 80 : 92;
    const permBase = viewModel.permissions.find((p) => p.name === 'Denied')?.value ?? 1;
    const permissionHealth = 100 - permBase * 18;

    const health = {
      security: report?.browserSecurityScore ?? 0,
      privacy: report?.privacyScore ?? 0,
      compatibility: report?.compatibilityScore ?? 0,
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

    return health;
  }, [viewModel, snapshot, report, riskLevel]);

  const permissionOverview = useMemo(() => {
    if (!evaluated || !capabilities.length) return null;

    const normalize = (s: string) => s.toLowerCase();

    const byState = {
      granted: capabilities.filter((c) => normalize(c.state) === 'granted').length,
      prompt: capabilities.filter((c) => normalize(c.state) === 'prompt').length,
      denied: capabilities.filter((c) => normalize(c.state) === 'denied').length,
      unavailable: capabilities.filter((c) => normalize(c.state) === 'unavailable').length,
    };

    const total = Math.max(1, capabilities.length);
    const permissionScore = Math.round(((byState.granted * 1 + byState.prompt * 0.6) / total) * 100);

    return {
      byState,
      permissionScore,
    };
  }, [capabilities, evaluated]);

  const timeline = useMemo(() => {
    if (!viewModel) return [];
    return makeTimeline(viewModel.stages);
  }, [viewModel]);

  const recentHistory = useMemo(() => {
    // Without a persistence layer, we present the last known assessment as a single entry.
    if (!viewModel) return [];
    const base = {
      id: viewModel.assessmentId,
      date: viewModel.timestamp,
      score: viewModel.score,
      risk: viewModel.risk,
    };
    return [base];
  }, [viewModel]);

  const threatAndFindings = useMemo(() => {
    if (!viewModel) return [];
    return viewModel.findings;
  }, [viewModel]);

  const aiRecommendations = useMemo(() => {
    if (!viewModel) return [];

    // Derive recommendations from findings for consistency.
    const recs = viewModel.findings
      .filter((f) => f.severity === 'critical' || f.severity === 'warning' || f.severity === 'recommendation')
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
          recommendation: 'Continue monitoring browser permissions and keep the browser runtime and extensions updated.',
          severity: 'passed' as const,
        },
      ];
    }

    return recs;
  }, [viewModel]);

  const quickActions = useMemo(() => {
    if (!viewModel) {
      return [
        {
          id: 'start-assessment',
          label: 'Run assessment',
          desc: 'Generate enterprise-ready report artifacts',
          icon: ShieldCheck,
          onClick: () => navigate('/assessment'),
        },
      ];
    }

    return [
      {
        id: 'open-report',
        label: 'Open executive report',
        desc: 'View full findings and system snapshot',
        icon: ExternalLink,
        onClick: () => navigate('/report'),
      },
      {
        id: 'review-permissions',
        label: 'Review permissions',
        desc: 'Validate required access and states',
        icon: Globe,
        onClick: () => navigate('/permission'),
      },
      {
        id: 'start-new-assessment',
        label: 'Re-run assessment',
        desc: 'Refresh the dashboard with current posture',
        icon: Shield,
        onClick: () => navigate('/assessment'),
      },
    ];
  }, [navigate, viewModel]);

  useEffect(() => {
    void (async () => {
      setLoadStatus('loading');
      setErrorMessage('');
      try {
        if (!evaluated) {
          await loadCapabilities();
        }
        setLoadStatus('ready');
      } catch (e) {
        setLoadStatus('error');
        setErrorMessage(e instanceof Error ? e.message : 'Unknown error');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = loadStatus === 'loading' || assessmentStatus === 'running' || permissionsLoading;

  const emptyState = !isLoading && !viewModel;

  const overallProgressValue = useMemo(() => {
    if (!report) {
      return progress?.progress ?? 0;
    }
    return 100;
  }, [report, progress]);

  return (
    <div className="min-h-screen bg-[#05070A] px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B1118]/80 px-6 py-6 shadow-[0_24px_120px_rgba(0,0,0,0.45)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,184,255,0.22),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(20,241,149,0.16),transparent_40%)]" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/10 px-3.5 py-1.5 text-sm text-[#8bdbff]">
                <ShieldCheck size={16} />
                Enterprise Dashboard
              </div>
              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Cybersecurity & Browser Posture</h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-300">
                Board-ready visibility across security score, risk posture, browser health, and permissions—backed by your existing assessment engine.
              </p>
            </div>

            <div className="w-full lg:w-[380px]">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#05070A]/40 p-4 backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Executive security score</p>
                    <p className="text-3xl font-semibold text-white">{executiveScore != null ? `${executiveScore}` : '—'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-[#00B8FF]" />
                    <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm font-semibold">
                      {riskLevel ?? '—'}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Progress value={overallProgressValue} />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>{assessmentStatus === 'running' ? progress.currentCheck : viewModel ? 'Assessment complete' : 'Awaiting assessment'}</span>
                  <span>{executiveScore != null ? fmtPct(overallProgressValue) : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4 lg:grid-cols-[1fr_1fr]"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border-white/10 bg-[#0B1118]/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="h-4 w-28 rounded bg-white/10" />
                    <div className="h-9 w-24 rounded bg-white/10" />
                  </div>
                  <div className="mt-4 h-3 w-full rounded bg-white/10" />
                  <div className="mt-3 grid gap-2">
                    <div className="h-10 w-full rounded bg-white/[0.06]" />
                    <div className="h-10 w-full rounded bg-white/[0.06]" />
                  </div>
                </Card>
              ))}
            </motion.div>
          )}

          {emptyState && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-white/10 bg-[#0B1118]/70">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <AlertTriangle className="text-[#f5c76b]" size={20} />
                    No assessment data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Run an assessment to generate the enterprise-ready dashboard. The engine stays local and produces an executive view of your browser posture.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button onClick={() => navigate('/assessment')}>Run assessment <ArrowRight size={16} /></Button>
                    <Button variant="secondary" onClick={() => navigate('/permission')}>
                      Review permission status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {loadStatus === 'error' && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2rem] border border-[#ff7a59]/30 bg-[#0B1118]/70 p-6">
              <div className="flex items-center gap-3">
                <TriangleAlert className="text-[#ff7a59]" size={20} />
                <p className="font-semibold text-white">Dashboard error</p>
              </div>
              <p className="mt-2 text-slate-300">{errorMessage}</p>
              <div className="mt-4">
                <Button variant="secondary" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </motion.div>
          )}

          {!isLoading && viewModel && (
            <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {executiveMetrics.map((m, idx) => {
                      const styles = toneStyles(m.tone);
                      const Icon = idx === 0 ? Gauge : idx === 1 ? ShieldCheck : idx === 2 ? Sparkles : Globe;
                      return (
                        <motion.div
                          key={m.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="rounded-[1.5rem] border border-white/10 bg-[#0B1118]/70 p-5 backdrop-blur"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{m.label}</p>
                              <p className="mt-3 text-3xl font-semibold text-white">{m.value}</p>
                              <p className="mt-2 text-sm leading-7 text-slate-300">{m.sublabel}</p>
                            </div>
                            <div className={`rounded-full border border-white/10 bg-white/[0.03] p-2.5 ${styles.icon}`}>
                              <Icon size={18} />
                            </div>
                          </div>

                          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${m.value}%` }}
                              transition={{ duration: 0.7, ease: 'easeOut' }}
                              className={`h-full rounded-full bg-gradient-to-r ${styles.bar}`}
                            />
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <Badge className={styles.pillBg}>{m.tone.toUpperCase()}</Badge>
                            <span className="text-xs text-slate-400">Updated live</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <Card className="border-white/10 bg-[#0B1118]/70">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-4">
                        <span className="text-white">Browser Health Overview</span>
                        {riskLevel && (
                          <Badge className={riskTone(riskLevel).pillBg}>{riskLevel}</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        {[
                          { label: 'Security', value: browserHealth?.security ?? 0, icon: Shield },
                          { label: 'Privacy', value: browserHealth?.privacy ?? 0, icon: Sparkles },
                          { label: 'Compatibility', value: browserHealth?.compatibility ?? 0, icon: Globe },
                          { label: 'Permissions', value: browserHealth?.permissions ?? 0, icon: ShieldCheck },
                        ].map((x) => {
                          const tone = scoreTone(x.value);
                          const styles = toneStyles(tone);
                          const Icon = x.icon;
                          return (
                            <div key={x.label} className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/40 p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Icon size={16} className={styles.icon} />
                                  <p className="text-sm text-slate-300">{x.label}</p>
                                </div>
                                <Badge className={styles.pillBg}>{x.value}</Badge>
                              </div>
                              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${x.value}%` }}
                                  transition={{ duration: 0.6 }}
                                  className={`h-full rounded-full bg-gradient-to-r ${styles.bar}`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="rounded-[1.25rem] border border-[#00B8FF]/20 bg-[#00B8FF]/10 p-4">
                        <p className="text-sm uppercase tracking-[0.24em] text-[#8bdbff]">Executive note</p>
                        <p className="mt-2 text-lg leading-8 text-slate-200">{browserHealth?.quickSummary}</p>
                      </div>

                      <ReportCharts overview={viewModel.overview} capabilities={viewModel.capabilities} permissions={viewModel.permissions} stages={viewModel.stages} />
                    </CardContent>
                  </Card>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="border-white/10 bg-[#0B1118]/70">
                      <CardHeader>
                        <CardTitle className="text-white">Permission Status Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {permissionOverview ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-sm text-slate-400">Permission score</p>
                                <p className="mt-2 text-3xl font-semibold text-white">{permissionOverview.permissionScore}</p>
                              </div>
                              <Badge className={toneStyles(scoreTone(permissionOverview.permissionScore)).pillBg}>
                                {permissionOverview.permissionScore >= 80 ? 'MANAGED' : permissionOverview.permissionScore >= 60 ? 'WATCHLIST' : 'REMEDIATION'}
                              </Badge>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                              {(
                                [
                                  { key: 'granted', label: 'Granted', tone: 'good' as const },
                                  { key: 'prompt', label: 'Prompt', tone: 'info' as const },
                                  { key: 'denied', label: 'Denied', tone: 'bad' as const },
                                  { key: 'unavailable', label: 'Unavailable', tone: 'warn' as const },
                                ] as const
                              ).map((s) => {
                                const v = permissionOverview.byState[s.key];
                                const styles = toneStyles(s.tone);
                                return (
                                  <div key={s.key} className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/40 p-4">
                                    <p className="text-sm text-slate-400">{s.label}</p>
                                    <p className={`mt-2 text-2xl font-semibold ${styles.icon}`}>{v}</p>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/40 p-4">
                              <div className="flex items-center gap-2 text-slate-300">
                                <ThumbsUp size={16} className="text-[#14F195]" />
                                <p className="text-sm leading-7">Keep required permissions aligned with assessment workflow for consistent executive readiness.</p>
                              </div>
                              <div className="mt-4 flex flex-wrap gap-2">
                                <Button size="sm" variant="secondary" onClick={() => navigate('/permission')}>
                                  Manage permissions <ArrowRight size={16} />
                                </Button>
                              </div>
                            </div>

                            <Tabs defaultValue="overview">
                              <TabsList className="bg-white/[0.03]">
                                <TabsTrigger value="overview">Summary</TabsTrigger>
                                <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                              </TabsList>
                              <TabsContent value="overview">
                                <div className="mt-4 space-y-3">
                                  {capabilities.map((c) => {
                                    const stateTone =
                                      c.state === 'granted'
                                        ? 'good'
                                        : c.state === 'prompt'
                                          ? 'info'
                                          : c.state === 'denied'
                                            ? 'bad'
                                            : 'warn';
                                    const styles = toneStyles(stateTone);
                                    return (
                                      <motion.div
                                        key={c.id}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="rounded-[1rem] border border-white/10 bg-[#05070A]/40 p-4"
                                      >
                                        <div className="flex items-start justify-between gap-4">
                                          <div>
                                            <p className="font-semibold text-white">{c.label}</p>
                                            <p className="mt-1 text-sm text-slate-300">{c.description}</p>
                                          </div>
                                          <Badge className={styles.pillBg}>{c.state.toUpperCase()}</Badge>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </TabsContent>
                              <TabsContent value="capabilities">
                                <div className="mt-4 space-y-3">
                                  {capabilities.map((c) => {
                                    const supportedTone = c.supported ? 'good' : 'warn';
                                    const styles = toneStyles(supportedTone);
                                    return (
                                      <motion.div
                                        key={`cap-${c.id}`}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="rounded-[1rem] border border-white/10 bg-[#05070A]/40 p-4"
                                      >
                                        <div className="flex items-center justify-between gap-4">
                                          <div>
                                            <p className="font-semibold text-white">{c.label}</p>
                                            <p className="mt-1 text-sm text-slate-300">{c.compatibility}</p>
                                          </div>
                                          <Badge className={styles.pillBg}>{c.supported ? 'SUPPORTED' : 'LIMITED'}</Badge>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        ) : (
                          <div className="rounded-[1.5rem] border border-white/10 bg-[#05070A]/40 p-6 text-center">
                            <p className="text-slate-300">Permission data not ready.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-[#0B1118]/70">
                      <CardHeader>
                        <CardTitle className="text-white">Assessment Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="rounded-[1.5rem] border border-[#00B8FF]/20 bg-[#00B8FF]/10 p-5">
                          <div className="flex items-center gap-2 text-[#8bdbff]">
                            <Sparkles size={16} />
                            AI recommendations
                          </div>
                          <p className="mt-3 text-lg leading-8 text-slate-200">{viewModel.aiSummary}</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Security timeline</p>
                            <Badge className="border-white/10 bg-white/[0.03] text-slate-200">{timeline.length} stages</Badge>
                          </div>

                          <div className="space-y-3">
                            {timeline.map((t, idx) => (
                              <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/40 p-4"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="font-semibold text-white">{t.title}</p>
                                    <p className="mt-1 text-sm text-slate-300">Completed signal strength: {t.value}%</p>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-400">
                                    <Clock size={16} />
                                    <span>{t.timestamp}</span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-white/10 bg-[#05070A]/40 p-5">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm text-slate-400">Recent assessment history</p>
                              <p className="mt-2 text-lg font-semibold text-white">Last run: {recentHistory[0]?.date ?? '—'}</p>
                            </div>
                            <Badge className={riskTone((recentHistory[0]?.risk as RiskLevel) ?? riskLevel ?? 'Moderate').pillBg}>
                              {recentHistory[0]?.risk ?? '—'}
                            </Badge>
                          </div>

                          <div className="mt-4 space-y-2">
                            {recentHistory.map((h) => (
                              <div key={h.id} className="flex items-center justify-between rounded-[1rem] border border-white/10 bg-[#0B1118]/50 px-4 py-3">
                                <div>
                                  <p className="text-sm font-semibold text-white">{h.id}</p>
                                  <p className="mt-1 text-xs text-slate-400">{h.date}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-slate-200">Score {h.score}</p>
                                  <p className="mt-1 text-xs text-slate-400">Risk: {h.risk}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="border-white/10 bg-[#0B1118]/70">
                    <CardHeader>
                      <CardTitle className="text-white">Threat & Findings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ReportFindings
                        groups={threatAndFindings.map((f) => ({
                          title: f.title,
                          severity: f.severity,
                          description: f.description,
                          action: f.action,
                        }))}
                      />
                    </CardContent>
                  </Card>

                  <Card className="border-white/10 bg-[#0B1118]/70">
                    <CardHeader>
                      <CardTitle className="text-white">AI Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {aiRecommendations.map((r, idx) => {
                          const sevTone =
                            r.severity === 'critical'
                              ? 'bad'
                              : r.severity === 'warning'
                                ? 'warn'
                                : r.severity === 'recommendation'
                                  ? 'info'
                                  : 'good';
                          const styles = toneStyles(sevTone);
                          const SevIcon = r.severity === 'critical' ? AlertTriangle : r.severity === 'warning' ? TriangleAlert : CheckCircle2;
                          return (
                            <motion.div
                              key={`${r.title}-${idx}`}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.04 }}
                              className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/40 p-4"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                  <SevIcon size={18} className={styles.icon} />
                                  <div>
                                    <p className="text-white font-semibold">{r.title}</p>
                                    <p className="mt-2 text-sm leading-7 text-slate-300">{r.recommendation}</p>
                                  </div>
                                </div>
                                <Badge className={styles.pillBg}>{String(r.severity).toUpperCase()}</Badge>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2">
                                <Button size="sm" variant="secondary" onClick={() => navigate('/report')}>
                                  Open report <ExternalLink size={16} />
                                </Button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-white/10 bg-[#0B1118]/70">
                    <CardHeader>
                      <CardTitle className="text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {quickActions.map((a, idx) => {
                          const Icon = a.icon;
                          return (
                            <motion.div
                              key={a.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.04 }}
                              className="rounded-[1.5rem] border border-white/10 bg-[#05070A]/40 p-4"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                  <div className="rounded-full border border-white/10 bg-white/[0.03] p-2.5 text-[#00B8FF]">
                                    <Icon size={18} />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-white">{a.label}</p>
                                    <p className="mt-1 text-sm text-slate-300">{a.desc}</p>
                                  </div>
                                </div>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" onClick={a.onClick}>
                                        Go <ArrowRight size={16} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Open related enterprise view</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="pb-8"
        />
      </div>
    </div>
  );
}

