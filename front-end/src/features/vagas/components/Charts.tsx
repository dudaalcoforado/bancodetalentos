'use client'

import { cn } from '@/lib/utils'

export interface ChartDatum {
  label: string
  value: number
}

function ChartEmpty() {
  return (
    <div className="flex min-h-[8rem] items-center justify-center text-xs text-muted-foreground/60">
      Sem dados para os filtros atuais.
    </div>
  )
}

/** Horizontal bars — category identity on the left, magnitude as bar length. */
export function HBarChart({
  data,
  colorClass = 'bg-primary',
  format = (v) => String(v),
}: {
  data: ChartDatum[]
  colorClass?: string
  format?: (value: number) => string
}) {
  if (data.length === 0) return <ChartEmpty />
  const max = Math.max(1, ...data.map((d) => d.value))

  return (
    <div className="flex flex-col gap-2.5">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3 text-xs">
          <span className="w-28 shrink-0 truncate text-muted-foreground" title={d.label}>
            {d.label}
          </span>
          <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-muted/50">
            <div
              className={cn('absolute inset-y-0 left-0 rounded-md', colorClass)}
              style={{ width: `${Math.max(3, (d.value / max) * 100)}%` }}
              title={`${d.label}: ${format(d.value)}`}
            />
          </div>
          <span className="w-12 shrink-0 text-right font-semibold tabular-nums text-foreground">
            {format(d.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Vertical bars — ordered categories (e.g. months) across the x-axis. */
export function VBarChart({
  data,
  colorClass = 'bg-primary',
}: {
  data: ChartDatum[]
  colorClass?: string
}) {
  if (data.length === 0) return <ChartEmpty />
  const max = Math.max(1, ...data.map((d) => d.value))

  return (
    <div className="flex items-end gap-3 pt-6">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-36 w-full items-end">
            <div
              className={cn('relative min-h-[4px] w-full rounded-t-md', colorClass)}
              style={{ height: `${Math.max(4, (d.value / max) * 100)}%` }}
              title={`${d.label}: ${d.value}`}
            >
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold tabular-nums text-foreground">
                {d.value}
              </span>
            </div>
          </div>
          <span className="text-[11px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
