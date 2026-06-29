import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, ShieldX } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePermissionStore } from '@/store/permissionStore';
import { useUserStore } from '@/store/userStore';

export default function AuthorizationPage() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { capabilities, loadCapabilities, evaluated, loading } = usePermissionStore();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const ready = useMemo(() => {
    if (!capabilities.length) return false;
    // We consider authorization ready if all required capabilities are granted
    // and no capability is stuck in an indeterminate state.
    const required = capabilities.filter((c) => c.required);
    const hasAllRequired = required.every((c) => c.state === 'granted');
    const noUnhandledPrompt = capabilities.every((c) => c.state !== 'prompt');
    return hasAllRequired && noUnhandledPrompt;
  }, [capabilities]);

  const completeness = useMemo(() => {
    const fields = [user.fullName, user.email, user.organization].filter(Boolean);
    return Math.round((fields.length / 3) * 100);
  }, [user.fullName, user.email, user.organization]);

  const handleInitialize = async () => {
    // PermissionCenter is the authoritative permission evaluator.
    // If user lands here directly, we ensure capabilities are computed.
    if (!evaluated && !loading) {
      await loadCapabilities();
    }
  };

  // Best-effort init on mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useState(() => {
    void handleInitialize();
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (ready) {
      navigate('/assessment');
      return;
    }

    // Route to permission center if not authorized.
    navigate('/permission');
  };

  return (
    <div className="min-h-screen bg-[#05070A] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/10 px-3.5 py-1.5 text-sm text-[#8bdbff]">
            <ShieldCheck size={14} />
            Authorization Gate
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Establish trust for the assessment workflow
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Sentinel-X validates your assessment identity profile and ensures required browser permissions are granted.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <Card className="border-white/10 bg-[#0B1118]/85">
              <CardHeader>
                <CardTitle>Identity profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">Profile completeness</p>
                    <p className="text-sm font-semibold text-white">{completeness}%</p>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={false}
                      animate={{ width: `${completeness}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-[#00B8FF] via-[#2dc8ff] to-[#14F195]"
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.1rem] border border-white/10 bg-[#05070A]/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Full name</p>
                    <p className="mt-2 text-sm font-medium text-white">{user.fullName || '—'}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-white/10 bg-[#05070A]/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Email</p>
                    <p className="mt-2 break-all text-sm font-medium text-white">{user.email || '—'}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-white/10 bg-[#05070A]/70 p-4 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Organization</p>
                    <p className="mt-2 text-sm font-medium text-white">{user.organization || '—'}</p>
                  </div>
                </div>

                {formSubmitted && !user.email ? (
                  <p className="text-sm text-[#ff7a59]">
                    Identity information is incomplete. Please return to Identity verification.
                  </p>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#0B1118]/85">
              <CardHeader>
                <CardTitle>Permission readiness</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[1.25rem] border border-[#00B8FF]/20 bg-[#00B8FF]/10 p-4">
                  <div className="flex items-center justify-between text-sm text-[#8bdbff]">
                    <span>Evaluation status</span>
                    <span>{evaluated ? (ready ? 'Authorized' : 'Needs permissions') : loading ? 'Checking…' : 'Pending'}</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {capabilities.slice(0, 5).map((cap) => (
                      <div key={cap.id} className="flex items-center justify-between gap-3 rounded-[1rem] border border-white/10 bg-[#05070A]/70 px-3 py-2">
                        <p className="text-sm text-slate-200">{cap.label}</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          {cap.state}
                        </p>
                      </div>
                    ))}
                  </div>

                  {capabilities.length > 5 ? (
                    <p className="mt-3 text-xs text-slate-400">+ {capabilities.length - 5} more permissions</p>
                  ) : null}
                </div>

                {!ready ? (
                  <div className="rounded-[1.25rem] border border-[#ff7a59]/20 bg-[#ff7a59]/10 p-4">
                    <div className="flex items-center gap-2 text-[#ffb3a4]">
                      <ShieldX size={16} />
                      Access not authorized yet
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      Required browser permissions must be granted before Sentinel-X can proceed.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-[1.25rem] border border-[#14F195]/20 bg-[#14F195]/10 p-4">
                    <div className="flex items-center gap-2 text-[#b7fbd4]">
                      <ShieldCheck size={16} />
                      Authorization complete
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      Required permissions are in place. You can continue to the assessment engine.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-white/10 bg-[#0B1118]/85 p-0">
              <CardContent className="space-y-5 p-6">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Next step</p>
                  <p className="text-lg font-semibold text-white">Proceed to Assessment</p>
                  <p className="text-sm leading-7 text-slate-300">
                    This gate ensures your session context is ready. No sensitive data is uploaded.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {ready ? 'Continue to assessment' : 'Review permissions'}
                    <ArrowRight size={16} />
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => navigate('/identity')}
                  >
                    Back to identity
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => navigate('/permission')}
                  >
                    Open permission center
                  </Button>
                </form>

                <div className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/70 p-4 text-sm text-slate-300">
                  <p className="font-medium text-white">Privacy assurance</p>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-slate-300">
                    <li>No personal files are collected.</li>
                    <li>No passwords are requested.</li>
                    <li>Assessment runs locally in the browser.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

