import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssessmentStore } from '@/store/assessmentStore';
import type { AssessmentCheckResult } from '@/types';

const scoreTone = (score: number) => {
  if (score >= 85) return 'text-[#14F195]';
  if (score >= 70) return 'text-[#00B8FF]';
  if (score >= 50) return 'text-[#f5c76b]';
  return 'text-[#ff7a59]';
};

export default function AssessmentPage() {
  const navigate = useNavigate();
  const { status, progress, report, runAssessment } = useAssessmentStore();
  const [checks, setChecks] = useState<AssessmentCheckResult[]>([]);

  useEffect(() => {
    void runAssessment();
  }, [runAssessment]);

  useEffect(() => {
    if (report) {
      setChecks(report.checks);
    }
  }, [report]);

  const summary = useMemo(() => {
    if (!report) {
      return null;
    }

    return [
      { label: 'Browser Security Score', value: `${report.browserSecurityScore}/100`, tone: scoreTone(report.browserSecurityScore) },
      { label: 'Privacy Score', value: `${report.privacyScore}/100`, tone: scoreTone(report.privacyScore) },
      { label: 'Compatibility Score', value: `${report.compatibilityScore}/100`, tone: scoreTone(report.compatibilityScore) },
      { label: 'Risk Rating', value: report.riskRating, tone: 'text-white' },
    ];
  }, [report]);

  return (
    <div className="min-h-screen bg-[#05070A] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/10 px-3.5 py-1.5 text-sm text-[#8bdbff]">
            <ShieldCheck size={14} />
            Assessment Engine
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Premium browser posture assessment.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Sentinel-X evaluates your browser context locally and reports the findings in a secure, enterprise-ready format.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <Card className="border-white/10 bg-[#0B1118]/85">
              <CardHeader>
                <CardTitle>Assessment progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/70 p-4">
                  <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
                    <span>Current check</span>
                    <span>{status === 'running' ? progress.currentCheck : status === 'complete' ? 'Assessment complete' : 'Preparing'}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div animate={{ width: `${progress.progress}%` }} className="h-full rounded-full bg-gradient-to-r from-[#00B8FF] via-[#2dc8ff] to-[#14F195]" />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Completed</p>
                      <p className="mt-2 text-lg font-semibold text-white">{progress.completedChecks}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Remaining</p>
                      <p className="mt-2 text-lg font-semibold text-white">{progress.remainingChecks}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">ETA</p>
                      <p className="mt-2 text-lg font-semibold text-white">{progress.estimatedTimeRemaining}s</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {summary?.map((item) => (
                    <div key={item.label} className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/70 p-4">
                      <p className="text-sm text-slate-400">{item.label}</p>
                      <p className={`mt-2 text-2xl font-semibold ${item.tone}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#0B1118]/85">
              <CardHeader>
                <CardTitle>Assessment findings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {report?.findings.map((finding) => (
                  <div key={finding} className="flex items-start gap-3 rounded-[1rem] border border-white/10 bg-[#05070A]/70 p-3 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="mt-0.5 text-[#14F195]" />
                    <span>{finding}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-white/10 bg-[#0B1118]/85">
              <CardHeader>
                <CardTitle>Check results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {checks.map((check) => (
                  <div key={check.id} className="rounded-[1rem] border border-white/10 bg-[#05070A]/70 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{check.label}</p>
                        <p className="mt-1 text-sm text-slate-400">{check.detail}</p>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                        {check.status}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-slate-300">{check.value}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#0B1118]/85">
              <CardHeader>
                <CardTitle>Security posture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[1.25rem] border border-[#00B8FF]/20 bg-[#00B8FF]/10 p-4">
                  <div className="flex items-center gap-2 text-[#8bdbff]">
                    <Sparkles size={16} />
                    Local-only analysis
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    The assessment stays on your device. No personal files, passwords, or browsing history are uploaded.
                  </p>
                </div>
                <Button className="w-full" onClick={() => navigate('/report')}>
                  Continue to report
                  <ArrowRight size={16} />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
