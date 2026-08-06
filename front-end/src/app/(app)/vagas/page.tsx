'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, PieChart, Plus } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useVagas } from '@/features/vagas/hooks/useVagas'
import { useCreateVaga } from '@/features/vagas/hooks/useVagaMutations'
import {
  initials,
  prioridadeColor,
  statusColor,
  statusDot,
} from '@/features/vagas/constants'
import type { Vaga } from '@/types/vaga'

export default function VagasPage() {
  const router = useRouter()
  const { data: vagas, isLoading } = useVagas()
  const createVaga = useCreateVaga()

  function handleCreate() {
    createVaga.mutate(
      { name: 'Nova vaga', status: 'Aberta' },
      { onSuccess: (vaga) => router.push(`/vagas/${vaga.id}`) },
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-5">
        <div className="flex items-center gap-3.5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <PieChart className="size-6" strokeWidth={1.75} />
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Indicadores
            </span>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-[2.4rem] sm:leading-[1.05]">
              Vagas / Indicadores
            </h1>
          </div>
        </div>
      </header>

      <Card className="border-border/60 ring-foreground/5">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border/50 px-5 py-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <PieChart className="size-4 text-primary" />
              Vagas
              {vagas ? (
                <span className="text-xs font-normal text-muted-foreground">
                  · {vagas.length}
                </span>
              ) : null}
            </span>
            <button
              type="button"
              onClick={handleCreate}
              disabled={createVaga.isPending}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
            >
              {createVaga.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Plus className="size-3.5" />
              )}
              Nova vaga
            </button>
          </div>

          {isLoading ? (
            <div className="flex min-h-[20vh] items-center justify-center text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : !vagas || vagas.length === 0 ? (
            <div className="flex min-h-[20vh] flex-col items-center justify-center gap-2 p-8 text-center text-sm text-muted-foreground">
              Nenhuma vaga cadastrada ainda.
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              {vagas.map((vaga) => (
                <VagaRow key={vaga.id} vaga={vaga} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function VagaRow({ vaga }: { vaga: Vaga }) {
  return (
    <li>
      <Link
        href={`/vagas/${vaga.id}`}
        className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
      >
        <span className={cn('size-3.5 shrink-0 rounded-full', statusDot(vaga.status))} />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {vaga.name}
        </span>

        <div className="flex shrink-0 items-center gap-1.5">
          {vaga.nivelRequisitado.slice(0, 3).map((nivel) => (
            <Tag key={nivel} className="bg-violet-100 text-violet-700">
              {nivel}
            </Tag>
          ))}
          {vaga.projeto ? (
            <Tag className="bg-slate-100 text-slate-600">{vaga.projeto}</Tag>
          ) : null}
          {vaga.prioridade ? (
            <Tag className={prioridadeColor(vaga.prioridade)}>{vaga.prioridade}</Tag>
          ) : null}
          <Tag className={statusColor(vaga.status)}>{vaga.status}</Tag>

          {vaga.recrutadores.length > 0 ? (
            <div className="ml-1 flex -space-x-1.5">
              {vaga.recrutadores.slice(0, 3).map((r) => (
                <span
                  key={r}
                  title={r}
                  className="flex size-6 items-center justify-center rounded-full border-2 border-card bg-gradient-to-br from-primary to-primary/60 text-[10px] font-semibold text-white"
                >
                  {initials(r)}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </li>
  )
}

function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'hidden shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold sm:inline-block',
        className,
      )}
    >
      {children}
    </span>
  )
}
