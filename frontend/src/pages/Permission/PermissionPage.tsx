import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Lock, Monitor, Eye, Wifi, HardDrive, Cpu, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const permissions = [
  {
    title: 'Browser version',
    description: 'We confirm the browser family and version to tailor compatibility checks.',
    icon: Monitor,
  },
  {
    title: 'Operating system',
    description: 'We confirm platform context so the assessment uses the correct security model.',
    icon: Cpu,
  },
  {
    title: 'Screen resolution',
    description: 'We use viewport context to validate layout and rendering integrity.',
    icon: Eye,
  },
  {
    title: 'Installed extensions',
    description: 'Where supported, we identify extension-related risks without inspecting content.',
    icon: Sparkles,
  },
  {
    title: 'Security headers',
    description: 'We evaluate response characteristics that influence browser posture and transport security.',
    icon: Lock,
  },
  {
    title: 'Network information',
    description: 'We assess connection characteristics to understand platform context and potential exposure.',
    icon: Wifi,
  },
  {
    title: 'Local storage',
    description: 'We inspect whether site data is being persisted to validate session boundaries.',
    icon: HardDrive,
  },
  {
    title: 'Clipboard permission',
    description: 'We check whether clipboard access is available for secure in-browser workflows.',
    icon: ShieldCheck,
  },
];

export default function PermissionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#05070A] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/10 px-3.5 py-1.5 text-sm text-[#8bdbff]">
            <ShieldCheck size={14} />
            Permission Center
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Review what Sentinel-X can inspect during the secure assessment.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            The platform only uses browser-visible context to evaluate posture and report risk. It never requests passwords, files, private documents, or browsing history.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {permissions.map((permission, index) => {
              const Icon = permission.icon;
              return (
                <motion.div
                  key={permission.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Card className="h-full border-white/10 bg-[#0B1118]/80">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#00B8FF]/20 bg-[#00B8FF]/10 text-[#00B8FF]">
                          <Icon size={16} />
                        </div>
                        <CardTitle>{permission.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-7 text-slate-400">{permission.description}</p>
                      <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">Why we ask for this</p>
                      <p className="mt-2 text-sm text-slate-300">We use this context to assess the browser environment and measure posture accurately.</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
            <Card className="border-white/10 bg-[#0B1118]/85 p-0">
              <CardHeader>
                <CardTitle>Secure assessment summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/70 p-4">
                  <p className="text-sm text-slate-400">Assessment scope</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Sentinel-X evaluates browser context, exposure indicators, and runtime posture. No passwords, local files, or browsing history are requested.
                  </p>
                </div>

                <div className="rounded-[1.25rem] border border-[#00B8FF]/20 bg-[#00B8FF]/10 p-4">
                  <p className="font-medium text-white">Protection status</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Your environment will be reviewed using browser-visible telemetry to keep the analysis precise and privacy-respecting.
                  </p>
                </div>

                <Button className="w-full" onClick={() => navigate('/assessment')}>
                  Begin Secure Assessment
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
