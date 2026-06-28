import { motion } from 'framer-motion';

interface FindingGroup {
  title: string;
  severity: 'critical' | 'warning' | 'recommendation' | 'passed';
  description: string;
  action: string;
}

interface ReportFindingsProps {
  groups: FindingGroup[];
}

function severityStyles(severity: FindingGroup['severity']) {
  switch (severity) {
    case 'critical':
      return 'border-[#ff7a59]/20 bg-[#ff7a59]/10 text-[#ff7a59]';
    case 'warning':
      return 'border-[#f5c76b]/20 bg-[#f5c76b]/10 text-[#f5c76b]';
    case 'recommendation':
      return 'border-[#00B8FF]/20 bg-[#00B8FF]/10 text-[#00B8FF]';
    default:
      return 'border-[#14F195]/20 bg-[#14F195]/10 text-[#14F195]';
  }
}

export function ReportFindings({ groups }: ReportFindingsProps) {
  return (
    <div className="space-y-4">
      {groups.map((group, index) => (
        <motion.div key={group.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="rounded-[1.25rem] border border-white/10 bg-[#0B1118]/85 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-white">{group.title}</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">{group.description}</p>
            </div>
            <div className={`rounded-full border px-2.5 py-1 text-xs uppercase tracking-[0.24em] ${severityStyles(group.severity)}`}>
              {group.severity}
            </div>
          </div>
          <div className="mt-4 rounded-[1rem] border border-white/10 bg-[#05070A]/70 p-3 text-sm text-slate-300">
            <p className="text-slate-400">Recommended action</p>
            <p className="mt-2">{group.action}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
