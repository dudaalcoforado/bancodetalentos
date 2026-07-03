'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Download, Loader2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/Button'
import { Separator } from '@/components/ui/separator'
import { useDownloadResume } from '@/features/talent-bank/hooks/useDownloadResume'
import { getStageMeta } from '@/features/talent-bank/stages'
import { cn } from '@/lib/utils'
import type { TalentApplication } from '@/types/talent-application'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' })

export function ApplicationDetail({
  application,
  permalinkHref,
}: {
  application: TalentApplication
  permalinkHref?: string
}) {
  const download = useDownloadResume()
  const stage = getStageMeta(application.stage)
  const affirmativeGroups = application.affirmativeGroups.filter(
    (group) => group !== 'Prefiro não informar',
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-xl font-semibold text-primary-foreground">
            {application.preferredName.charAt(0).toUpperCase()}
          </span>
          <div className="flex flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-bold tracking-tight">
                {application.preferredName}
              </h2>
              {application.pronoun ? (
                <Badge className="border-0 bg-primary/10 text-primary">{application.pronoun}</Badge>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">{application.fullName}</p>
            <p className="text-sm text-muted-foreground">{application.city}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {permalinkHref ? (
            <Link
              href={permalinkHref}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            >
              Página completa
              <ArrowUpRight className="size-3.5" />
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() =>
              download.mutate({ id: application.id, fileName: application.resumeFileName })
            }
            disabled={download.isPending}
            className={cn(buttonVariants({ size: 'sm' }))}
          >
            {download.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Baixar currículo
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge className={cn('border', stage.accent)}>
          <span className={cn('size-1.5 rounded-full', stage.dot)} />
          {stage.label}
        </Badge>
        {application.vaga ? (
          <Badge className="border-0 bg-emerald-500/10 text-emerald-600">{application.vaga}</Badge>
        ) : null}
        {application.seniority ? <Badge variant="outline">{application.seniority}</Badge> : null}
        {application.salaryExpectation ? (
          <Badge variant="outline">{application.salaryExpectation}</Badge>
        ) : null}
        {affirmativeGroups.map((group) => (
          <Badge key={group} className="border-0 bg-primary/10 text-primary">
            {group}
          </Badge>
        ))}
      </div>

      <Section title="Contato">
        <Row label="E-mail" value={application.email} />
        <Row label="Telefone" value={application.phone} />
        <Row label="LinkedIn" value={application.linkedin} />
      </Section>

      <Section title="Perfil profissional">
        <TextBlock label="Stacks, frameworks ou especializações" value={application.stacks} />
        <TextBlock label="Competências e habilidades" value={application.skills} />
      </Section>

      <Section title="Formação & experiência">
        <TextBlock label="Formação" value={application.education} />
        <TextBlock label="Experiência profissional" value={application.experience} />
      </Section>

      <Section title="O que move essa pessoa">
        {application.values.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {application.values.map((value) => (
              <Badge key={value} variant="outline">
                {value}
              </Badge>
            ))}
          </div>
        ) : null}
        <TextBlock label="Motivação para entrar na Loomi" value={application.motivation} />
        <TextBlock label="Visão de futuro" value={application.futureVision} />
      </Section>

      <Section title="Relação com IA">
        {application.aiLevel ? <Row label="Nível de uso" value={application.aiLevel} /> : null}
        <TextBlock label="Para que usa IA" value={application.aiPurpose} />
        <TextBlock label="Automações com IA" value={application.aiAutomation} />
      </Section>

      <Section title="Origem">
        {application.howFound ? (
          <Row label="Como conheceu a Loomi" value={application.howFound} />
        ) : null}
        {application.referredBy ? <Row label="Indicação" value={application.referredBy} /> : null}
        <Row
          label="Candidatura recebida em"
          value={dateFormatter.format(new Date(application.createdAt))}
        />
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <Separator />
      <h3 className="text-xs font-semibold tracking-wide text-primary uppercase">{title}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}

function TextBlock({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <p className="text-sm whitespace-pre-wrap text-muted-foreground">{value}</p>
    </div>
  )
}
