'use client'

import { useState } from 'react'
import { Copy, FilePlus2, Loader2, Plus, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { cn } from '@/lib/utils'
import { createEmptyVaga, newId } from '@/features/docs/seed'
import { useWeeklyReports } from '@/features/docs/useWeeklyReports'
import { REPORT_PRIORITIES, type ReportPriority, type ReportVaga, type WeeklyReport } from '@/features/docs/types'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' })

const PRIORITY_STYLE: Record<ReportPriority, string> = {
  P0: 'bg-red-100 text-red-700',
  P1: 'bg-amber-100 text-amber-700',
  P2: 'bg-blue-100 text-blue-700',
  P3: 'bg-slate-100 text-slate-600',
}

export function WeeklyReportsManager() {
  const { reports, ready, mutateReport, createReport, duplicateReport, deleteReport } =
    useWeeklyReports()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (!ready) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  const current = reports.find((r) => r.id === selectedId) ?? reports[0] ?? null

  function handleCreate() {
    setSelectedId(createReport())
  }

  function handleDuplicate(id: string) {
    const copyId = duplicateReport(id)
    if (copyId) setSelectedId(copyId)
  }

  function handleDelete(id: string) {
    deleteReport(id)
    setSelectedId(null)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Seletor de relatórios */}
      <div className="flex flex-wrap items-center gap-2">
        {reports.map((report) => (
          <button
            key={report.id}
            type="button"
            onClick={() => setSelectedId(report.id)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
              current?.id === report.id
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {report.titulo || 'Sem título'}
          </button>
        ))}
        <button
          type="button"
          onClick={handleCreate}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'rounded-full')}
        >
          <FilePlus2 className="size-3.5" />
          Novo relatório
        </button>
      </div>

      {current ? (
        <ReportEditor
          key={current.id}
          report={current}
          onMutate={(recipe) => mutateReport(current.id, recipe)}
          onDuplicate={() => handleDuplicate(current.id)}
          onDelete={() => handleDelete(current.id)}
        />
      ) : (
        <Card className="ring-foreground/5">
          <CardContent className="flex min-h-[30vh] flex-col items-center justify-center gap-3 p-8 text-center text-muted-foreground">
            <p className="text-sm">Nenhum relatório ainda.</p>
            <button
              type="button"
              onClick={handleCreate}
              className={cn(buttonVariants({ size: 'sm' }))}
            >
              <Plus className="size-4" />
              Criar primeiro relatório
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ReportEditor({
  report,
  onMutate,
  onDuplicate,
  onDelete,
}: {
  report: WeeklyReport
  onMutate: (recipe: (report: WeeklyReport) => WeeklyReport) => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  function mutateVaga(vagaId: string, recipe: (vaga: ReportVaga) => ReportVaga) {
    onMutate((r) => ({
      ...r,
      vagas: r.vagas.map((v) => (v.id === vagaId ? recipe(v) : v)),
    }))
  }

  function addVaga() {
    onMutate((r) => ({ ...r, vagas: [...r.vagas, createEmptyVaga()] }))
  }

  function removeVaga(vagaId: string) {
    onMutate((r) => ({ ...r, vagas: r.vagas.filter((v) => v.id !== vagaId) }))
  }

  return (
    <Card className="ring-foreground/5">
      <CardContent className="flex flex-col gap-6 p-5 sm:p-6">
        {/* Cabeçalho do relatório */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold tracking-wide text-primary uppercase">
              Relatório semanal
            </label>
            <Input
              value={report.titulo}
              onChange={(e) => onMutate((r) => ({ ...r, titulo: e.target.value }))}
              placeholder="dd/mm/aaaa"
              className="h-11 w-56 text-lg font-bold"
            />
            <p className="text-xs text-muted-foreground">
              Criado em {dateFormatter.format(new Date(report.criadoEm))}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDuplicate}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            >
              <Copy className="size-3.5" />
              Duplicar
            </button>
            <button
              type="button"
              onClick={onDelete}
              className={cn(buttonVariants({ variant: 'destructive', size: 'sm' }))}
            >
              <Trash2 className="size-3.5" />
              Excluir
            </button>
          </div>
        </div>

        {/* Vagas */}
        {report.vagas.map((vaga) => (
          <VagaEditor
            key={vaga.id}
            vaga={vaga}
            canRemove={report.vagas.length > 1}
            onMutate={(recipe) => mutateVaga(vaga.id, recipe)}
            onRemove={() => removeVaga(vaga.id)}
          />
        ))}

        <button
          type="button"
          onClick={addVaga}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-fit')}
        >
          <Plus className="size-3.5" />
          Adicionar vaga
        </button>
      </CardContent>
    </Card>
  )
}

function VagaEditor({
  vaga,
  canRemove,
  onMutate,
  onRemove,
}: {
  vaga: ReportVaga
  canRemove: boolean
  onMutate: (recipe: (vaga: ReportVaga) => ReportVaga) => void
  onRemove: () => void
}) {
  function updatePhase(phaseId: string, patch: Partial<{ fase: string; quantidade: string; observacoes: string }>) {
    onMutate((v) => ({
      ...v,
      fases: v.fases.map((f) => (f.id === phaseId ? { ...f, ...patch } : f)),
    }))
  }

  function addPhase() {
    onMutate((v) => ({
      ...v,
      fases: [...v.fases, { id: newId(), fase: '', quantidade: '', observacoes: '' }],
    }))
  }

  function removePhase(phaseId: string) {
    onMutate((v) => ({ ...v, fases: v.fases.filter((f) => f.id !== phaseId) }))
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
      {/* Cabeçalho da vaga: nome editável + prioridade + qtd */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={cn('border-0', PRIORITY_STYLE[vaga.prioridade])}>{vaga.prioridade}</Badge>
        <Input
          value={vaga.nome}
          onChange={(e) => onMutate((v) => ({ ...v, nome: e.target.value }))}
          placeholder="Nome da vaga"
          className="h-9 max-w-64 flex-1 font-semibold"
        />
        <Select
          value={vaga.prioridade}
          onChange={(e) => onMutate((v) => ({ ...v, prioridade: e.target.value as ReportPriority }))}
          className="h-9 w-auto"
        >
          {REPORT_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
        <div className="flex items-center gap-1.5">
          <Input
            type="number"
            min={0}
            value={vaga.qtdVagas}
            onChange={(e) =>
              onMutate((v) => ({ ...v, qtdVagas: Math.max(0, Number(e.target.value) || 0) }))
            }
            className="h-9 w-16 text-center"
          />
          <span className="text-sm text-muted-foreground">
            {vaga.qtdVagas === 1 ? 'vaga' : 'vagas'}
          </span>
        </div>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remover vaga ${vaga.nome}`}
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'ml-auto text-muted-foreground hover:text-destructive')}
          >
            <Trash2 className="size-3.5" />
          </button>
        ) : null}
      </div>

      {/* Tabela de fases */}
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        <div className="grid grid-cols-[minmax(0,1.1fr)_72px_minmax(0,2.4fr)_32px] gap-px bg-border/60 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          <div className="bg-muted/60 px-3 py-2">Fase</div>
          <div className="bg-muted/60 px-2 py-2 text-center">Qt</div>
          <div className="bg-muted/60 px-3 py-2">Observações</div>
          <div className="bg-muted/60" />
        </div>
        <div className="flex flex-col divide-y divide-border/50">
          {vaga.fases.map((fase) => (
            <div
              key={fase.id}
              className="grid grid-cols-[minmax(0,1.1fr)_72px_minmax(0,2.4fr)_32px] items-start gap-2 px-2 py-2"
            >
              <Input
                value={fase.fase}
                onChange={(e) => updatePhase(fase.id, { fase: e.target.value })}
                placeholder="Fase"
                className="h-9 border-transparent bg-transparent font-medium shadow-none focus-visible:border-border focus-visible:bg-background"
              />
              <Input
                value={fase.quantidade}
                onChange={(e) => updatePhase(fase.id, { quantidade: e.target.value })}
                placeholder="—"
                className="h-9 border-transparent bg-transparent px-1 text-center shadow-none focus-visible:border-border focus-visible:bg-background"
              />
              <Textarea
                value={fase.observacoes}
                onChange={(e) => updatePhase(fase.id, { observacoes: e.target.value })}
                placeholder="Observações..."
                rows={1}
                className="min-h-9 resize-y border-transparent bg-transparent py-2 shadow-none focus-visible:border-border focus-visible:bg-background"
              />
              <button
                type="button"
                onClick={() => removePhase(fase.id)}
                aria-label="Remover fase"
                className="mt-1 flex size-7 items-center justify-center rounded-md text-muted-foreground/50 transition-colors hover:bg-muted hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={addPhase}
        className="flex w-fit items-center gap-1 text-xs font-medium text-primary transition-opacity hover:opacity-70"
      >
        <Plus className="size-3.5" />
        Adicionar fase
      </button>
    </div>
  )
}
