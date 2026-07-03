'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { ArrowUpRight } from 'lucide-react'

import { Select } from '@/components/ui/Select'
import { TALENT_STAGES, type TalentApplicationStage } from '@/features/talent-bank/stages'
import { useUpdateStage } from '@/features/talent-bank/hooks/useUpdateStage'
import { cn } from '@/lib/utils'
import type { TalentApplication } from '@/types/talent-application'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })

function vagaColorClass(vaga: string | null): string {
  if (!vaga) return 'bg-primary/10 text-primary'
  const v = vaga.toLowerCase()
  if (/designer|design gr/.test(v)) return 'bg-pink-100 text-pink-700'
  if (/product|owner|projeto|gerente/.test(v)) return 'bg-amber-100 text-amber-700'
  if (/dado|data|analista/.test(v)) return 'bg-blue-100 text-blue-700'
  if (/comercial|marketing|financeiro/.test(v)) return 'bg-teal-100 text-teal-700'
  if (/pessoas|cultura|rh|people/.test(v)) return 'bg-green-100 text-green-700'
  return 'bg-primary/10 text-primary'
}

export function TalentKanbanBoard({ applications }: { applications: TalentApplication[] }) {
  const updateStage = useUpdateStage()
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const byStage = useMemo(() => {
    const map = new Map<TalentApplicationStage, TalentApplication[]>()
    for (const stage of TALENT_STAGES) map.set(stage.value, [])
    for (const application of applications) {
      map.get(application.stage)?.push(application)
    }
    return map
  }, [applications])

  const activeApplication = activeId
    ? applications.find((a) => a.id === activeId) ?? null
    : null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const stage = event.over?.id as TalentApplicationStage | undefined
    const id = String(event.active.id)
    const application = applications.find((a) => a.id === id)
    if (!stage || !application || application.stage === stage) return
    updateStage.mutate({ id, stage })
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex gap-3.5 overflow-x-auto pb-3">
        {TALENT_STAGES.map((stage) => (
          <KanbanColumn
            key={stage.value}
            stage={stage.value}
            label={stage.label}
            accent={stage.accent}
            dot={stage.dot}
            applications={byStage.get(stage.value) ?? []}
            onChangeStage={(id, nextStage) => updateStage.mutate({ id, stage: nextStage })}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeApplication ? (
          <KanbanCardContent application={activeApplication} dragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function KanbanColumn({
  stage,
  label,
  accent,
  dot,
  applications,
  onChangeStage,
}: {
  stage: TalentApplicationStage
  label: string
  accent: string
  dot: string
  applications: TalentApplication[]
  onChangeStage: (id: string, stage: TalentApplicationStage) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex w-[250px] shrink-0 flex-col gap-2.5 rounded-2xl border border-border/30 bg-muted/25 p-3 transition-colors duration-150',
        isOver && 'border-primary/40 bg-primary/5',
      )}
    >
      {/* Column header */}
      <div className={cn('flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-[12.5px] font-semibold', accent)}>
        <span className={cn('size-2 shrink-0 rounded-full', dot)} />
        <span className="flex-1 truncate">{label}</span>
        <span className="shrink-0 rounded-full border border-current/20 bg-white/70 px-2 py-px text-[11px] font-medium opacity-75">
          {applications.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex max-h-[calc(100vh-320px)] flex-col gap-2 overflow-y-auto pr-0.5">
        {applications.map((application) => (
          <KanbanCard key={application.id} application={application} onChangeStage={onChangeStage} />
        ))}
        {applications.length === 0 ? (
          <p className="py-3 text-center text-xs text-muted-foreground/40">—</p>
        ) : null}
      </div>
    </div>
  )
}

function KanbanCard({
  application,
  onChangeStage,
}: {
  application: TalentApplication
  onChangeStage: (id: string, stage: TalentApplicationStage) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: application.id })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        'touch-none cursor-grab rounded-2xl border border-border/50 bg-card p-3 shadow-sm',
        'transition-all duration-150 active:cursor-grabbing',
        'hover:-translate-y-px hover:border-primary/30 hover:shadow-md hover:shadow-primary/10',
        isDragging && 'opacity-40',
      )}
    >
      <KanbanCardContent application={application} onChangeStage={onChangeStage} />
    </div>
  )
}

function KanbanCardContent({
  application,
  dragging,
  onChangeStage,
}: {
  application: TalentApplication
  dragging?: boolean
  onChangeStage?: (id: string, stage: TalentApplicationStage) => void
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        dragging && 'w-[250px] rounded-2xl border border-border bg-card p-3 shadow-2xl shadow-primary/20',
      )}
    >
      {/* Avatar + name + link */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-xs font-semibold text-white">
            {application.preferredName.charAt(0).toUpperCase()}
          </span>
          <span className="truncate text-[13.5px] font-semibold text-foreground">
            {application.preferredName}
          </span>
        </div>
        <Link
          href={`/talent-bank/${application.id}`}
          onPointerDown={(e) => e.stopPropagation()}
          className="shrink-0 text-muted-foreground/40 transition-colors hover:text-primary"
          aria-label={`Abrir candidatura de ${application.preferredName}`}
        >
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      {/* Vaga pill */}
      {application.vaga ? (
        <span
          className={cn(
            'w-fit max-w-full truncate rounded-lg px-2.5 py-1 text-[11.5px] font-semibold leading-tight',
            vagaColorClass(application.vaga),
          )}
        >
          {application.vaga}
        </span>
      ) : null}

      {/* Seniority · city */}
      <p className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
        {application.seniority ? (
          <>
            <span>{application.seniority}</span>
            <span className="opacity-40">·</span>
          </>
        ) : null}
        <span className="truncate">{application.city}</span>
      </p>

      {/* Stage selector */}
      {onChangeStage ? (
        <Select
          value={application.stage}
          onPointerDown={(e) => e.stopPropagation()}
          onChange={(e) => onChangeStage(application.id, e.target.value as TalentApplicationStage)}
          className="h-7 rounded-xl border-border/60 text-[11px]"
        >
          {TALENT_STAGES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
      ) : null}

      {/* Date */}
      <span className="border-t border-border/40 pt-2 text-[11px] text-muted-foreground/50">
        {dateFormatter.format(new Date(application.createdAt))}
      </span>
    </div>
  )
}
