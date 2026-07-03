export const TALENT_STAGES = [
  {
    value: 'SEM_FASE',
    label: 'Sem Fase',
    dot: 'bg-slate-400',
    accent: 'border-slate-300/60 bg-slate-50 text-slate-500',
  },
  {
    value: 'REPROVADO_TRIAGEM',
    label: 'Reprovado na Triagem',
    dot: 'bg-red-400',
    accent: 'border-red-300/50 bg-red-50 text-red-500',
  },
  {
    value: 'SELECAO',
    label: 'Seleção',
    dot: 'bg-violet-500',
    accent: 'border-violet-300/50 bg-violet-50 text-violet-600',
  },
  {
    value: 'ENTREVISTA_FIT',
    label: 'Entrevista Fit',
    dot: 'bg-violet-500',
    accent: 'border-violet-300/50 bg-violet-50 text-violet-600',
  },
  {
    value: 'DEVOLUTIVA_FIT',
    label: 'Devolutiva Fit',
    dot: 'bg-violet-400',
    accent: 'border-violet-200/60 bg-violet-50/80 text-violet-500',
  },
  {
    value: 'DESAFIO',
    label: 'Desafio',
    dot: 'bg-primary',
    accent: 'border-primary/30 bg-primary/10 text-primary',
  },
  {
    value: 'DEVOLUTIVA_DESAFIO',
    label: 'Devolutiva Desafio',
    dot: 'bg-violet-400',
    accent: 'border-violet-200/60 bg-violet-50/80 text-violet-500',
  },
  {
    value: 'ENTREVISTA_TECNICA',
    label: 'Entrevista Técnica',
    dot: 'bg-primary',
    accent: 'border-primary/30 bg-primary/10 text-primary',
  },
  {
    value: 'DEVOLUTIVA_ENTREVISTA_TECNICA',
    label: 'Devolutiva Ent. Técnica',
    dot: 'bg-violet-400',
    accent: 'border-violet-200/60 bg-violet-50/80 text-violet-500',
  },
  {
    value: 'DECISAO',
    label: 'Decisão',
    dot: 'bg-amber-500',
    accent: 'border-amber-300/50 bg-amber-50 text-amber-600',
  },
  {
    value: 'PROPOSTA',
    label: 'Proposta',
    dot: 'bg-blue-600',
    accent: 'border-blue-300/50 bg-blue-50 text-blue-600',
  },
  {
    value: 'CONTRATACAO',
    label: 'Contratação',
    dot: 'bg-emerald-500',
    accent: 'border-emerald-300/50 bg-emerald-50 text-emerald-600',
  },
] as const

export type TalentApplicationStage = (typeof TALENT_STAGES)[number]['value']

export type TalentStageMeta = (typeof TALENT_STAGES)[number]

const STAGE_BY_VALUE = new Map<TalentApplicationStage, TalentStageMeta>(
  TALENT_STAGES.map((stage) => [stage.value, stage]),
)

export function getStageMeta(stage: TalentApplicationStage): TalentStageMeta {
  return STAGE_BY_VALUE.get(stage) ?? TALENT_STAGES[0]
}
