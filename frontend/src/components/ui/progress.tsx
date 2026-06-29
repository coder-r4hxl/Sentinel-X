import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

export function Progress({ className, value = 0, ...props }: ProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-white/10', className)} {...props}>

      <div
        className="h-full rounded-full bg-gradient-to-r from-[#00B8FF] via-[#2dc8ff] to-[#14F195]"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

