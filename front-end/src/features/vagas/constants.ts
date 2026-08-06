export const VAGA_STATUS = ['Aberta', 'Fechada'] as const
export const VAGA_PRIORIDADES = ['Alta', 'Média', 'Baixa'] as const
export const VAGA_FONTES = ['LinkedIn', 'Indicação', 'Gupy', 'Site', 'Outro'] as const

export function statusColor(status: string): string {
  return status === 'Fechada'
    ? 'bg-emerald-100 text-emerald-700'
    : 'bg-amber-100 text-amber-700'
}

export function statusDot(status: string): string {
  return status === 'Fechada' ? 'bg-emerald-500' : 'border-2 border-violet-500'
}

export function prioridadeColor(prioridade: string | null): string {
  switch (prioridade) {
    case 'Alta':
      return 'bg-red-100 text-red-700'
    case 'Média':
      return 'bg-amber-100 text-amber-700'
    case 'Baixa':
      return 'bg-slate-100 text-slate-600'
    default:
      return 'bg-slate-100 text-slate-500'
  }
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}
