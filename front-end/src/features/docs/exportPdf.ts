import type { WeeklyReport } from './types'

const PRIORITY_HEX: Record<string, string> = {
  P0: '#dc2626',
  P1: '#d97706',
  P2: '#2563eb',
  P3: '#64748b',
}

function esc(value: string): string {
  return value.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      default:
        return '&#39;'
    }
  })
}

/**
 * Opens a print-ready window with a styled version of the report and triggers
 * the browser print dialog (user chooses "Save as PDF"). Dependency-free.
 */
export function exportWeeklyReportPdf(report: WeeklyReport): void {
  const win = window.open('', '_blank', 'width=900,height=1000')
  if (!win) return

  const created = new Date(report.criadoEm).toLocaleString('pt-BR')
  const title = report.titulo || 'Relatório semanal'

  const vagasHtml = report.vagas
    .map((vaga) => {
      const rows = vaga.fases
        .map(
          (f) => `<tr>
            <td>${esc(f.fase)}</td>
            <td class="center">${esc(f.quantidade)}</td>
            <td>${esc(f.observacoes)}</td>
          </tr>`,
        )
        .join('')
      const prioColor = PRIORITY_HEX[vaga.prioridade] ?? '#64748b'
      return `<section class="vaga">
        <div class="vaga-head">
          <span class="prio" style="background:${prioColor}1a;color:${prioColor}">${esc(vaga.prioridade)}</span>
          <span class="vaga-name">${esc(vaga.nome || 'Sem título')}</span>
          <span class="qtd">${vaga.qtdVagas} ${vaga.qtdVagas === 1 ? 'vaga' : 'vagas'}</span>
        </div>
        <table>
          <thead><tr><th>Fase</th><th class="center">Qt</th><th>Observações</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="3" class="muted">Sem fases</td></tr>'}</tbody>
        </table>
      </section>`
    })
    .join('')

  win.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8" />
  <title>${esc(title)}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #1e1b2e; margin: 0; padding: 40px; }
    .brand { font-weight: 700; letter-spacing: -0.02em; color: #5b2dc4; margin: 0 0 4px; font-size: 13px; }
    .brand span { color: #a855f7; }
    h1 { font-size: 24px; margin: 0 0 4px; }
    .muted { color: #6b7280; font-size: 12px; }
    .doc-head { border-bottom: 2px solid #ede9fe; padding-bottom: 16px; margin-bottom: 24px; }
    .vaga { margin-bottom: 22px; break-inside: avoid; }
    .vaga-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .prio { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
    .vaga-name { font-weight: 700; font-size: 15px; }
    .qtd { margin-left: auto; font-size: 12px; color: #6b7280; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #e5e7eb; padding: 6px 10px; text-align: left; vertical-align: top; }
    th { background: #f5f3ff; color: #5b2dc4; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }
    .center { text-align: center; }
    td.muted { text-align: center; color: #9ca3af; }
    @page { margin: 16mm; }
    @media print { body { padding: 0; } }
  </style></head>
  <body>
    <div class="doc-head">
      <p class="brand">loomi<span>.</span> · Banco de Talentos</p>
      <h1>Relatório semanal — ${esc(title)}</h1>
      <p class="muted">Criado em ${esc(created)}</p>
    </div>
    ${vagasHtml}
    <script>window.onload = function () { window.focus(); window.print(); };</script>
  </body></html>`)
  win.document.close()
}
