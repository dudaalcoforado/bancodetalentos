import { Badge } from '@/components/ui/badge'
import { WeeklyReportsManager } from '@/features/docs/components/WeeklyReportsManager'

export default function DocsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Badge className="w-fit border-0 bg-primary/10 text-primary hover:bg-primary/15">
          Documentação
        </Badge>
        <h1 className="font-display text-3xl font-bold tracking-tight">Relatórios semanais</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhamento do processo seletivo por vaga. Edite o nome das vagas, ajuste as fases,
          duplique um relatório da semana anterior ou crie um novo.
        </p>
      </header>

      <WeeklyReportsManager />
    </div>
  )
}
