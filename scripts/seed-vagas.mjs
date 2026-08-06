// One-off seed for the Vagas module. Run: node scripts/seed-vagas.mjs
// Uses global fetch (Node 18+) so UTF-8 payloads (Média, Indicação) stay intact.
const API = process.env.API_URL ?? 'http://localhost:3001/api'

const VAGAS = [
  { name: 'Comercial', status: 'Aberta', nivelRequisitado: ['B2', 'B1'], projeto: 'Geral', prioridade: 'Alta', fonte: 'LinkedIn', recrutadores: ['Ton Lima', 'Eduarda Alcoforado'], abertura: '2026-06-01' },
  { name: 'Tech Lead', status: 'Aberta', nivelRequisitado: ['S1', 'S5'], projeto: 'Geral', prioridade: 'Alta', fonte: 'Indicação', recrutadores: ['Eduarda Alcoforado', 'Yngrid Figueiredo'], abertura: '2026-06-10' },
  { name: 'Designer de Produto', status: 'Fechada', nivelRequisitado: ['B1'], projeto: 'Fintech', prioridade: 'Média', fonte: 'Indicação', recrutadores: ['Laura Nóbrega'], abertura: '2026-05-05', fechamento: '2026-06-02' },
  { name: 'Data Analyst', status: 'Fechada', nivelRequisitado: ['B2'], projeto: 'Dados', prioridade: 'Alta', fonte: 'LinkedIn', recrutadores: ['Ton Lima'], abertura: '2026-06-15', fechamento: '2026-07-10' },
  { name: 'Product Owner', status: 'Aberta', nivelRequisitado: ['S1'], projeto: 'Health', prioridade: 'Baixa', fonte: 'Gupy', recrutadores: ['Yngrid Figueiredo'], abertura: '2026-07-01' },
  { name: 'QA Engineer', status: 'Fechada', nivelRequisitado: ['B1'], projeto: 'Fintech', prioridade: 'Média', fonte: 'Indicação', recrutadores: ['Laura Nóbrega', 'Ton Lima'], abertura: '2026-05-20', fechamento: '2026-06-25' },
]

async function main() {
  const existing = await fetch(`${API}/vagas`).then((r) => r.json())
  for (const v of existing.data ?? []) {
    await fetch(`${API}/vagas/${v.id}`, { method: 'DELETE' })
  }
  for (const vaga of VAGAS) {
    const res = await fetch(`${API}/vagas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(vaga),
    })
    console.log(vaga.name, res.status)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
