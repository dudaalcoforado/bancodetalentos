import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

function parseJsonArray({ value }: { value: unknown }): unknown {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export class CreateTalentApplicationDto {
  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  fullName!: string;

  @ApiProperty({ example: 'Mari' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  preferredName!: string;

  @ApiProperty({ required: false, example: 'Ela/Dela' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  pronoun?: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  city!: string;

  @ApiProperty({ example: 'maria@email.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '(11) 99999-9999' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  phone!: string;

  @ApiProperty({ example: 'https://linkedin.com/in/maria' })
  @IsUrl()
  linkedin!: string;

  @ApiProperty({ required: false, example: 'Back-end .NET' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  vaga?: string;

  @ApiProperty({ required: false, example: 'Sênior' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  seniority?: string;

  @ApiProperty({ required: false, example: 'R$ 8.000' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  salaryExpectation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  stacks?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  skills?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  education?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  experience?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @Transform(parseJsonArray)
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  values?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  motivation?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  futureVision?: string;

  @ApiProperty({ required: false, example: 'Uso no dia a dia' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  aiLevel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  aiPurpose?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  aiAutomation?: string;

  @ApiProperty({ required: false, example: 'LinkedIn' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  howFound?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  referredBy?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @Transform(parseJsonArray)
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  affirmativeGroups?: string[];
}
