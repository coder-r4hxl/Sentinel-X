import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { ThreatFinding } from '@/types/dashboard';

import { ReportFindings } from '@/components/report/findings/ReportFindings';

export function ThreatOverview({ threatAndFindings }: { threatAndFindings: ThreatFinding[] }) {
  return (
    <Card className="border-white/10 bg-[#0B1118]/70">
      <CardHeader>
        <CardTitle className="text-white">Threat & Findings</CardTitle>
      </CardHeader>
      <CardContent>
        <ReportFindings
          groups={threatAndFindings.map((f) => ({
            title: f.title,
            severity: f.severity,
            description: f.description,
            action: f.action,
          }))}
        />
      </CardContent>
    </Card>
  );
}


