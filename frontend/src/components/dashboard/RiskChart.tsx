import type { RiskLevel } from '@/types/dashboard';

export function RiskChart({ riskLevel }: { riskLevel: RiskLevel | null }) {
  if (!riskLevel) return null;
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm font-semibold">
      {riskLevel}
    </div>
  );
}

