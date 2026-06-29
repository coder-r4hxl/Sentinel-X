import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import type { DashboardViewModel } from '../types/dashboard';
import type { BrowserSnapshot } from '../types';
import type { AssessmentProgress, AssessmentStatus } from '../types';

import { useAssessmentStore } from '../store/assessmentStore';
import { usePermissionStore } from '../store/permissionStore';
import { useDashboardStore } from '../store/dashboardStore';

import { buildDashboardViewModel } from '../services/dashboardService';
import { detectBrowserInfo } from '../services/browserService';

export function useDashboard(): {
  isLoading: boolean;
  emptyState: boolean;
  loadStatus: 'idle' | 'loading' | 'ready' | 'error';
  errorMessage: string;
  viewModel: DashboardViewModel | null;
  executiveScore: number | null;
  riskLevel: DashboardViewModel['riskLevel'];
  overallProgressValue: number;
  snapshot: BrowserSnapshot | null;
  assessmentStatus: AssessmentStatus;
  progress: AssessmentProgress;
} {
  const navigate = useNavigate();
  const { status: assessmentStatus, progress, report } = useAssessmentStore();
  const { capabilities, evaluated, loadCapabilities, loading: permissionsLoading } = usePermissionStore();

  const { loadStatus, errorMessage, setLoadStatus, setErrorMessage } = useDashboardStore();

  const snapshot = useMemo<BrowserSnapshot | null>(() => {
    try {
      return detectBrowserInfo();
    } catch {
      return null;
    }
  }, []);

  const viewModel = useMemo<DashboardViewModel | null>(() => {
    if (!report || !snapshot) return null;
    return buildDashboardViewModel({
      report,
      snapshot,
      capabilities,
      evaluated,
      navigate: (to) => navigate(to),
    });
  }, [report, snapshot, capabilities, evaluated, navigate]);

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
    if (!report) return progress.progress;
    return 100;
  }, [report, progress.progress]);

  return {
    isLoading,
    emptyState,
    loadStatus,
    errorMessage,
    viewModel,
    executiveScore: viewModel?.executiveScore ?? null,
    riskLevel: viewModel?.riskLevel ?? null,
    overallProgressValue,
    snapshot,
    assessmentStatus,
    progress,
  };
}

