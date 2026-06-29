import { motion } from 'framer-motion';

import { Gauge, ShieldCheck } from 'lucide-react';


import { Progress } from '@/components/ui/progress';

import type { DashboardViewModel } from '@/types/dashboard';

export function DashboardHeader({
  assessmentStatus,
  progress,
  viewModel,
  riskLevel,
  overallProgressValue,
}: {
  assessmentStatus: 'idle' | 'running' | 'complete' | 'error';
  progress: { currentCheck: string; progress: number };
  viewModel: DashboardViewModel | null;
  riskLevel: DashboardViewModel['riskLevel'] | null;
  overallProgressValue: number;
}) {
  return (
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
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Cybersecurity &amp; Browser Posture
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-300">
            Board-ready visibility across security score, risk posture, browser health, and permissions—backed by
            your existing assessment engine.
          </p>
        </div>

        <div className="w-full lg:w-[380px]">
          <div className="rounded-[1.5rem] border border-white/10 bg-[#05070A]/40 p-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Executive security score</p>
                <p className="text-3xl font-semibold text-white">
                  {viewModel?.executiveScore != null ? `${viewModel.executiveScore}` : '—'}
                </p>
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
              <span>
                {assessmentStatus === 'running'
                  ? progress.currentCheck
                  : viewModel
                    ? 'Assessment complete'
                    : 'Awaiting assessment'}
              </span>
              <span>{viewModel?.executiveScore != null ? `${Math.round(overallProgressValue)}%` : ''}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

