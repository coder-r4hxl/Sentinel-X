import { motion } from 'framer-motion';

import { ArrowRight, ExternalLink, Globe, Shield, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import type { DashboardViewModel } from '@/types/dashboard';

const iconFor = (id: string) => {
  switch (id) {
    case 'open-report':
      return ExternalLink;
    case 'review-permissions':
      return Globe;
    case 'start-new-assessment':
      return Shield;
    default:
      return ShieldCheck;
  }
};

export function QuickActions({ viewModel }: { viewModel: DashboardViewModel }) {
  return (
    <Card className="border-white/10 bg-[#0B1118]/70">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {viewModel.quickActions.map((a, idx) => {
            const Icon = iconFor(a.id);
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="rounded-[1.5rem] border border-white/10 bg-[#05070A]/40 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full border border-white/10 bg-white/[0.03] p-2.5 text-[#00B8FF]">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{a.label}</p>
                      <p className="mt-1 text-sm text-slate-300">{a.desc}</p>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" onClick={a.onClick}>
                          Go <ArrowRight size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Open related enterprise view</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

