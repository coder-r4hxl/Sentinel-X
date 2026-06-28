import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-2xl border border-white/10 bg-[#0B1118]/80 px-4 py-3 text-sm text-slate-100 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-[#00B8FF]/40 focus:ring-2 focus:ring-[#00B8FF]/20',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
