import { motion } from 'framer-motion';
import { useMemo } from 'react';

import { AiSummary } from '@/components/report/summary/AiSummary';
import { ExecutiveHeader } from '@/components/report/summary/ExecutiveHeader';
import { ScoreSummaryCard } from '@/components/report/summary/ScoreSummaryCard';
import { SystemInfoCard } from '@/components/report/summary/SystemInfoCard';
import { ReportCharts } from '@/components/report/charts/ReportCharts';
import { ReportExports } from '@/components/report/exports/ReportExports';
import { ReportFindings } from '@/components/report/findings/ReportFindings';
import { detectBrowserInfo } from '@/services/browserService';
import { buildReportViewModel } from '@/services/reportService';
import { useAssessmentStore } from '@/store/assessmentStore';

export default function ReportPage() {
  const { report } = useAssessmentStore();

  const viewModel = useMemo(() => {
    if (!report) {
      return null;
    }

    return buildReportViewModel(report, detectBrowserInfo());
  }, [report]);

  const handleDownloadJson = () => {
    if (!viewModel) {
      return;
    }

    const blob = new Blob([JSON.stringify(viewModel, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sentinel-x-report-${viewModel.assessmentId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  const handleCopyReport = async () => {
    if (!viewModel) {
      return;
    }

    await navigator.clipboard.writeText(`${viewModel.aiSummary}\n\nScore: ${viewModel.score}/100\nRisk: ${viewModel.risk}`);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleShareSummary = async () => {
    if (!viewModel || !navigator.share) {
      return;
    }

    await navigator.share({
      title: 'Sentinel-X security report',
      text: `${viewModel.aiSummary}\nScore: ${viewModel.score}/100`,
    });
  };

  if (!viewModel) {
    return (
      <div className="min-h-screen bg-[#05070A] px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-[#0B1118]/85 p-8 text-center">
          <h1 className="text-3xl font-semibold text-white">No report available yet</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">Complete the assessment flow to produce a board-ready executive report.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070A] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <ExecutiveHeader
          assessmentId={viewModel.assessmentId}
          timestamp={viewModel.timestamp}
          score={viewModel.score}
          risk={viewModel.risk}
          browser={viewModel.browser}
          os={viewModel.os}
        />

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-white/10 bg-[#0B1118]/85 px-5 py-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Export options</p>
            <p className="mt-2 text-lg font-semibold text-white">Share or archive this assessment package</p>
          </div>
          <ReportExports
            onDownloadJson={handleDownloadJson}
            onDownloadPdf={handleDownloadPdf}
            onCopyReport={handleCopyReport}
            onPrintReport={handlePrintReport}
            onShareSummary={handleShareSummary}
          />
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {viewModel.summaryCards.map((card) => (
            <ScoreSummaryCard key={card.label} label={card.label} score={card.score} detail={card.detail} status={card.status} />
          ))}
        </div>

        <ReportCharts overview={viewModel.overview} capabilities={viewModel.capabilities} permissions={viewModel.permissions} stages={viewModel.stages} />

        <div className="grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <AiSummary text={viewModel.aiSummary} />
            <div className="rounded-[1.75rem] border border-white/10 bg-[#0B1118]/85 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">Priority findings</p>
                  <p className="mt-1 text-sm text-slate-400">The highest-value issues and recommendations.</p>
                </div>
              </div>
              <ReportFindings groups={viewModel.findings} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-white/10 bg-[#0B1118]/85 p-5">
              <p className="text-lg font-semibold text-white">System information</p>
              <p className="mt-1 text-sm text-slate-400">Detailed environment snapshot captured during the assessment.</p>
              <div className="mt-5 space-y-4">
                {viewModel.systemInfo.map((section) => (
                  <SystemInfoCard key={section.title} title={section.title} items={section.items} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
