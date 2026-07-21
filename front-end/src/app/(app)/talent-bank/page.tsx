'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  ChevronDown,
  FileText,
  Heart,
  Loader2,
  PieChart,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from 'lucide-react'

import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent } from '@/components/ui/card'
import { TalentKanbanBoard } from '@/features/talent-bank/components/TalentKanbanBoard'
import { useTalentApplications } from '@/features/talent-bank/hooks/useTalentApplications'
import { RECRUITERS, getDDD } from '@/features/talent-bank/recruiters'
import { cn } from '@/lib/utils'

const ALL = 'Todas'
const UNASSIGNED = '__unassigned__'

export default function TalentBankPage() {
  const { data: applications, isLoading } = useTalentApplications()
  const [query, setQuery] = useState('')
  const [vaga, setVaga] = useState(ALL)
  const [cidade, setCidade] = useState(ALL)
  const [seniority, setSeniority] = useState(ALL)
  const [ddd, setDdd] = useState(ALL)
  const [recruiter, setRecruiter] = useState(ALL)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filtersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!filtersOpen) return
    function handlePointer(event: MouseEvent) {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setFiltersOpen(false)
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setFiltersOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [filtersOpen])

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

  const ddds = useMemo(() => {
    const values = new Set<string>()
    for (const a of applications ?? []) {
      const d = getDDD(a.phone)
      if (d) values.add(d)
    }
    return [ALL, ...Array.from(values).sort()]
  }, [applications])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (applications ?? []).filter((a) => {
      if (vaga !== ALL && a.vaga !== vaga) return false
      if (cidade !== ALL && a.city !== cidade) return false
      if (seniority !== ALL && a.seniority !== seniority) return false
      if (ddd !== ALL && getDDD(a.phone) !== ddd) return false
      if (recruiter !== ALL) {
        if (recruiter === UNASSIGNED ? Boolean(a.recruiter) : a.recruiter !== recruiter) {
          return false
        }
      }
      if (!q) return true
      return [a.fullName, a.preferredName, a.stacks]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [applications, query, vaga, cidade, seniority, ddd, recruiter])

  const hasApplications = Boolean(applications && applications.length > 0)
  const dropdownActiveCount = [
    vaga !== ALL,
    cidade !== ALL,
    seniority !== ALL,
    ddd !== ALL,
    recruiter !== ALL,
  ].filter(Boolean).length
  const activeCount = dropdownActiveCount + (query.trim() !== '' ? 1 : 0)

  function clearFilters() {
    setQuery('')
    setVaga(ALL)
    setCidade(ALL)
    setSeniority(ALL)
    setDdd(ALL)
    setRecruiter(ALL)
  }

  const recruiterLabel = recruiter === UNASSIGNED ? 'Sem recrutador' : recruiter

  return (
    <div className="flex flex-col gap-6">
      {/* Hero */}
      <header className="flex flex-col gap-5">
        <div className="flex items-center gap-3.5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Heart className="size-6" strokeWidth={1.75} />
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Banco de Talentos
            </span>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-[2.4rem] sm:leading-[1.05]">
              Processo Seletivo
            </h1>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 px-5 py-4 sm:max-w-lg">
          <Users className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Atrair os melhores talentos.</span>
            <br />
            Incentivar a evolução e aprendizagem através das etapas e feedbacks.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <HeroLink href="/docs" icon={<FileText className="size-4" />} label="Docs" />
          <HeroLink href="/dados" icon={<BarChart3 className="size-4" />} label="Dados" />
          <HeroLink href="/vagas" icon={<PieChart className="size-4" />} label="Vagas" />
        </div>
      </header>

      {hasApplications ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:max-w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nome ou stack..."
                className="pl-9"
              />
            </div>

            {/* Filters dropdown */}
            <div className="relative" ref={filtersRef}>
              <button
                type="button"
                onClick={() => setFiltersOpen((open) => !open)}
                aria-expanded={filtersOpen}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <SlidersHorizontal className="size-4 text-muted-foreground" />
                Filtros
                {dropdownActiveCount > 0 ? (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                    {dropdownActiveCount}
                  </span>
                ) : null}
                <ChevronDown
                  className={cn(
                    'size-4 text-muted-foreground transition-transform',
                    filtersOpen && 'rotate-180',
                  )}
                />
              </button>

              {filtersOpen ? (
                <div className="absolute left-0 z-20 mt-2 w-64 rounded-xl border border-border bg-card p-3 shadow-lg shadow-foreground/5">
                  <div className="flex flex-col gap-3">
                    <FilterField label="Vaga">
                      <Select value={vaga} onChange={(e) => setVaga(e.target.value)} className="w-full">
                        {vagas.map((v) => (
                          <option key={v} value={v}>
                            {v === ALL ? 'Todas as vagas' : v}
                          </option>
                        ))}
                      </Select>
                    </FilterField>

                    <FilterField label="Cidade">
                      <Select value={cidade} onChange={(e) => setCidade(e.target.value)} className="w-full">
                        {cidades.map((c) => (
                          <option key={c} value={c}>
                            {c === ALL ? 'Todas as cidades' : c}
                          </option>
                        ))}
                      </Select>
                    </FilterField>

                    <FilterField label="Senioridade">
                      <Select
                        value={seniority}
                        onChange={(e) => setSeniority(e.target.value)}
                        className="w-full"
                      >
                        {seniorities.map((s) => (
                          <option key={s} value={s}>
                            {s === ALL ? 'Toda senioridade' : s}
                          </option>
                        ))}
                      </Select>
                    </FilterField>

                    <FilterField label="DDD">
                      <Select value={ddd} onChange={(e) => setDdd(e.target.value)} className="w-full">
                        {ddds.map((d) => (
                          <option key={d} value={d}>
                            {d === ALL ? 'Todos os DDDs' : `DDD ${d}`}
                          </option>
                        ))}
                      </Select>
                    </FilterField>

                    <FilterField label="Recrutador">
                      <Select
                        value={recruiter}
                        onChange={(e) => setRecruiter(e.target.value)}
                        className="w-full"
                      >
                        <option value={ALL}>Todos os recrutadores</option>
                        {RECRUITERS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                        <option value={UNASSIGNED}>Sem recrutador</option>
                      </Select>
                    </FilterField>

                    {dropdownActiveCount > 0 ? (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-1 text-xs text-muted-foreground underline-offset-2 hover:underline"
                      >
                        Limpar filtros
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>

            <span className="ml-auto text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'pessoa' : 'pessoas'}
              {activeCount > 0 ? ` de ${applications?.length}` : null}
            </span>
          </div>

          {activeCount > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
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
              {ddd !== ALL ? (
                <FilterChip label={`DDD ${ddd}`} onRemove={() => setDdd(ALL)} />
              ) : null}
              {recruiter !== ALL ? (
                <FilterChip label={recruiterLabel} onRemove={() => setRecruiter(ALL)} />
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

function HeroLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-px hover:border-primary/40 hover:text-primary hover:shadow-md hover:shadow-primary/10"
    >
      <span className="text-primary">{icon}</span>
      {label}
    </Link>
  )
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
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
