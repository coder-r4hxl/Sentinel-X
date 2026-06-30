import { motion } from 'framer-motion';

import type { DashboardViewModel } from '@/types/dashboard';

import { ExecutiveScoreCard } from '@/components/dashboard/ExecutiveScoreCard';
import { BrowserHealthCard } from '@/components/dashboard/BrowserHealthCard';
import { PermissionOverviewCard } from '@/components/dashboard/PermissionOverview';
import { AssessmentSummary } from '@/components/dashboard/AssessmentSummary';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ThreatOverview } from '@/components/dashboard/ThreatOverview';

export function DashboardGrid({
  viewModel,
  onManagePermissions,
}: {
  viewModel: DashboardViewModel;
  onManagePermissions: () => void;
}) {
  return (
    <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <ExecutiveScoreCard executiveMetrics={viewModel.executiveMetrics} />
          </div>

          <BrowserHealthCard browserHealth={viewModel.browserHealth} riskLevel={viewModel.riskLevel} />


          <div className="grid gap-6 lg:grid-cols-2">
            <PermissionOverviewCard permissionOverview={viewModel.permissionOverview} capabilities={viewModel.capabilities} onManagePermissions={onManagePermissions} />

            <AssessmentSummary viewModel={viewModel} />
          </div>

          <ThreatOverview threatAndFindings={viewModel.threatAndFindings} />
        </div>

        <div className="space-y-6">
          <QuickActions viewModel={viewModel} />
        </div>
      </div>
    </motion.div>
  );
}



