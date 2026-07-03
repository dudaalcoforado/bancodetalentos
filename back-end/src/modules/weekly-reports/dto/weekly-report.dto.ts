import { ApiProperty } from '@nestjs/swagger';
import { WeeklyReportPriority } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class ReportPhaseDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;

  @ApiProperty({ example: 'Entrevista Fit' })
  @IsString()
  @MaxLength(120)
  fase!: string;

  @ApiProperty({ example: '3' })
  @IsString()
  @MaxLength(20)
  quantidade!: string;

  @ApiProperty({ example: 'Aguardando avaliação do desafio.' })
  @IsString()
  @MaxLength(8000)
  observacoes!: string;
}

export class ReportVagaDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;

  @ApiProperty({ example: 'Tech Lead' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  nome!: string;

  @ApiProperty({ enum: WeeklyReportPriority, example: WeeklyReportPriority.P0 })
  @IsEnum(WeeklyReportPriority)
  prioridade!: WeeklyReportPriority;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  @Max(999)
  qtdVagas!: number;

  @ApiProperty({ type: [ReportPhaseDto] })
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ReportPhaseDto)
  fases!: ReportPhaseDto[];
}

export class CreateWeeklyReportDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;

  @ApiProperty({ example: '26/06/2026' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  titulo!: string;

  @ApiProperty({ required: false, example: '2026-06-26T09:51:00.000Z' })
  @IsOptional()
  @IsISO8601()
  criadoEm?: string;

  @ApiProperty({ type: [ReportVagaDto] })
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ReportVagaDto)
  vagas!: ReportVagaDto[];
}

export class UpdateWeeklyReportDto {
  @ApiProperty({ example: '26/06/2026' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  titulo!: string;

  @ApiProperty({ type: [ReportVagaDto] })
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ReportVagaDto)
  vagas!: ReportVagaDto[];
}
