import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List ref={ref} className={cn('inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] p-1 text-slate-100', className)} {...props} />
  ),
);
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B8FF]/70 data-[state=active]:bg-[#00B8FF]/15 data-[state=active]:text-white data-[state=active]:shadow-[0_10px_30px_rgba(0,184,255,0.12)]',
        className,
      )}
      {...props}
    />
  ),
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content ref={ref} className={cn('mt-4', className)} {...props} />
  ),
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };

