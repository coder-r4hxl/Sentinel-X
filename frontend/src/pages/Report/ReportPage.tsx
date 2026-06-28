import { motion } from 'framer-motion';
import { FileText, ShieldCheck } from 'lucide-react';
import { useMemo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssessmentStore } from '@/store/assessmentStore';

export default function ReportPage() {
  const { report } = useAssessmentStore();

  const summary = useMemo(() => {
    if (!report) {
      return [];
    }

    return [
      { label: 'Browser Security Score', value: `${report.browserSecurityScore}/100` },
      { label: 'Privacy Score', value: `${report.privacyScore}/100` },
      { label: 'Compatibility Score', value: `${report.compatibilityScore}/100` },
      { label: 'Risk Rating', value: report.riskRating },
    ];
  }, [report]);

  return (
    <div className="min-h-screen bg-[#05070A] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/10 px-3.5 py-1.5 text-sm text-[#8bdbff]">
            <ShieldCheck size={14} />
            Executive report
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Assessment summary</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">Sentinel-X compiles the browser posture findings into a concise, board-ready view of security posture.</p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-white/10 bg-[#0B1118]/85">
            <CardHeader>
              <CardTitle>Summary metrics</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {summary.map((item) => (
                <div key={item.label} className="rounded-[1.25rem] border border-white/10 bg-[#05070A]/70 p-4">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#0B1118]/85">
            <CardHeader>
              <CardTitle>Findings overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {report?.findings.map((finding) => (
                <div key={finding} className="flex items-start gap-3 rounded-[1rem] border border-white/10 bg-[#05070A]/70 p-3 text-sm text-slate-300">
                  <FileText size={16} className="mt-0.5 text-[#00B8FF]" />
                  <span>{finding}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
