import type { ReportPhase, ReportVaga, WeeklyReport } from './types'

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id-${Math.random().toString(36).slice(2)}-${Date.now()}`
}

/** Fases padrão do funil, usadas ao criar uma nova vaga em branco. */
export const DEFAULT_PHASES = [
  'Seleção',
  'Entrevista Fit',
  'Desafios Enviados',
  'Desafios Recebidos',
  'Entrevista Técnica',
  'Decisão',
  'Proposta',
  'Alinhamentos',
] as const

function phase(fase: string, quantidade = '', observacoes = ''): ReportPhase {
  return { id: newId(), fase, quantidade, observacoes }
}

export function createEmptyVaga(): ReportVaga {
  return {
    id: newId(),
    nome: 'Nova vaga',
    prioridade: 'P1',
    qtdVagas: 1,
    fases: DEFAULT_PHASES.map((f) => phase(f)),
  }
}

export function createEmptyReport(titulo: string): WeeklyReport {
  return {
    id: newId(),
    titulo,
    criadoEm: new Date().toISOString(),
    vagas: [createEmptyVaga()],
  }
}

/** Relatório-semente extraído do modelo de 26/06/2026. */
export function buildSeedReports(): WeeklyReport[] {
  return [
    {
      id: newId(),
      titulo: '26/06/2026',
      criadoEm: '2026-06-26T09:51:00.000Z',
      vagas: [
        {
          id: newId(),
          nome: 'Tech Lead',
          prioridade: 'P0',
          qtdVagas: 1,
          fases: [
            phase(
              'Seleção',
              '14',
              'Mapeamento e seleção de perfis via LinkedIn das empresas RD Station, Grupo Supero, Clínica Experts e Beyound Co.',
            ),
            phase(
              'Entrevista Fit',
              '3',
              'Yuri Vinicius Ferreira Oliveira: perfil alinhado ao contexto da Loomi no que diz respeito a autonomia, aprendizado contínuo, comunicação, uso estratégico de IA e capacidade de execução. O principal ponto de investigação para as próximas etapas não é técnico, mas sim de maturidade de liderança. Sua experiência formal como Tech Lead ainda é recente e relativamente curta (cerca de um mês substituindo um Tech Lead titular).\n\nLeticia Gabriela Cena de Lima: A candidata demonstrou uma comunicação mais cadenciada e um nível de energia abaixo do perfil dinâmico exigido para o escopo da função.\n\nVinícius Schneider: O candidato não demonstrou muito engajamento. Além disso, a comunicação foi um pouco cansativa, o que desalinha o perfil das expectativas.',
            ),
            phase('Desafios Enviados', '1', 'Previsão de entrega: 28/06/2026'),
            phase('Desafios Recebidos', '1', 'Phelipe Evangelista Simim Diniz: aguardando avaliação'),
            phase(
              'Entrevista Técnica',
              '1',
              'Entrevista técnica com o candidato André Borgonovo, indicado por Samuca.',
            ),
            phase('Decisão', '-', '-'),
            phase('Proposta', '-', '-'),
            phase('Alinhamentos', '-', '-'),
          ],
        },
        {
          id: newId(),
          nome: 'Comercial',
          prioridade: 'P1',
          qtdVagas: 1,
          fases: [
            phase('Seleção Ativa', '10', ''),
            phase(
              'Entrevista Fit',
              '2',
              'Tivemos duas entrevistas FIT essa semana com candidatos aprovados para a próxima fase.',
            ),
            phase('Desafios Enviados', '3', 'Receberemos esses desafios no sábado 27/06.'),
            phase('Desafios Recebidos', '', ''),
            phase('Entrevista Técnica', '', ''),
            phase('Decisão', '', ''),
            phase('Proposta', '', ''),
            phase('Alinhamento', '', ''),
          ],
        },
      ],
    },
  ]
}
