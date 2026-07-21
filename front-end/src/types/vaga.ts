export interface Vaga {
  id: string
  name: string
  status: string
  nivelRequisitado: string[]
  nivelContratado: string | null
  projeto: string | null
  pessoaAlocada: string | null
  recrutadores: string[]
  prioridade: string | null
  fonte: string | null
  abertura: string | null
  fechamento: string | null
  dataEntrada: string | null
  prazoFechamento: string | null
  diasEmAberto: number | null
  createdAt: string
}

export interface VagaPayload {
  name?: string
  status?: string
  nivelRequisitado?: string[]
  nivelContratado?: string | null
  projeto?: string | null
  pessoaAlocada?: string | null
  recrutadores?: string[]
  prioridade?: string | null
  fonte?: string | null
  abertura?: string | null
  fechamento?: string | null
  dataEntrada?: string | null
  prazoFechamento?: string | null
}
