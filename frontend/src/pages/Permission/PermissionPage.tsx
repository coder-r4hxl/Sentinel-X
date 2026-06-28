import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { requestPermission } from '@/services/permissionService';
import { usePermissionStore } from '@/store/permissionStore';
import type { PermissionCapability, PermissionState } from '@/types';

const capabilityLabels: Record<PermissionState, string> = {
  granted: 'Granted',
  denied: 'Denied',
  prompt: 'Prompt',
  unavailable: 'Unavailable',
};

const stateStyles: Record<PermissionState, string> = {
  granted: 'border-[#14F195]/20 bg-[#14F195]/10 text-[#14F195]',
  denied: 'border-[#ff7a59]/20 bg-[#ff7a59]/10 text-[#ff7a59]',
  prompt: 'border-[#00B8FF]/20 bg-[#00B8FF]/10 text-[#00B8FF]',
  unavailable: 'border-white/10 bg-white/[0.03] text-slate-400',
};

export default function PermissionPage() {
  const navigate = useNavigate();
  const { capabilities, loading, evaluated, loadCapabilities, updateCapability } = usePermissionStore();
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    void loadCapabilities();
  }, [loadCapabilities]);

  const requiredReady = useMemo(() => {
    return capabilities.some((item) => item.required && item.state === 'granted') || capabilities.every((item) => item.state !== 'prompt');
  }, [capabilities]);

  const handleGrant = async (capability: PermissionCapability) => {
    setProcessingId(capability.id);
    const state = await requestPermission(capability.id);
    updateCapability(capability.id, { ...capability, state });
    setProcessingId(null);
  };

  return (
    <div className="min-h-screen bg-[#05070A] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/10 px-3.5 py-1.5 text-sm text-[#8bdbff]">
            <ShieldCheck size={14} />
            Permission Center
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Sentinel-X performs a local browser security assessment.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Some browser capabilities require your permission. No personal files are accessed. No passwords are collected. No browsing history is uploaded.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {capabilities.map((capability, index) => (
              <motion.div key={capability.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                <Card className="h-full border-white/10 bg-[#0B1118]/85">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle>{capability.label}</CardTitle>
                        <p className="mt-2 text-sm leading-7 text-slate-400">{capability.description}</p>
                      </div>
                      <div className={`rounded-full border px-2.5 py-1 text-xs font-medium ${stateStyles[capability.state]}`}>
                        {capabilityLabels[capability.state]}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-[1rem] border border-white/10 bg-[#05070A]/70 p-3 text-sm text-slate-300">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Lock size={14} />
                        Browser support
                      </div>
                      <p className="mt-2">{capability.supported ? 'Supported in this browser.' : 'Unavailable in this browser.'}</p>
                      <p className="mt-2 text-slate-400">{capability.compatibility}</p>
                    </div>
                    {capability.supported && capability.state !== 'granted' ? (
                      <Button className="w-full" onClick={() => void handleGrant(capability)} disabled={processingId === capability.id}>
                        {processingId === capability.id ? 'Requesting…' : capability.required ? 'Grant required access' : 'Grant access'}
                        <ArrowRight size={16} />
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-white/10 bg-[#0B1118]/85 p-0">
              <CardHeader>
                <CardTitle>Assessment readiness</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-[1.25rem] border border-[#00B8FF]/20 bg-[#00B8FF]/10 p-4">
                  <div className="flex items-center gap-2 text-[#8bdbff]">
                    <Sparkles size={16} />
                    Review summary
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Sentinel-X will inspect browser posture locally and report findings without collecting personal files or browsing history.
                  </p>
                </div>

                <div className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/70 p-4">
                  <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
                    <span>Evaluation status</span>
                    <span>{evaluated ? 'Ready' : loading ? 'Checking…' : 'Pending'}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div animate={{ width: `${Math.min(100, (capabilities.filter((item) => item.state === 'granted').length / Math.max(capabilities.length, 1)) * 100)}%` }} className="h-full rounded-full bg-gradient-to-r from-[#00B8FF] via-[#2dc8ff] to-[#14F195]" />
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-[#14F195]" />
                    {requiredReady ? 'Required browser context has been evaluated.' : 'Permissions are still being evaluated.'}
                  </div>
                </div>

                <Button className="w-full" disabled={!requiredReady} onClick={() => navigate('/assessment')}>
                  Continue to assessment
                  <ArrowRight size={16} />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
