import { AnimatePresence, motion } from 'framer-motion';

import type { AssessmentProgress, AssessmentStatus } from '@/types';

import type { DashboardViewModel } from '@/types/dashboard';

import { DashboardEmpty } from '@/components/dashboard/DashboardEmpty';
import { DashboardError } from '@/components/dashboard/DashboardError';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';


export function DashboardShell({
  isLoading,
  emptyState,
  loadStatus,
  errorMessage,
  viewModel,
  assessmentStatus,
  progress,
  riskLevel,
  overallProgressValue,
}: {
  isLoading: boolean;
  emptyState: boolean;
  loadStatus: 'idle' | 'loading' | 'ready' | 'error';
  errorMessage: string;
  viewModel: DashboardViewModel | null;
  assessmentStatus: AssessmentStatus;
  progress: AssessmentProgress;
  riskLevel: DashboardViewModel['riskLevel'];
  overallProgressValue: number;
}) {
  return (
    <div className="min-h-screen bg-[#05070A] px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <DashboardHeader assessmentStatus={assessmentStatus} progress={progress} viewModel={viewModel} riskLevel={riskLevel} overallProgressValue={overallProgressValue} />

        <AnimatePresence>
          {isLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              <DashboardSkeleton />
            </motion.div>
          )}

          {emptyState && (
            <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <DashboardEmpty
                onRunAssessment={() => {
                  window.location.href = '/assessment';
                }}
                onReviewPermissions={() => {
                  window.location.href = '/permission';
                }}
              />
            </motion.div>
          )}

          {loadStatus === 'error' && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2rem] border border-[#ff7a59]/30 bg-[#0B1118]/70 p-6">
              <DashboardError errorMessage={errorMessage} onRetry={() => window.location.reload()} />
            </motion.div>
          )}

          {!isLoading && viewModel && (
            <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DashboardGrid
                viewModel={viewModel}
                onManagePermissions={() => {
                  window.location.href = '/permission';
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="pb-8" />
      </div>
    </div>
  );
}


