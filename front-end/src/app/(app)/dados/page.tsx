'use client'

import { useMemo, useState } from 'react'
import { BarChart3, Loader2 } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { HBarChart, VBarChart, type ChartDatum } from '@/features/vagas/components/Charts'
import { useVagas } from '@/features/vagas/hooks/useVagas'
import type { Vaga } from '@/types/vaga'

const MS_PER_DAY = 1000 * 60 * 60 * 24
const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

const FILTERS = [
  { id: 'fonte', label: 'Fonte' },
  { id: 'tempo', label: 'Tempo de contratação' },
  { id: 'abertas', label: 'Vagas abertas no mês' },
  { id: 'fechadas', label: 'Vagas Fechadas no mês' },
] as const

type FilterId = (typeof FILTERS)[number]['id']

function monthKey(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`
}

function monthLabel(key: string): string {
  const [year, month] = key.split('-')
  return `${MONTHS[Number(month)]}/${year.slice(2)}`
}

function countByMonth(vagas: Vaga[], field: 'abertura' | 'fechamento'): ChartDatum[] {
  const buckets = new Map<string, number>()
  for (const vaga of vagas) {
    const value = vaga[field]
    if (!value) continue
    const key = monthKey(value)
    buckets.set(key, (buckets.get(key) ?? 0) + 1)
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({ label: monthLabel(key), value }))
}

export default function DadosPage() {
  const { data: vagas, isLoading } = useVagas()
  const [selected, setSelected] = useState<Set<FilterId>>(
    () => new Set(FILTERS.map((f) => f.id)),
  )

  function toggle(id: FilterId) {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const list = useMemo(() => vagas ?? [], [vagas])

  const fonteData = useMemo<ChartDatum[]>(() => {
    const buckets = new Map<string, number>()
    for (const v of list) {
      const key = v.fonte ?? 'Sem fonte'
      buckets.set(key, (buckets.get(key) ?? 0) + 1)
    }
    return [...buckets.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
  }, [list])

  const tempoData = useMemo<ChartDatum[]>(() => {
    return list
      .filter((v) => v.abertura && v.fechamento)
      .map((v) => ({
        label: v.name,
        value: Math.max(
          0,
          Math.round(
            (new Date(v.fechamento as string).getTime() -
              new Date(v.abertura as string).getTime()) /
              MS_PER_DAY,
          ),
        ),
      }))
      .sort((a, b) => b.value - a.value)
  }, [list])

  const abertasData = useMemo(() => countByMonth(list, 'abertura'), [list])
  const fechadasData = useMemo(() => countByMonth(list, 'fechamento'), [list])

  const avgTempo = useMemo(() => {
    if (tempoData.length === 0) return null
    return Math.round(tempoData.reduce((sum, d) => sum + d.value, 0) / tempoData.length)
  }, [tempoData])

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-3.5">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BarChart3 className="size-6" strokeWidth={1.75} />
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Indicadores
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-[2.4rem] sm:leading-[1.05]">
            Dados
          </h1>
        </div>
      </header>

      <p className="max-w-xl text-sm text-muted-foreground">
        Selecione um ou mais indicadores. Os gráficos são preenchidos automaticamente a partir da
        página de <span className="font-medium text-foreground">Vagas</span>.
      </p>

      {/* Multi-select filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = selected.has(f.id)
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => toggle(f.id)}
              aria-pressed={active}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-muted',
              )}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <Card className="border-border/60 ring-foreground/5">
          <CardContent className="flex min-h-[30vh] items-center justify-center p-0 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </CardContent>
        </Card>
      ) : selected.size === 0 ? (
        <Card className="border-border/60 ring-foreground/5">
          <CardContent className="flex min-h-[20vh] items-center justify-center p-8 text-center text-sm text-muted-foreground">
            Selecione ao menos um indicador acima.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {selected.has('fonte') ? (
            <ChartCard title="Vagas por fonte" subtitle="Distribuição das vagas por origem">
              <HBarChart data={fonteData} />
            </ChartCard>
          ) : null}

          {selected.has('tempo') ? (
            <ChartCard
              title="Tempo de contratação"
              subtitle={
                avgTempo != null
                  ? `Média de ${avgTempo} dias entre abertura e fechamento`
                  : 'Dias entre abertura e fechamento'
              }
            >
              <HBarChart data={tempoData} format={(v) => `${v}d`} />
            </ChartCard>
          ) : null}

          {selected.has('abertas') ? (
            <ChartCard title="Vagas abertas no mês" subtitle="Aberturas por mês">
              <VBarChart data={abertasData} />
            </ChartCard>
          ) : null}

          {selected.has('fechadas') ? (
            <ChartCard title="Vagas fechadas no mês" subtitle="Fechamentos por mês">
              <VBarChart data={fechadasData} colorClass="bg-emerald-500" />
            </ChartCard>
          ) : null}
        </div>
      )}
    </div>
  )
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <Card className="border-border/60 ring-foreground/5">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}
