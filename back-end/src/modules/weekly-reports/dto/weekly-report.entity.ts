import { ApiProperty } from '@nestjs/swagger';
import {
  ReportPhase,
  ReportVaga,
  WeeklyReport,
  WeeklyReportPriority,
} from '@prisma/client';

export type VagaWithFases = ReportVaga & { fases: ReportPhase[] };
export type ReportWithVagas = WeeklyReport & { vagas: VagaWithFases[] };

export class ReportPhaseEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fase!: string;

  @ApiProperty()
  quantidade!: string;

  @ApiProperty()
  observacoes!: string;
}

export class ReportVagaEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nome!: string;

  @ApiProperty({ enum: WeeklyReportPriority })
  prioridade!: WeeklyReportPriority;

  @ApiProperty()
  qtdVagas!: number;

  @ApiProperty({ type: [ReportPhaseEntity] })
  fases!: ReportPhaseEntity[];
}

export class WeeklyReportEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  titulo!: string;

  @ApiProperty()
  criadoEm!: string;

  @ApiProperty({ type: [ReportVagaEntity] })
  vagas!: ReportVagaEntity[];

  static fromPrisma(report: ReportWithVagas): WeeklyReportEntity {
    return Object.assign(new WeeklyReportEntity(), {
      id: report.id,
      titulo: report.titulo,
      criadoEm: report.criadoEm.toISOString(),
      vagas: report.vagas.map((vaga) => ({
        id: vaga.id,
        nome: vaga.nome,
        prioridade: vaga.prioridade,
        qtdVagas: vaga.qtdVagas,
        fases: vaga.fases.map((fase) => ({
          id: fase.id,
          fase: fase.fase,
          quantidade: fase.quantidade,
          observacoes: fase.observacoes,
        })),
      })),
    });
  }
}
