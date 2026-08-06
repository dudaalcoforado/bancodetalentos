'use client'

import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Pencil, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Separator } from '@/components/ui/separator'
import { RECRUITERS } from '@/features/talent-bank/recruiters'
import {
  VAGA_FONTES,
  VAGA_PRIORIDADES,
  VAGA_STATUS,
  initials,
  prioridadeColor,
  statusColor,
} from '@/features/vagas/constants'
import { useDeleteVaga, useUpdateVaga } from '@/features/vagas/hooks/useVagaMutations'
import { cn } from '@/lib/utils'
import type { Vaga, VagaPayload } from '@/types/vaga'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' })

function fmtDate(value: string | null): string {
  if (!value) return '—'
  return dateFormatter.format(new Date(value))
}

function toDateInput(value: string | null): string {
  return value ? value.slice(0, 10) : ''
}

export function VagaDetail({ vaga }: { vaga: Vaga }) {
  const router = useRouter()
  const update = useUpdateVaga()
  const remove = useDeleteVaga()
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <VagaForm
        vaga={vaga}
        saving={update.isPending}
        onCancel={() => setEditing(false)}
        onSave={(payload) =>
          update.mutate(
            { id: vaga.id, payload },
            { onSuccess: () => setEditing(false) },
          )
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-bold tracking-tight">{vaga.name}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn('border-0', statusColor(vaga.status))}>{vaga.status}</Badge>
            {vaga.prioridade ? (
              <Badge className={cn('border-0', prioridadeColor(vaga.prioridade))}>
                {vaga.prioridade}
              </Badge>
            ) : null}
            {vaga.projeto ? <Badge variant="outline">{vaga.projeto}</Badge> : null}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
          <Pencil className="size-3.5" />
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Dias em aberto" value={vaga.diasEmAberto != null ? String(vaga.diasEmAberto) : '—'} big />
        <Stat
          label="Nível requisitado"
          value={vaga.nivelRequisitado.length ? vaga.nivelRequisitado.join(', ') : '—'}
        />
        <Stat label="Nível contratado" value={vaga.nivelContratado ?? '—'} />
        <Stat label="Pessoa alocada" value={vaga.pessoaAlocada ?? '—'} />
      </div>

      <div className="flex flex-col gap-3">
        <Separator />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-primary">Detalhes</h3>
        <div className="flex flex-col gap-3">
          <Row label="Recrutador">
            {vaga.recrutadores.length ? (
              <span className="flex flex-wrap items-center justify-end gap-1.5">
                {vaga.recrutadores.map((r) => (
                  <span
                    key={r}
                    className="flex items-center gap-1 rounded-full bg-primary/10 py-0.5 pl-0.5 pr-2 text-xs font-medium text-primary"
                  >
                    <span className="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-[9px] font-semibold text-white">
                      {initials(r)}
                    </span>
                    {r}
                  </span>
                ))}
              </span>
            ) : (
              '—'
            )}
          </Row>
          <Row label="Fonte de contratação">{vaga.fonte ?? '—'}</Row>
          <Row label="Abertura">{fmtDate(vaga.abertura)}</Row>
          <Row label="Fechamento">{fmtDate(vaga.fechamento)}</Row>
          <Row label="Data de entrada">{fmtDate(vaga.dataEntrada)}</Row>
          <Row label="Prazo de fechamento">{fmtDate(vaga.prazoFechamento)}</Row>
        </div>
      </div>

      <div>
        <Button
          variant="destructive"
          size="sm"
          disabled={remove.isPending}
          onClick={() => {
            if (!confirm(`Excluir a vaga "${vaga.name}"?`)) return
            remove.mutate(vaga.id, { onSuccess: () => router.push('/vagas') })
          }}
        >
          {remove.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
          Excluir vaga
        </Button>
      </div>
    </div>
  )
}

function Stat({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className={cn('font-semibold text-foreground', big ? 'text-2xl' : 'text-sm')}>
        {value}
      </span>
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{children}</span>
    </div>
  )
}

function VagaForm({
  vaga,
  saving,
  onSave,
  onCancel,
}: {
  vaga: Vaga
  saving: boolean
  onSave: (payload: VagaPayload) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(vaga.name)
  const [status, setStatus] = useState(vaga.status)
  const [prioridade, setPrioridade] = useState(vaga.prioridade ?? '')
  const [projeto, setProjeto] = useState(vaga.projeto ?? '')
  const [fonte, setFonte] = useState(vaga.fonte ?? '')
  const [nivelRequisitado, setNivelRequisitado] = useState(vaga.nivelRequisitado.join(', '))
  const [nivelContratado, setNivelContratado] = useState(vaga.nivelContratado ?? '')
  const [pessoaAlocada, setPessoaAlocada] = useState(vaga.pessoaAlocada ?? '')
  const [recrutadores, setRecrutadores] = useState<string[]>(vaga.recrutadores)
  const [abertura, setAbertura] = useState(toDateInput(vaga.abertura))
  const [fechamento, setFechamento] = useState(toDateInput(vaga.fechamento))
  const [dataEntrada, setDataEntrada] = useState(toDateInput(vaga.dataEntrada))
  const [prazoFechamento, setPrazoFechamento] = useState(toDateInput(vaga.prazoFechamento))

  function toggleRecruiter(name: string) {
    setRecrutadores((current) =>
      current.includes(name) ? current.filter((r) => r !== name) : [...current, name],
    )
  }

  function handleSubmit() {
    onSave({
      name: name.trim() || 'Sem título',
      status,
      prioridade: prioridade || null,
      projeto: projeto.trim() || null,
      fonte: fonte || null,
      nivelRequisitado: nivelRequisitado
        .split(',')
        .map((n) => n.trim())
        .filter(Boolean),
      nivelContratado: nivelContratado.trim() || null,
      pessoaAlocada: pessoaAlocada.trim() || null,
      recrutadores,
      abertura: abertura || null,
      fechamento: fechamento || null,
      dataEntrada: dataEntrada || null,
      prazoFechamento: prazoFechamento || null,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <Field label="Nome da vaga" htmlFor="v-name">
        <Input id="v-name" value={name} onChange={(e) => setName(e.target.value)} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status" htmlFor="v-status">
          <Select id="v-status" value={status} onChange={(e) => setStatus(e.target.value)}>
            {VAGA_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Prioridade" htmlFor="v-prio">
          <Select id="v-prio" value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
            <option value="">—</option>
            {VAGA_PRIORIDADES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Projeto" htmlFor="v-proj">
          <Input id="v-proj" value={projeto} onChange={(e) => setProjeto(e.target.value)} />
        </Field>
        <Field label="Fonte de contratação" htmlFor="v-fonte">
          <Select id="v-fonte" value={fonte} onChange={(e) => setFonte(e.target.value)}>
            <option value="">—</option>
            {VAGA_FONTES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Nível requisitado (separe por vírgula)" htmlFor="v-nivelreq">
          <Input
            id="v-nivelreq"
            value={nivelRequisitado}
            onChange={(e) => setNivelRequisitado(e.target.value)}
            placeholder="B2, B1"
          />
        </Field>
        <Field label="Nível contratado" htmlFor="v-nivelcon">
          <Input
            id="v-nivelcon"
            value={nivelContratado}
            onChange={(e) => setNivelContratado(e.target.value)}
          />
        </Field>
        <Field label="Pessoa alocada" htmlFor="v-pessoa">
          <Input
            id="v-pessoa"
            value={pessoaAlocada}
            onChange={(e) => setPessoaAlocada(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Recrutadores" htmlFor="v-recs">
        <div id="v-recs" className="flex flex-wrap gap-2">
          {RECRUITERS.map((r) => {
            const active = recrutadores.includes(r)
            return (
              <button
                key={r}
                type="button"
                onClick={() => toggleRecruiter(r)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  active
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:bg-muted',
                )}
              >
                {r}
              </button>
            )
          })}
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Abertura" htmlFor="v-abertura">
          <Input id="v-abertura" type="date" value={abertura} onChange={(e) => setAbertura(e.target.value)} />
        </Field>
        <Field label="Fechamento" htmlFor="v-fechamento">
          <Input id="v-fechamento" type="date" value={fechamento} onChange={(e) => setFechamento(e.target.value)} />
        </Field>
        <Field label="Data de entrada" htmlFor="v-entrada">
          <Input id="v-entrada" type="date" value={dataEntrada} onChange={(e) => setDataEntrada(e.target.value)} />
        </Field>
        <Field label="Prazo de fechamento" htmlFor="v-prazo">
          <Input id="v-prazo" type="date" value={prazoFechamento} onChange={(e) => setPrazoFechamento(e.target.value)} />
        </Field>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          Salvar
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
