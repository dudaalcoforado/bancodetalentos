import { ApiProperty } from '@nestjs/swagger';
import { Vaga } from '@prisma/client';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function diffInDays(from: Date | null, to: Date): number | null {
  if (!from) return null;
  return Math.max(0, Math.round((to.getTime() - from.getTime()) / MS_PER_DAY));
}

export class VagaEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ example: 'Aberta' })
  status!: string;

  @ApiProperty({ type: [String] })
  nivelRequisitado!: string[];

  @ApiProperty({ nullable: true, type: String })
  nivelContratado!: string | null;

  @ApiProperty({ nullable: true, type: String })
  projeto!: string | null;

  @ApiProperty({ nullable: true, type: String })
  pessoaAlocada!: string | null;

  @ApiProperty({ type: [String] })
  recrutadores!: string[];

  @ApiProperty({ nullable: true, type: String })
  prioridade!: string | null;

  @ApiProperty({ nullable: true, type: String })
  fonte!: string | null;

  @ApiProperty({ nullable: true, type: String })
  abertura!: Date | null;

  @ApiProperty({ nullable: true, type: String })
  fechamento!: Date | null;

  @ApiProperty({ nullable: true, type: String })
  dataEntrada!: Date | null;

  @ApiProperty({ nullable: true, type: String })
  prazoFechamento!: Date | null;

  @ApiProperty({
    nullable: true,
    type: Number,
    description:
      'Days between abertura and fechamento (or today if still open)',
  })
  diasEmAberto!: number | null;

  @ApiProperty()
  createdAt!: Date;

  static fromPrisma(vaga: Vaga): VagaEntity {
    const reference = vaga.fechamento ?? new Date();

    return Object.assign(new VagaEntity(), {
      id: vaga.id,
      name: vaga.name,
      status: vaga.status,
      nivelRequisitado: parseJsonArray(vaga.nivelRequisitado),
      nivelContratado: vaga.nivelContratado,
      projeto: vaga.projeto,
      pessoaAlocada: vaga.pessoaAlocada,
      recrutadores: parseJsonArray(vaga.recrutadores),
      prioridade: vaga.prioridade,
      fonte: vaga.fonte,
      abertura: vaga.abertura,
      fechamento: vaga.fechamento,
      dataEntrada: vaga.dataEntrada,
      prazoFechamento: vaga.prazoFechamento,
      diasEmAberto: diffInDays(vaga.abertura, reference),
      createdAt: vaga.createdAt,
    });
  }
}
