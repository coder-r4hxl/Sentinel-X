import { Card } from '@/components/ui/card';

export function DashboardSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-white/10 bg-[#0B1118]/70 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="h-4 w-28 rounded bg-white/10" />
            <div className="h-9 w-24 rounded bg-white/10" />
          </div>
          <div className="mt-4 h-3 w-full rounded bg-white/10" />
          <div className="mt-3 grid gap-2">
            <div className="h-10 w-full rounded bg-white/[0.06]" />
            <div className="h-10 w-full rounded bg-white/[0.06]" />
          </div>
        </Card>
      ))}
    </div>
  );
}

