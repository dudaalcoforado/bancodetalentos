import { Injectable, NotFoundException } from '@nestjs/common';
import { Vaga } from '@prisma/client';

import { PrismaService } from '@prisma-svc/prisma.service';
import { CreateVagaDto } from './dto/create-vaga.dto';
import { UpdateVagaDto } from './dto/update-vaga.dto';

interface VagaWritable {
  name?: string;
  status?: string;
  nivelRequisitado?: string | null;
  nivelContratado?: string | null;
  projeto?: string | null;
  pessoaAlocada?: string | null;
  recrutadores?: string | null;
  prioridade?: string | null;
  fonte?: string | null;
  abertura?: Date | null;
  fechamento?: Date | null;
  dataEntrada?: Date | null;
  prazoFechamento?: Date | null;
}

@Injectable()
export class VagasService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateVagaDto): Promise<Vaga> {
    return this.prisma.vaga.create({
      data: {
        name: dto.name,
        ...this.serialize(dto),
      },
    });
  }

  findAll(): Promise<Vaga[]> {
    return this.prisma.vaga.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string): Promise<Vaga> {
    const vaga = await this.prisma.vaga.findUnique({ where: { id } });
    if (!vaga) throw new NotFoundException('Vaga not found');
    return vaga;
  }

  async update(id: string, dto: UpdateVagaDto): Promise<Vaga> {
    await this.findOne(id);
    const data = this.serialize(dto);
    const finalData =
      dto.name !== undefined ? { ...data, name: dto.name } : data;
    return this.prisma.vaga.update({ where: { id }, data: finalData });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.vaga.delete({ where: { id } });
  }

  /** Maps DTO fields (arrays → JSON, ISO strings → Date) onto Prisma input. */
  private serialize(dto: UpdateVagaDto): VagaWritable {
    const data: VagaWritable = {};
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.nivelRequisitado !== undefined)
      data.nivelRequisitado = JSON.stringify(dto.nivelRequisitado);
    if (dto.nivelContratado !== undefined)
      data.nivelContratado = dto.nivelContratado;
    if (dto.projeto !== undefined) data.projeto = dto.projeto;
    if (dto.pessoaAlocada !== undefined) data.pessoaAlocada = dto.pessoaAlocada;
    if (dto.recrutadores !== undefined)
      data.recrutadores = JSON.stringify(dto.recrutadores);
    if (dto.prioridade !== undefined) data.prioridade = dto.prioridade;
    if (dto.fonte !== undefined) data.fonte = dto.fonte;
    if (dto.abertura !== undefined)
      data.abertura = dto.abertura ? new Date(dto.abertura) : null;
    if (dto.fechamento !== undefined)
      data.fechamento = dto.fechamento ? new Date(dto.fechamento) : null;
    if (dto.dataEntrada !== undefined)
      data.dataEntrada = dto.dataEntrada ? new Date(dto.dataEntrada) : null;
    if (dto.prazoFechamento !== undefined)
      data.prazoFechamento = dto.prazoFechamento
        ? new Date(dto.prazoFechamento)
        : null;
    return data;
  }
}
