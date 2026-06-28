import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUserStore, type AssessmentUser } from '@/store/userStore';

const purposeOptions = ['Personal', 'Business', 'Enterprise'] as const;

const sessionCards = [
  { label: 'Assessment Session ID', key: 'sessionId' },
  { label: 'Timestamp', key: 'timestamp' },
  { label: 'Browser', key: 'browser' },
  { label: 'Operating System', key: 'os' },
  { label: 'Platform', key: 'platform' },
] as const;

export default function IdentityPage() {
  const navigate = useNavigate();
  const { user, updateUser, setUser } = useUserStore();
  const [submitted, setSubmitted] = useState(false);

  const sessionInfo = useMemo(() => {
    const ua = navigator.userAgent;
    const browser = ua.includes('Edg/') ? 'Microsoft Edge' : ua.includes('Chrome/') ? 'Chrome' : ua.includes('Firefox/') ? 'Firefox' : ua.includes('Safari/') ? 'Safari' : 'Unknown';
    const os = ua.includes('Windows') ? 'Windows' : ua.includes('Mac OS X') ? 'macOS' : ua.includes('Linux') ? 'Linux' : 'Unknown';

    return {
      sessionId: `SENT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      browser,
      os,
      platform: navigator.platform || 'Unknown',
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUser({
      ...user,
      fullName: user.fullName.trim(),
      email: user.email.trim(),
      organization: user.organization.trim(),
    });
    setSubmitted(true);
    navigate('/permissions');
  };

  return (
    <div className="min-h-screen bg-[#05070A] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/10 px-3.5 py-1.5 text-sm text-[#8bdbff]">
            <ShieldCheck size={14} />
            Secure identity verification
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Welcome.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Before beginning your security assessment, we need to establish a trusted assessment session that remains aligned with your environment.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {sessionCards.map(({ label, key }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-[1.25rem] border border-white/10 bg-[#0B1118]/85 p-4"
              >
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-sm font-medium text-white">{sessionInfo[key]}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="w-full max-w-xl">
          <Card className="border-white/10 bg-[#0B1118]/85 p-0">
            <CardHeader>
              <CardTitle>Assessment profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      required
                      placeholder="Alex Morgan"
                      value={user.fullName}
                      onChange={(event) => updateUser({ fullName: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      required
                      type="email"
                      placeholder="alex@company.com"
                      value={user.email}
                      onChange={(event) => updateUser({ email: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="organization">Organization (optional)</Label>
                    <Input
                      id="organization"
                      placeholder="Northwind Labs"
                      value={user.organization}
                      onChange={(event) => updateUser({ organization: event.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Purpose of assessment</Label>
                  <RadioGroup
                    value={user.purpose}
                    onValueChange={(value) => updateUser({ purpose: value as AssessmentUser['purpose'] })}
                    className="grid gap-3 sm:grid-cols-3"
                  >
                    {purposeOptions.map((item) => (
                      <label key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-slate-300">
                        <RadioGroupItem value={item} id={item} />
                        <span>{item}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full" disabled={submitted}>
                  Continue
                  <ArrowRight size={16} />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
