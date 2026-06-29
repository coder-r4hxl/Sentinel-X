import { Badge } from '@/components/ui/badge';

import type { RecentAssessmentEntry, RiskLevel } from '@/types/dashboard';


const riskTone = (level: RiskLevel) => {
  switch (level) {
    case 'Excellent':
      return { pillBg: 'border-[#14F195]/20 bg-[#14F195]/10 text-[#14F195]' };
    case 'Good':
      return { pillBg: 'border-[#00B8FF]/20 bg-[#00B8FF]/10 text-[#00B8FF]' };
    case 'Moderate':
      return { pillBg: 'border-[#f5c76b]/20 bg-[#f5c76b]/10 text-[#f5c76b]' };
    case 'High':
      return { pillBg: 'border-[#ff7a59]/20 bg-[#ff7a59]/10 text-[#ff7a59]' };
    default:
      return { pillBg: 'border-[#ff7a59]/30 bg-[#ff7a59]/15 text-[#ff7a59]' };
  }
};

export function RecentAssessments({ items, overallRisk }: { items: RecentAssessmentEntry[]; overallRisk: RiskLevel | null }) {
  if (!items.length) return null;

  const first = items[0];
  const pill = riskTone((first.risk ?? overallRisk ?? 'Moderate') as RiskLevel).pillBg;

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#05070A]/40 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">Recent assessment history</p>
          <p className="mt-2 text-lg font-semibold text-white">Last run: {first.date}</p>
        </div>
        <Badge className={pill}>{first.risk}</Badge>
      </div>

      <div className="mt-4 space-y-2">
        {items.map((h) => (
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
  );
}

