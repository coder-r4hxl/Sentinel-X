import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface SystemInfoCardProps {
  title: string;
  items: Array<{ label: string; value: string }>;
}

export function SystemInfoCard({ title, items }: SystemInfoCardProps) {
  const [open, setOpen] = useState(true);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.25rem] border border-white/10 bg-[#0B1118]/85">
      <button type="button" className="flex w-full items-center justify-between px-4 py-4 text-left" onClick={() => setOpen((value) => !value)}>
        <span className="text-lg font-semibold text-white">{title}</span>
        {open ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
      </button>
      {open ? (
        <div className="grid gap-3 border-t border-white/10 px-4 py-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.label} className="rounded-[1rem] border border-white/10 bg-[#05070A]/70 p-3">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-2 text-sm font-medium text-white">{item.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}
