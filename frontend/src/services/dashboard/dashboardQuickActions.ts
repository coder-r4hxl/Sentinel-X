import type { QuickActionItem } from '../../types/dashboard';
import type { ReportViewModel } from './dashboardViewModel';

export function buildQuickActions(args: {
  viewModel: ReportViewModel | null;
  navigate: (to: string) => void;
}): QuickActionItem[] {
  const { viewModel, navigate } = args;

  if (!viewModel) {
    return [
      {
        id: 'start-assessment',
        label: 'Run assessment',
        desc: 'Generate enterprise-ready report artifacts',
        icon: 'ShieldCheck',
        onClick: () => navigate('/assessment'),
      },
    ];
  }

  return [
    {
      id: 'open-report',
      label: 'Open executive report',
      desc: 'View full findings and system snapshot',
      icon: 'ExternalLink',
      onClick: () => navigate('/report'),
    },
    {
      id: 'review-permissions',
      label: 'Review permissions',
      desc: 'Validate required access and states',
      icon: 'Globe',
      onClick: () => navigate('/permission'),
    },
    {
      id: 'start-new-assessment',
      label: 'Re-run assessment',
      desc: 'Refresh the dashboard with current posture',
      icon: 'Shield',
      onClick: () => navigate('/assessment'),
    },
  ];
}