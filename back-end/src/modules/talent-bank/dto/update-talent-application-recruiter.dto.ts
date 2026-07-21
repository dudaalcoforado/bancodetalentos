import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, ValidateIf } from 'class-validator';

/** Recruiters allowed to be assigned to an application. */
export const RECRUITERS = [
  'Ton Lima',
  'Eduarda Alcoforado',
  'Laura Nóbrega',
  'Yngrid Figueiredo',
] as const;

export type Recruiter = (typeof RECRUITERS)[number];

export class UpdateTalentApplicationRecruiterDto {
  @ApiProperty({
    enum: RECRUITERS,
    nullable: true,
    description: 'Recruiter name, or null to unassign.',
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsIn(RECRUITERS)
  recruiter!: Recruiter | null;
}
