import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>>(
  ({ className, sideOffset = 6, ...props }, ref) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-lg border border-white/10 bg-[#0B1118]/95 px-3 py-2 text-xs text-slate-100 shadow-[0_18px_60px_rgba(0,0,0,0.45)]',
        className,
      )}
      {...props}
    />
  ),
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent };

