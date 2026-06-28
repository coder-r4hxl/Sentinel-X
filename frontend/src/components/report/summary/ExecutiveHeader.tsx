import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

interface ExecutiveHeaderProps {
  assessmentId: string;
  timestamp: string;
  browser: string;
  os: string;
  score: number;
  risk: string;
}

function getRiskColor(risk: string) {
  switch (risk) {
    case 'Excellent':
      return 'text-[#14F195]';
    case 'Good':
      return 'text-[#00B8FF]';
    case 'Moderate':
      return 'text-[#f5c76b]';
    default:
      return 'text-[#ff7a59]';
  }
}

export function ExecutiveHeader({ assessmentId, timestamp, browser, os, score, risk }: ExecutiveHeaderProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#0B1118]/85 p-6 shadow-[0_24px_120px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/10 px-3.5 py-1.5 text-sm text-[#8bdbff]">
            <ShieldCheck size={14} />
            Assessment Completed
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Executive Security Report</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Sentinel-X translated the local browser assessment into a concise, board-ready view of risk, performance, and compatibility.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/70 p-4">
              <p className="text-sm text-slate-400">Assessment ID</p>
              <p className="mt-2 text-sm font-semibold text-white">{assessmentId}</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/70 p-4">
              <p className="text-sm text-slate-400">Date & time</p>
              <p className="mt-2 text-sm font-semibold text-white">{timestamp}</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/70 p-4">
              <p className="text-sm text-slate-400">Browser</p>
              <p className="mt-2 text-sm font-semibold text-white">{browser}</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/70 p-4">
              <p className="text-sm text-slate-400">Operating system</p>
              <p className="mt-2 text-sm font-semibold text-white">{os}</p>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center rounded-[1.75rem] border border-white/10 bg-[#05070A]/70 p-6">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg viewBox="0 0 140 140" className="h-32 w-32 -rotate-90">
              <circle cx="70" cy="70" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="none" />
              <motion.circle
                cx="70"
                cy="70"
                r={radius}
                stroke="#00B8FF"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute text-center">
              <p className="text-4xl font-semibold text-white">{score}</p>
              <p className="text-sm text-slate-400">/ 100</p>
            </div>
          </div>
          <p className={`mt-4 text-lg font-semibold ${getRiskColor(risk)}`}>{risk}</p>
          <p className="text-sm text-slate-400">Overall risk rating</p>
        </motion.div>
      </div>
    </div>
  );
}
