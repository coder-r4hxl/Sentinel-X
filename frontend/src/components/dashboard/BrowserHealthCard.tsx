import { motion } from 'framer-motion';

import { Globe, Shield, ShieldCheck, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { BrowserHealth, DashboardViewModel, RiskLevel, Tone } from '@/types/dashboard';

const scoreTone = (score: number): Tone => {
  if (score >= 85) return 'good';
  if (score >= 70) return 'info';
  if (score >= 50) return 'warn';
  return 'bad';
};

const toneStyles = (tone: Tone) => {
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

export function BrowserHealthCard({
  browserHealth,
  riskLevel,
  viewModel,
}: {
  browserHealth: BrowserHealth | null;
  riskLevel: DashboardViewModel['riskLevel'];
  viewModel: DashboardViewModel;
}) {
  if (!browserHealth) return null;

  return (
    <Card className="border-white/10 bg-[#0B1118]/70">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4">
          <span className="text-white">Browser Health Overview</span>
          {riskLevel && <Badge className={riskTone(riskLevel).pillBg}>{riskLevel}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          {([
            { label: 'Security', value: browserHealth.security, icon: Shield },
            { label: 'Privacy', value: browserHealth.privacy, icon: Sparkles },
            { label: 'Compatibility', value: browserHealth.compatibility, icon: Globe },
            { label: 'Permissions', value: browserHealth.permissions, icon: ShieldCheck },
          ] as const).map((x) => {
            const tone = scoreTone(x.value);
            const styles = toneStyles(tone);
            const Icon = x.icon;
            return (
              <div key={x.label} className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={styles.icon} />
                    <p className="text-sm text-slate-300">{x.label}</p>
                  </div>
                  <Badge className={styles.pillBg}>{x.value}</Badge>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${x.value}%` }}
                    transition={{ duration: 0.6 }}
                    className={`h-full rounded-full bg-gradient-to-r ${styles.bar}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-[1.25rem] border border-[#00B8FF]/20 bg-[#00B8FF]/10 p-4">
          <p className="text-sm uppercase tracking-[0.24em] text-[#8bdbff]">Executive note</p>
          <p className="mt-2 text-lg leading-8 text-slate-200">{browserHealth.quickSummary}</p>
        </div>


      </CardContent>
    </Card>
  );
}

