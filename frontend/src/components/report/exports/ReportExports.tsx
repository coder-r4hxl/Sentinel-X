import { motion } from 'framer-motion';
import { Copy, Download, Printer, Share2 } from 'lucide-react';

interface ReportExportsProps {
  onDownloadJson: () => void;
  onDownloadPdf: () => void;
  onCopyReport: () => void;
  onPrintReport: () => void;
  onShareSummary: () => void;
}

const actions = [
  { label: 'Download JSON', icon: Download, onClick: (props: ReportExportsProps) => props.onDownloadJson() },
  { label: 'Download PDF', icon: Download, onClick: (props: ReportExportsProps) => props.onDownloadPdf() },
  { label: 'Copy Report', icon: Copy, onClick: (props: ReportExportsProps) => props.onCopyReport() },
  { label: 'Print Report', icon: Printer, onClick: (props: ReportExportsProps) => props.onPrintReport() },
  { label: 'Share Summary', icon: Share2, onClick: (props: ReportExportsProps) => props.onShareSummary() },
];

export function ReportExports(props: ReportExportsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {actions.map(({ label, icon: Icon, onClick }) => (
        <motion.button
          key={label}
          whileHover={{ y: -1, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onClick(props)}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0B1118]/85 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-[#00B8FF]/40 hover:text-white"
        >
          <Icon size={16} />
          {label}
        </motion.button>
      ))}
    </div>
  );
}
