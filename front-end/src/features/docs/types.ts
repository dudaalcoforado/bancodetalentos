export type ReportPriority = 'P0' | 'P1' | 'P2' | 'P3'

export const REPORT_PRIORITIES: ReportPriority[] = ['P0', 'P1', 'P2', 'P3']

export interface ReportPhase {
  id: string
  fase: string
  quantidade: string
  observacoes: string
}

export interface ReportVaga {
  id: string
  nome: string
  prioridade: ReportPriority
  qtdVagas: number
  fases: ReportPhase[]
}

export interface WeeklyReport {
  id: string
  titulo: string
  criadoEm: string
  vagas: ReportVaga[]
}
