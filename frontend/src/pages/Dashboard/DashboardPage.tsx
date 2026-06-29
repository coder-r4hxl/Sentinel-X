import { DashboardShell } from '@/components/dashboard/DashboardShell';

import { useDashboard } from '@/hooks/useDashboard';

export default function DashboardPage() {
  const {
    isLoading,
    emptyState,
    loadStatus,
    errorMessage,
    viewModel,
    assessmentStatus,
    progress,
    riskLevel,
    overallProgressValue,
  } = useDashboard();

  return (
    <DashboardShell
      isLoading={isLoading}
      emptyState={emptyState}
      loadStatus={loadStatus}
      errorMessage={errorMessage}
      viewModel={viewModel}
      assessmentStatus={assessmentStatus}
      progress={progress}
      riskLevel={riskLevel}
      overallProgressValue={overallProgressValue}
    />
  );
}


