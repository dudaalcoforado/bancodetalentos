import Link from 'next/link'

import { cn } from '@/lib/utils'

/**
 * Loomi wordmark — a gradient "L" tile + typographic logotype.
 * Replaces the legacy image logo across the app shells.
 */
export function Brand({
  href = '/',
  onDark = false,
  className,
}: {
  href?: string
  onDark?: boolean
  className?: string
}) {
  return (
    <Link href={href} className={cn('group flex items-center gap-2.5', className)}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 font-display text-sm font-bold text-white shadow-sm shadow-primary/25 transition-transform duration-200 group-hover:scale-105">
        L
      </span>
      <span
        className={cn(
          'font-display text-[15px] font-semibold tracking-tight',
          onDark ? 'text-white' : 'text-foreground',
        )}
      >
        loomi<span className="text-primary">.</span>
      </span>
    </Link>
  )
}
