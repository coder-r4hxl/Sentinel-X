import { create } from 'zustand';
import type { AssessmentProgress, AssessmentReport, AssessmentStatus } from '../types';
import { createAssessmentProgress, runAssessment } from '../services/assessmentService';

interface AssessmentState {
  status: AssessmentStatus;
  progress: AssessmentProgress;
  report: AssessmentReport | null;
  runAssessment: () => Promise<void>;
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
  status: 'idle',
  progress: createAssessmentProgress(8),
  report: null,
  runAssessment: async () => {
    set({ status: 'running', progress: createAssessmentProgress(8) });
    const report = await runAssessment();
    set({
      status: 'complete',
      report,
      progress: {
        currentCheck: 'Assessment complete',
        completedChecks: 8,
        remainingChecks: 0,
        estimatedTimeRemaining: 0,
        progress: 100,
      },
    });
  },
}));
