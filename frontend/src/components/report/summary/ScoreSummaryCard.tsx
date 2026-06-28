import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface ScoreSummaryCardProps {
  label: string;
  score: number;
  detail: string;
  status: string;
}

export function ScoreSummaryCard({ label, score, detail, status }: ScoreSummaryCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{score}/100</p>
        </div>
        <div className="rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/10 px-2.5 py-1 text-xs uppercase tracking-[0.24em] text-[#8bdbff]">
          {status}
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div animate={{ width: `${score}%` }} className="h-full rounded-full bg-gradient-to-r from-[#00B8FF] via-[#2dc8ff] to-[#14F195]" />
      </div>
      <p className="mt-3 text-sm text-slate-300">{detail}</p>
      <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-400">
        Review complete <ArrowUpRight size={14} />
      </div>
    </motion.div>
  );
}
