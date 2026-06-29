import { motion } from 'framer-motion';

import { Gauge, Globe, ShieldCheck, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { DashboardViewModel, EnterpriseMetric } from '@/types/dashboard';

const toneStyles = (tone: EnterpriseMetric['tone']) => {
  switch (tone) {
    case 'good':
      return {
        pillBg: 'border-[#14F195]/20 bg-[#14F195]/10 text-[#14F195]',
        bar: 'from-[#14F195] via-[#00B8FF] to-[#14F195]',
        icon: 'text-[#14F195]',
      };
    case 'info':
      return {
        pillBg: 'border-[#00B8FF]/20 bg-[#00B8FF]/10 text-[#00B8FF]',
        bar: 'from-[#00B8FF] via-[#2dc8ff] to-[#00B8FF]',
        icon: 'text-[#00B8FF]',
      };
    case 'warn':
      return {
        pillBg: 'border-[#f5c76b]/20 bg-[#f5c76b]/10 text-[#f5c76b]',
        bar: 'from-[#f5c76b] via-[#00B8FF] to-[#f5c76b]',
        icon: 'text-[#f5c76b]',
      };
    default:
      return {
        pillBg: 'border-[#ff7a59]/20 bg-[#ff7a59]/10 text-[#ff7a59]',
        bar: 'from-[#ff7a59] via-[#00B8FF] to-[#ff7a59]',
        icon: 'text-[#ff7a59]',
      };
  }
};

export function ExecutiveScoreCard({
  executiveMetrics,
}: {
  executiveMetrics: DashboardViewModel['executiveMetrics'];
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {executiveMetrics.map((m, idx) => {
          const styles = toneStyles(m.tone);
          const Icon = idx === 0 ? Gauge : idx === 1 ? ShieldCheck : idx === 2 ? Sparkles : Globe;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-[1.5rem] border border-white/10 bg-[#0B1118]/70 p-5 backdrop-blur"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{m.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{m.value}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{m.sublabel}</p>
                </div>
                <div className={`rounded-full border border-white/10 bg-white/[0.03] p-2.5 ${styles.icon}`}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.value}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className={`h-full rounded-full bg-gradient-to-r ${styles.bar}`}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Badge className={styles.pillBg}>{m.tone.toUpperCase()}</Badge>
                <span className="text-xs text-slate-400">Updated live</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Card className="border-white/10 bg-[#0B1118]/70">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-4">
            <span className="text-white">Browser Health Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5" />
      </Card>
    </>
  );
}

