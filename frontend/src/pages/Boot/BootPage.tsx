import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const steps = [
  'Loading Security Engine...',
  'Loading Runtime...',
  'Loading Browser Modules...',
  'Loading AI Engine...',
  'Loading Telemetry...',
  'Initializing Assessment...',
];

export default function BootPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentStep((value) => (value + 1) % steps.length);
    }, 850);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          window.clearInterval(interval);
          return 100;
        }
        return value + 2.2;
      });
    }, 120);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 100) {
      return;
    }

    const timeout = window.setTimeout(() => {
      navigate('/identity');
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [navigate, progress]);

  useEffect(() => {
    if (!voiceEnabled || typeof window === 'undefined') {
      return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(
      'Welcome. Sentinel-X has initialized successfully. Preparing secure assessment.',
    );
    utterance.lang = 'en-US';
    utterance.rate = 1;
    synth.cancel();
    synth.speak(utterance);
  }, [voiceEnabled]);

  const visibleSteps = useMemo(() => steps.slice(0, Math.min(currentStep + 1, steps.length)), [currentStep]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070A] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(0,184,255,0.16),_transparent_34%),radial-gradient(circle_at_50%_80%,_rgba(20,241,149,0.1),_transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(18)].map((_, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, x: Math.random() * 100 - 50, y: Math.random() * 100 - 50 }}
            animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -24, 0], x: [0, 12, 0] }}
            transition={{ duration: 6 + index * 0.15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-[10%] top-[18%] h-1 w-1 rounded-full bg-white/50"
            style={{ left: `${8 + index * 5}%`, top: `${10 + (index % 6) * 12}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#0B1118]/80 px-6 py-8 shadow-[0_24px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:px-8 sm:py-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#00B8FF]/30 bg-[#00B8FF]/10 text-[#00B8FF] shadow-[0_0_28px_rgba(0,184,255,0.16)]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Sentinel-X</p>
              <p className="text-lg font-semibold text-white">Secure Assessment</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setVoiceEnabled((value) => !value)}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300 transition hover:border-[#00B8FF]/40 hover:text-white"
          >
            {voiceEnabled ? 'Mute' : 'Unmute'}
          </button>
        </div>

        <div className="mt-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="flex h-20 w-20 items-center justify-center rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/10"
          >
            <ShieldCheck size={30} className="text-[#00B8FF]" />
          </motion.div>

          <p className="mt-6 text-sm uppercase tracking-[0.32em] text-[#8bdbff]">System Initialization</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Preparing your secure review.
          </h1>

          <div className="mt-8 w-full rounded-[1.25rem] border border-white/10 bg-[#05070A]/70 p-4 sm:p-5">
            <div className="space-y-3">
              {visibleSteps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-slate-300"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-[#14F195]" />
                  {step}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-8 w-full">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
              <span>Initializing</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-[#00B8FF] via-[#2dc8ff] to-[#14F195]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
