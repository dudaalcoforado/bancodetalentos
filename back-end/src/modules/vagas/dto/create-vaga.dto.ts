import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateVagaDto {
  @ApiProperty({ example: 'Comercial' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'Aberta', description: 'Aberta | Fechada' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ type: [String], example: ['B2', 'B1'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nivelRequisitado?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nivelContratado?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  projeto?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pessoaAlocada?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recrutadores?: string[];

  @ApiPropertyOptional({ example: 'Alta' })
  @IsOptional()
  @IsString()
  prioridade?: string;

  @ApiPropertyOptional({ example: 'LinkedIn' })
  @IsOptional()
  @IsString()
  fonte?: string;

  @ApiPropertyOptional({ example: '2026-06-01' })
  @IsOptional()
  @IsDateString()
  abertura?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fechamento?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dataEntrada?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  prazoFechamento?: string;
}
