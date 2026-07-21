import { api } from '@/lib/api'
import type { Vaga, VagaPayload } from '@/types/vaga'

export const vagasApi = {
  list: (): Promise<Vaga[]> => api.get<Vaga[]>('/vagas'),

  getOne: (id: string): Promise<Vaga> => api.get<Vaga>(`/vagas/${id}`),

  create: (payload: VagaPayload): Promise<Vaga> => api.post<Vaga>('/vagas', payload),

  update: (id: string, payload: VagaPayload): Promise<Vaga> =>
    api.patch<Vaga>(`/vagas/${id}`, payload),

  remove: (id: string): Promise<void> => api.delete<void>(`/vagas/${id}`),
}
