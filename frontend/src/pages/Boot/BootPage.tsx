import { AnimatePresence, motion } from 'framer-motion';
import { Cpu, HardDrive, MemoryStick, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const bootLogs = [
  'Initializing Sentinel-X Core...',
  'Loading Threat Intelligence Engine...',
  'Loading Browser Assessment Module...',
  'Loading Permission Manager...',
  'Initializing Secure Session...',
  'Verifying Runtime Integrity...',
  'Connecting Local Analysis Engine...',
  'Loading AI Assistant...',
  'System Ready.',
];

const statusCards = [
  { label: 'CPU', value: 'Nominal', detail: 'Intel vPro', icon: Cpu },
  { label: 'Memory', value: 'Stable', detail: '12.8 GB', icon: MemoryStick },
  { label: 'Modules', value: 'Online', detail: '8 / 8 active', icon: HardDrive },
];

export default function BootPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'black' | 'booting' | 'complete'>('black');
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPhase('booting');
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (phase !== 'booting' || activeLineIndex >= bootLogs.length) {
      return;
    }

    const line = bootLogs[activeLineIndex];
    let charIndex = 0;
    setTypedText('');

    const typingTimer = window.setInterval(() => {
      charIndex += 1;
      setTypedText(line.slice(0, charIndex));

      if (charIndex >= line.length) {
        window.clearInterval(typingTimer);
        window.setTimeout(() => {
          setDisplayedLines((value) => [...value, line]);
          setActiveLineIndex((value) => value + 1);
        }, 220);
      }
    }, 29);

    return () => window.clearInterval(typingTimer);
  }, [activeLineIndex, phase]);

  useEffect(() => {
    if (phase !== 'booting' || activeLineIndex < bootLogs.length) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setPhase('complete');
      navigate('/identity');
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [activeLineIndex, navigate, phase]);

  useEffect(() => {
    if (phase !== 'booting' || !voiceEnabled || typeof window === 'undefined') {
      return;
    }

    const AudioCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) {
      return;
    }

    const audioContext = new AudioCtor();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(720, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(860, audioContext.currentTime + 0.16);
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.016, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.25);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.28);

    return () => {
      oscillator.disconnect();
      gain.disconnect();
      void audioContext.close();
    };
  }, [phase, voiceEnabled]);

  const progress = useMemo(() => {
    if (phase === 'black') {
      return 8;
    }

    if (phase === 'complete') {
      return 100;
    }

    if (activeLineIndex >= bootLogs.length) {
      return 100;
    }

    const lineRatio = typedText.length / Math.max(bootLogs[activeLineIndex].length, 1);
    return Math.round(((activeLineIndex + lineRatio) / bootLogs.length) * 100);
  }, [activeLineIndex, phase, typedText.length]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070A] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(0,184,255,0.16),_transparent_34%),radial-gradient(circle_at_50%_80%,_rgba(20,241,149,0.1),_transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:64px_64px]" />

      <AnimatePresence mode="wait">
        {phase === 'black' ? (
          <motion.div
            key="black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#14F195]/30 bg-[#14F195]/10 text-[#14F195] shadow-[0_0_40px_rgba(20,241,149,0.18)]">
                <ShieldCheck size={28} />
              </div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.38em] text-slate-500">Sentinel-X</p>
                <p className="mt-2 text-lg font-semibold text-slate-100">Enterprise Security Console</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B1118]/85 shadow-[0_24px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
      >
        <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.03] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
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

        <div className="grid gap-8 px-6 py-7 sm:px-8 sm:py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[#8bdbff]">System Initialization</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
              Preparing your secure review.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">
              Sentinel-X is establishing a trusted environment for the assessment workflow with measured, enterprise-grade precision.
            </p>

            <div className="mt-8 rounded-[1.4rem] border border-white/10 bg-[#05070A]/70 p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between text-sm text-slate-400">
                <span>Boot sequence</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#00B8FF] via-[#2dc8ff] to-[#14F195]"
                />
              </div>

              <div className="mt-5 space-y-3">
                {displayedLines.map((line, index) => (
                  <motion.div
                    key={`${line}-${index}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-slate-300"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-[#14F195]" />
                    {line}
                  </motion.div>
                ))}

                {phase === 'booting' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 rounded-2xl border border-[#00B8FF]/20 bg-[#00B8FF]/10 px-3 py-3 text-sm text-slate-200"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-[#00B8FF]" />
                    {typedText}
                    <span className="ml-1 h-2.5 w-2.5 animate-pulse rounded-full bg-[#00B8FF]" />
                  </motion.div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.4rem] border border-[#14F195]/20 bg-[#14F195]/10 p-4 text-sm text-slate-200">
              <div className="flex items-center gap-2 text-[#14F195]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#14F195]" />
                Green power indicator
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#05070A]/50 px-3 py-2">
                  <span>Power state</span>
                  <span className="font-semibold text-white">Stable</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#05070A]/50 px-3 py-2">
                  <span>Session shield</span>
                  <span className="font-semibold text-white">Active</span>
                </div>
              </div>
            </div>

            {statusCards.map(({ label, value, detail, icon: Icon }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-[1.4rem] border border-white/10 bg-[#05070A]/70 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#00B8FF]/20 bg-[#00B8FF]/10 text-[#00B8FF]">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{label}</p>
                    <p className="font-semibold text-white">{value}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-300">{detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
