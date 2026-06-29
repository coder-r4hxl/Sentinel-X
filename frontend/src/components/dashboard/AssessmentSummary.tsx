import { motion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Clock, Sparkles } from 'lucide-react';

import type { DashboardViewModel, RiskLevel, TimelineStage } from '@/types/dashboard';

const riskTone = (level: RiskLevel) => {
  switch (level) {
    case 'Excellent':
      return {
        pillBg: 'border-[#14F195]/20 bg-[#14F195]/10 text-[#14F195]',
      };
    case 'Good':
      return {
        pillBg: 'border-[#00B8FF]/20 bg-[#00B8FF]/10 text-[#00B8FF]',
      };
    case 'Moderate':
      return {
        pillBg: 'border-[#f5c76b]/20 bg-[#f5c76b]/10 text-[#f5c76b]',
      };
    case 'High':
      return {
        pillBg: 'border-[#ff7a59]/20 bg-[#ff7a59]/10 text-[#ff7a59]',
      };
    default:
      return {
        pillBg: 'border-[#ff7a59]/30 bg-[#ff7a59]/15 text-[#ff7a59]',
      };
  }
};

export function AssessmentSummary({
  viewModel,
}: {
  viewModel: DashboardViewModel;
}) {
  const { timeline, recentHistory } = viewModel;


  return (
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
          <p className="mt-3 text-lg leading-8 text-slate-200">{viewModel.reportViewModel?.aiSummary}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Security timeline</p>
            <Badge className="border-white/10 bg-white/[0.03] text-slate-200">{timeline.length} stages</Badge>
          </div>

          <div className="space-y-3">
            {timeline.map((t: TimelineStage, idx: number) => (
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
            <Badge
              className={riskTone((recentHistory[0]?.risk as RiskLevel) ?? viewModel.riskLevel ?? 'Moderate').pillBg}
            >
              {recentHistory[0]?.risk ?? '—'}
            </Badge>
          </div>

          <div className="mt-4 space-y-2">
            {recentHistory.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between rounded-[1rem] border border-white/10 bg-[#0B1118]/50 px-4 py-3"
              >
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
  );
}

