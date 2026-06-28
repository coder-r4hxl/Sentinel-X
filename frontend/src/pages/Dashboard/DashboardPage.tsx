import { motion } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#05070A] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-[#0B1118]/80 px-6 py-16 text-center shadow-[0_24px_120px_rgba(0,0,0,0.45)]">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex h-16 w-16 items-center justify-center rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/10">
          <LayoutGrid size={24} className="text-[#00B8FF]" />
        </motion.div>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Dashboard</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">The dashboard route is ready for the next implementation phase.</p>
      </div>
    </div>
  );
}
