import * as React from 'react';

import { cn } from '@/lib/utils';

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'border border-white/10 bg-white/[0.03] text-slate-100',
    secondary: 'border border-white/10 bg-white/[0.04] text-slate-100',
    outline: 'border border-white/10 bg-transparent text-slate-100',
    success: 'border-[#14F195]/20 bg-[#14F195]/10 text-[#14F195]',
    warning: 'border-[#f5c76b]/20 bg-[#f5c76b]/10 text-[#f5c76b]',
    danger: 'border-[#ff7a59]/20 bg-[#ff7a59]/10 text-[#ff7a59]',
  };

  return <div className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]', variantClasses[variant], className)} {...props} />;
}

