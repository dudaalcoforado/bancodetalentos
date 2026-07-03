import { api } from '@/lib/api'
import type { WeeklyReport } from './types'

/** Corpo aceito pelo PATCH — apenas título e a árvore de vagas/fases. */
type WeeklyReportUpdate = Pick<WeeklyReport, 'titulo' | 'vagas'>

export const docsApi = {
  list: (): Promise<WeeklyReport[]> =>
    api.get<WeeklyReport[]>('/weekly-reports', { auth: false }),

  create: (report: WeeklyReport): Promise<WeeklyReport> =>
    api.post<WeeklyReport>('/weekly-reports', report, { auth: false }),

  update: (id: string, report: WeeklyReportUpdate): Promise<WeeklyReport> =>
    api.patch<WeeklyReport>(
      `/weekly-reports/${id}`,
      { titulo: report.titulo, vagas: report.vagas },
      { auth: false },
    ),

  remove: (id: string): Promise<void> =>
    api.delete<void>(`/weekly-reports/${id}`, { auth: false }),
}
