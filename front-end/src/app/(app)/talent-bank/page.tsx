'use client'

import { useMemo, useState } from 'react'
import { Loader2, Search, SlidersHorizontal, Users, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { TalentKanbanBoard } from '@/features/talent-bank/components/TalentKanbanBoard'
import { useTalentApplications } from '@/features/talent-bank/hooks/useTalentApplications'

const ALL = 'Todas'

export default function TalentBankPage() {
  const { data: applications, isLoading } = useTalentApplications()
  const [query, setQuery] = useState('')
  const [vaga, setVaga] = useState(ALL)
  const [cidade, setCidade] = useState(ALL)
  const [seniority, setSeniority] = useState(ALL)

  const vagas = useMemo(() => {
    const values = new Set(
      (applications ?? []).map((a) => a.vaga).filter((v): v is string => Boolean(v)),
    )
    return [ALL, ...Array.from(values).sort()]
  }, [applications])

  const cidades = useMemo(() => {
    const values = new Set(
      (applications ?? []).map((a) => a.city).filter(Boolean),
    )
    return [ALL, ...Array.from(values).sort()]
  }, [applications])

  const seniorities = useMemo(() => {
    const values = new Set(
      (applications ?? []).map((a) => a.seniority).filter((v): v is string => Boolean(v)),
    )
    return [ALL, ...Array.from(values).sort()]
  }, [applications])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (applications ?? []).filter((a) => {
      if (vaga !== ALL && a.vaga !== vaga) return false
      if (cidade !== ALL && a.city !== cidade) return false
      if (seniority !== ALL && a.seniority !== seniority) return false
      if (!q) return true
      return [a.fullName, a.preferredName, a.stacks]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [applications, query, vaga, cidade, seniority])

  const hasApplications = Boolean(applications && applications.length > 0)
  const activeCount = [
    query.trim() !== '',
    vaga !== ALL,
    cidade !== ALL,
    seniority !== ALL,
  ].filter(Boolean).length

  function clearFilters() {
    setQuery('')
    setVaga(ALL)
    setCidade(ALL)
    setSeniority(ALL)
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Badge className="w-fit border-0 bg-primary/10 text-primary hover:bg-primary/15">
          Banco de Talentos
        </Badge>
        <h1 className="font-display text-3xl font-bold tracking-tight">Pipe de candidaturas</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe cada pessoa pelo funil do processo seletivo. Arraste o card entre as colunas
          ou use o seletor de estágio dentro do card.
        </p>
      </header>

      {hasApplications ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />

            <div className="relative min-w-0 flex-1 sm:max-w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nome ou stack..."
                className="pl-9"
              />
            </div>

            <Select value={vaga} onChange={(e) => setVaga(e.target.value)} className="w-auto">
              {vagas.map((v) => (
                <option key={v} value={v}>
                  {v === ALL ? 'Todas as vagas' : v}
                </option>
              ))}
            </Select>

            <Select value={cidade} onChange={(e) => setCidade(e.target.value)} className="w-auto">
              {cidades.map((c) => (
                <option key={c} value={c}>
                  {c === ALL ? 'Todas as cidades' : c}
                </option>
              ))}
            </Select>

            <Select
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
              className="w-auto"
            >
              {seniorities.map((s) => (
                <option key={s} value={s}>
                  {s === ALL ? 'Toda senioridade' : s}
                </option>
              ))}
            </Select>

            <span className="ml-auto text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'pessoa' : 'pessoas'}
              {activeCount > 0 ? ` de ${applications?.length}` : null}
            </span>
          </div>

          {activeCount > 0 ? (
            <div className="flex items-center gap-2">
              {query.trim() ? (
                <FilterChip label={`"${query.trim()}"`} onRemove={() => setQuery('')} />
              ) : null}
              {vaga !== ALL ? (
                <FilterChip label={vaga} onRemove={() => setVaga(ALL)} />
              ) : null}
              {cidade !== ALL ? (
                <FilterChip label={cidade} onRemove={() => setCidade(ALL)} />
              ) : null}
              {seniority !== ALL ? (
                <FilterChip label={seniority} onRemove={() => setSeniority(ALL)} />
              ) : null}
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                Limpar tudo
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {isLoading ? (
        <Card className="border-border/60 ring-foreground/5">
          <CardContent className="flex min-h-[30vh] items-center justify-center p-0 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </CardContent>
        </Card>
      ) : !hasApplications ? (
        <Card className="border-border/60 ring-foreground/5">
          <CardContent className="flex min-h-[30vh] flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
            <Users className="size-8" />
            <p className="text-sm">Ainda não há candidaturas registradas.</p>
          </CardContent>
        </Card>
      ) : (
        <TalentKanbanBoard applications={filtered} />
      )}
    </div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remover filtro ${label}`}>
        <X className="size-3" />
      </button>
    </span>
  )
}
