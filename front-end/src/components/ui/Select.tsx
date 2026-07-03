import * as React from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        data-slot="select"
        className={cn(
          'flex h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-9 text-sm text-foreground shadow-sm transition-colors',
          'focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
})
