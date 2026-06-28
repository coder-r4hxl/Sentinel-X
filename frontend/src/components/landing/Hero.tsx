import { motion } from 'framer-motion';
import { Activity, ArrowRight, CheckCircle2, PlayCircle, ShieldCheck, Sparkles } from 'lucide-react';

const trustIndicators = [
  'SOC-ready operations',
  'Real-time threat posture',
  'ISO-aligned reporting',
];

const telemetry = [
  { label: 'Browser health', value: '98.7%', accent: 'text-[#00B8FF]' },
  { label: 'AI triage', value: 'Live', accent: 'text-[#14F195]' },
  { label: 'Telemetry lag', value: '1.8s', accent: 'text-slate-100' },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pb-20 pt-8 sm:px-6 lg:px-8 lg:pb-28 lg:pt-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(0,184,255,0.16),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(20,241,149,0.10),_transparent_26%)]" />
      <motion.div
        animate={{ y: [0, -12, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-6 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[#00B8FF]/20 blur-3xl sm:h-[30rem] sm:w-[30rem]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/10 px-3.5 py-1.5 text-sm text-[#8bdbff] shadow-[0_0_28px_rgba(0,184,255,0.08)]"
          >
            <Sparkles size={14} />
            Enterprise-grade cyber defense, simplified
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: 'easeOut' }}
            className="max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.03em] text-white sm:text-5xl lg:text-7xl"
          >
            See the attack surface before it becomes an incident.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease: 'easeOut' }}
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl"
          >
            Sentinel-X continuously evaluates browser posture, identifies exposure, and delivers executive-ready insights that help security teams act with clarity and speed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <motion.a
              href="#assessment"
              whileHover={{ y: -1, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00B8FF] px-6 py-3.5 text-sm font-semibold text-[#05070A] shadow-[0_16px_45px_rgba(0,184,255,0.22)] transition duration-200 hover:bg-[#2dc8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8FF]/70"
            >
              Start a Security Review
              <ArrowRight size={16} />
            </motion.a>
            <motion.a
              href="#platform"
              whileHover={{ y: -1, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-slate-100 transition duration-200 hover:border-[#00B8FF]/30 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8FF]/70"
            >
              <PlayCircle size={16} />
              Watch the Platform
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26, ease: 'easeOut' }}
            className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-400"
          >
            {trustIndicators.map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2">
                <CheckCircle2 size={15} className="text-[#14F195]" />
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="relative"
        >
          <div className="rounded-[2rem] border border-white/10 bg-[#0B1118]/90 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Live telemetry</p>
                <p className="mt-1 text-xl font-semibold text-white">Cyber intelligence overview</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#14F195]/20 bg-[#14F195]/10 px-3 py-1.5 text-sm text-[#14F195]">
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="h-2.5 w-2.5 rounded-full bg-[#14F195]"
                />
                Secure
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {telemetry.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                  <p className={`mt-2 text-lg font-semibold ${item.accent}`}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-[#05070A]/70 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Activity size={15} className="text-[#00B8FF]" />
                  Active protections
                </div>
                <span className="text-sm font-medium text-slate-400">12 online</span>
              </div>

              <div className="mt-4 flex h-24 items-end gap-2">
                {[38, 58, 44, 72, 62, 84, 74].map((height, index) => (
                  <motion.div
                    key={height}
                    initial={{ height: 10 }}
                    animate={{ height }}
                    transition={{ duration: 0.8, delay: index * 0.06 }}
                    className="flex-1 rounded-full bg-gradient-to-t from-[#00B8FF]/20 to-[#00B8FF]"
                  />
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.34, ease: 'easeOut' }}
              className="mt-6 rounded-[1.4rem] border border-[#00B8FF]/20 bg-[#00B8FF]/10 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#00B8FF]/20 p-2 text-[#00B8FF]">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="font-medium text-white">Integrated defense workflow</p>
                  <p className="text-sm text-slate-300">Coordinate assessment, triage, and reporting from one secure surface.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
