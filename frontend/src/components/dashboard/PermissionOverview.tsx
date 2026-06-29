import { ArrowRight, ThumbsUp } from 'lucide-react';


import { motion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { DashboardViewModel, PermissionOverviewData, Tone } from '@/types/dashboard';

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

export function PermissionOverviewCard({
  permissionOverview,
  capabilities,
  onManagePermissions,
}: {
  permissionOverview: PermissionOverviewData | null;
  capabilities: DashboardViewModel['capabilities'];
  onManagePermissions: () => void;
}) {
  if (!permissionOverview) {
    return (
      <Card className="border-white/10 bg-[#0B1118]/70">
        <CardHeader>
          <CardTitle className="text-white">Permission Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-[1.5rem] border border-white/10 bg-[#05070A]/40 p-6 text-center">
            <p className="text-slate-300">Permission data not ready.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-[#0B1118]/70">
      <CardHeader>
        <CardTitle className="text-white">Permission Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Permission score</p>
              <p className="mt-2 text-3xl font-semibold text-white">{permissionOverview.permissionScore}</p>
            </div>
            <Badge className={toneStyles(scoreTone(permissionOverview.permissionScore)).pillBg}>
              {permissionOverview.permissionScore >= 80
                ? 'MANAGED'
                : permissionOverview.permissionScore >= 60
                  ? 'WATCHLIST'
                  : 'REMEDIATION'}
            </Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { key: 'granted', label: 'Granted', tone: 'good' as const },
                { key: 'prompt', label: 'Prompt', tone: 'info' as const },
                { key: 'denied', label: 'Denied', tone: 'bad' as const },
                { key: 'unavailable', label: 'Unavailable', tone: 'warn' as const },
              ] as const
            ).map((s) => {
              const v = permissionOverview.byState[s.key];
              const styles = toneStyles(s.tone);
              return (
                <div key={s.key} className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/40 p-4">
                  <p className="text-sm text-slate-400">{s.label}</p>
                  <p className={`mt-2 text-2xl font-semibold ${styles.icon}`}>{v}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/40 p-4">
            <div className="flex items-center gap-2 text-slate-300">
              <ThumbsUp size={16} className="text-[#14F195]" />
              <p className="text-sm leading-7">
                Keep required permissions aligned with assessment workflow for consistent executive readiness.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={onManagePermissions}>
                Manage permissions <ArrowRight size={16} />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="bg-white/[0.03]">
              <TabsTrigger value="overview">Summary</TabsTrigger>
              <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="mt-4 space-y-3">
                {capabilities.map((c) => {
                  const stateTone =
                    c.state === 'granted'
                      ? 'good'
                      : c.state === 'prompt'
                        ? 'info'
                        : c.state === 'denied'
                          ? 'bad'
                          : 'warn';
                  const styles = toneStyles(stateTone);
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-[1rem] border border-white/10 bg-[#05070A]/40 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">{c.label}</p>
                          <p className="mt-1 text-sm text-slate-300">{c.description}</p>
                        </div>
                        <Badge className={styles.pillBg}>{c.state.toUpperCase()}</Badge>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="capabilities">
              <div className="mt-4 space-y-3">
                {capabilities.map((c) => {
                  const supportedTone = c.supported ? 'good' : 'warn';
                  const styles = toneStyles(supportedTone);
                  return (
                    <motion.div
                      key={`cap-${c.id}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-[1rem] border border-white/10 bg-[#05070A]/40 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">{c.label}</p>
                          <p className="mt-1 text-sm text-slate-300">{c.compatibility}</p>
                        </div>
                        <Badge className={styles.pillBg}>{c.supported ? 'SUPPORTED' : 'LIMITED'}</Badge>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}

