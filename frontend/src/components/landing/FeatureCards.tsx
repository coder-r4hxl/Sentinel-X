import { motion } from 'framer-motion';
import { BarChart3, Bot, FileText, LockKeyhole, Radar, ScanLine } from 'lucide-react';

const features = [
  {
    title: 'Browser Assessment',
    description: 'Inspect endpoint posture, extension risk, and policy drift with evidence-backed scoring.',
    icon: ScanLine,
  },
  {
    title: 'Threat Intelligence',
    description: 'Correlate observed behaviors with live threat context and exposure pathways.',
    icon: Radar,
  },
  {
    title: 'AI Assistant',
    description: 'Summarize incidents, recommend actions, and surface relevant context in seconds.',
    icon: Bot,
  },
  {
    title: 'Risk Analysis',
    description: 'Quantify business impact with contextual analysis across identity, devices, and cloud.',
    icon: BarChart3,
  },
  {
    title: 'Privacy Scanner',
    description: 'Identify data handling gaps and sensitive exposure before they become compliance issues.',
    icon: LockKeyhole,
  },
  {
    title: 'Professional Reports',
    description: 'Generate concise executive summaries for leadership, auditors, and response teams.',
    icon: FileText,
  },
];

export default function FeatureCards() {
  return (
    <section id="platform" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#00B8FF]">Defense operations</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
            A focused platform for security teams that need precision over noise.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Each module is designed to reinforce a modern SOC workflow with measurable clarity, reporting depth, and operational confidence.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.a
                key={feature.title}
                href="#assessment"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -6, scale: 1.01, boxShadow: '0 20px 70px rgba(0, 0, 0, 0.24)' }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0B1118]/80 p-6 shadow-[0_16px_60px_rgba(0,0,0,0.2)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8FF]/70"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,184,255,0.16),_transparent_35%)] opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00B8FF]/40 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#00B8FF]/10 blur-2xl transition duration-300 group-hover:scale-125" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#00B8FF]/20 bg-[#00B8FF]/10 text-[#00B8FF] shadow-[0_0_25px_rgba(0,184,255,0.12)] transition duration-300 group-hover:border-[#00B8FF]/40 group-hover:bg-[#00B8FF]/15">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
