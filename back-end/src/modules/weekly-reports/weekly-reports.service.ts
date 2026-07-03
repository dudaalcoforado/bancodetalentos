import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@prisma-svc/prisma.service';
import {
  CreateWeeklyReportDto,
  ReportVagaDto,
  UpdateWeeklyReportDto,
} from './dto/weekly-report.dto';
import { ReportWithVagas } from './dto/weekly-report.entity';

const reportInclude = Prisma.validator<Prisma.WeeklyReportInclude>()({
  vagas: {
    orderBy: { ordem: 'asc' },
    include: { fases: { orderBy: { ordem: 'asc' } } },
  },
});

function buildVagasCreate(
  vagas: ReportVagaDto[],
): Prisma.ReportVagaCreateWithoutReportInput[] {
  return vagas.map((vaga, vagaIndex) => ({
    id: vaga.id,
    nome: vaga.nome,
    prioridade: vaga.prioridade,
    qtdVagas: vaga.qtdVagas,
    ordem: vagaIndex,
    fases: {
      create: vaga.fases.map((fase, faseIndex) => ({
        id: fase.id,
        fase: fase.fase,
        quantidade: fase.quantidade,
        observacoes: fase.observacoes,
        ordem: faseIndex,
      })),
    },
  }));
}

@Injectable()
export class WeeklyReportsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<ReportWithVagas[]> {
    return this.prisma.weeklyReport.findMany({
      orderBy: { criadoEm: 'desc' },
      include: reportInclude,
    });
  }

  async findOne(id: string): Promise<ReportWithVagas> {
    const report = await this.prisma.weeklyReport.findUnique({
      where: { id },
      include: reportInclude,
    });
    if (!report) throw new NotFoundException('Relatório não encontrado');
    return report;
  }

  create(dto: CreateWeeklyReportDto): Promise<ReportWithVagas> {
    return this.prisma.weeklyReport.create({
      data: {
        id: dto.id,
        titulo: dto.titulo,
        criadoEm: dto.criadoEm ? new Date(dto.criadoEm) : undefined,
        vagas: { create: buildVagasCreate(dto.vagas) },
      },
      include: reportInclude,
    });
  }

  async update(
    id: string,
    dto: UpdateWeeklyReportDto,
  ): Promise<ReportWithVagas> {
    await this.findOne(id);
    return this.prisma.$transaction(async (tx) => {
      await tx.reportVaga.deleteMany({ where: { reportId: id } });
      return tx.weeklyReport.update({
        where: { id },
        data: {
          titulo: dto.titulo,
          vagas: { create: buildVagasCreate(dto.vagas) },
        },
        include: reportInclude,
      });
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.weeklyReport.delete({ where: { id } });
  }
}
