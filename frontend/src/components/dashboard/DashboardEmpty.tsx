import { AlertTriangle, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardEmpty({ onRunAssessment, onReviewPermissions }: { onRunAssessment: () => void; onReviewPermissions: () => void; }) {
  return (
    <Card className="border-white/10 bg-[#0B1118]/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <AlertTriangle className="text-[#f5c76b]" size={20} />
          No assessment data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-slate-300">
          Run an assessment to generate the enterprise-ready dashboard. The engine stays local and produces an executive view of your browser posture.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button onClick={onRunAssessment}>Run assessment <ArrowRight size={16} /></Button>
          <Button variant="secondary" onClick={onReviewPermissions}>
            Review permission status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

