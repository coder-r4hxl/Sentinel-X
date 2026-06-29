import { TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function DashboardError({ errorMessage, onRetry }: { errorMessage: string; onRetry: () => void; }) {
  return (
    <div className="rounded-[2rem] border border-[#ff7a59]/30 bg-[#0B1118]/70 p-6">
      <div className="flex items-center gap-3">
        <TriangleAlert className="text-[#ff7a59]" size={20} />
        <p className="font-semibold text-white">Dashboard error</p>
      </div>
      <p className="mt-2 text-slate-300">{errorMessage}</p>
      <div className="mt-4">
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}

