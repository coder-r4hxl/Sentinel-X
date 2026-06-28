import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AiSummaryProps {
  text: string;
}

export function AiSummary({ text }: AiSummaryProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.5rem] border border-[#00B8FF]/20 bg-[#00B8FF]/10 p-5">
      <div className="flex items-center gap-2 text-[#8bdbff]">
        <Sparkles size={16} />
        AI executive summary
      </div>
      <p className="mt-4 text-lg leading-8 text-slate-200">{text}</p>
    </motion.div>
  );
}
