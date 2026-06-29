import { motion } from 'framer-motion';

import { AlertTriangle, CheckCircle2, ExternalLink, TriangleAlert } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { AIRecommendationItem } from '@/types/dashboard';

const severityToTone = (sev: AIRecommendationItem['severity']) => {
  switch (sev) {
    case 'critical':
      return 'bad';
    case 'warning':
      return 'warn';
    case 'recommendation':
      return 'info';
    default:
      return 'good';
  }
};

const toneStyles = (tone: 'good' | 'info' | 'warn' | 'bad') => {
  switch (tone) {
    case 'good':
      return {
        pillBg: 'border-[#14F195]/20 bg-[#14F195]/10 text-[#14F195]',
        icon: 'text-[#14F195]',
      };
    case 'info':
      return {
        pillBg: 'border-[#00B8FF]/20 bg-[#00B8FF]/10 text-[#00B8FF]',
        icon: 'text-[#00B8FF]',
      };
    case 'warn':
      return {
        pillBg: 'border-[#f5c76b]/20 bg-[#f5c76b]/10 text-[#f5c76b]',
        icon: 'text-[#f5c76b]',
      };
    default:
      return {
        pillBg: 'border-[#ff7a59]/20 bg-[#ff7a59]/10 text-[#ff7a59]',
        icon: 'text-[#ff7a59]',
      };
  }
};

export function AIRecommendations({
  items,
  onOpenReport,
}: {
  items: AIRecommendationItem[];
  onOpenReport: () => void;
}) {
  return (
    <Card className="border-white/10 bg-[#0B1118]/70">
      <CardHeader>
        <CardTitle className="text-white">AI Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((r, idx) => {
            const sevTone = severityToTone(r.severity);
            const styles = toneStyles(sevTone);
            const SevIcon =
              r.severity === 'critical' ? AlertTriangle : r.severity === 'warning' ? TriangleAlert : CheckCircle2;

            return (
              <motion.div
                key={`${r.title}-${idx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/40 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <SevIcon size={18} className={styles.icon} />
                    <div>
                      <p className="text-white font-semibold">{r.title}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{r.recommendation}</p>
                    </div>
                  </div>
                  <Badge className={styles.pillBg}>{String(r.severity).toUpperCase()}</Badge>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={onOpenReport}>
                    Open report <ExternalLink size={16} />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

