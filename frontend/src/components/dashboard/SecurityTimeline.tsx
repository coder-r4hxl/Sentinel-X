import { Badge } from '@/components/ui/badge';

import type { TimelineStage } from '@/types/dashboard';

import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function SecurityTimeline({ stages, countLabel }: { stages: TimelineStage[]; countLabel: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Security timeline</p>
        <Badge className="border-white/10 bg-white/[0.03] text-slate-200">
          {countLabel}
        </Badge>
      </div>

      <div className="space-y-3">
        {stages.map((t, idx) => (
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
  );
}

