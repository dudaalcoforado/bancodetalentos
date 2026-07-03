import { ApiProperty } from '@nestjs/swagger';
import { TalentApplication, TalentApplicationStage } from '@prisma/client';

function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export class TalentApplicationEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty()
  preferredName!: string;

  @ApiProperty({ nullable: true, type: String })
  pronoun!: string | null;

  @ApiProperty()
  city!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  phone!: string;

  @ApiProperty()
  linkedin!: string;

  @ApiProperty()
  resumeFileName!: string;

  @ApiProperty()
  resumeUrl!: string;

  @ApiProperty({ nullable: true, type: String })
  vaga!: string | null;

  @ApiProperty({ nullable: true, type: String })
  seniority!: string | null;

  @ApiProperty({ nullable: true, type: String })
  salaryExpectation!: string | null;

  @ApiProperty({ nullable: true, type: String })
  stacks!: string | null;

  @ApiProperty({ nullable: true, type: String })
  skills!: string | null;

  @ApiProperty({ nullable: true, type: String })
  education!: string | null;

  @ApiProperty({ nullable: true, type: String })
  experience!: string | null;

  @ApiProperty({ type: [String] })
  values!: string[];

  @ApiProperty({ nullable: true, type: String })
  motivation!: string | null;

  @ApiProperty({ nullable: true, type: String })
  futureVision!: string | null;

  @ApiProperty({ nullable: true, type: String })
  aiLevel!: string | null;

  @ApiProperty({ nullable: true, type: String })
  aiPurpose!: string | null;

  @ApiProperty({ nullable: true, type: String })
  aiAutomation!: string | null;

  @ApiProperty({ nullable: true, type: String })
  howFound!: string | null;

  @ApiProperty({ nullable: true, type: String })
  referredBy!: string | null;

  @ApiProperty({ type: [String] })
  affirmativeGroups!: string[];

  @ApiProperty({ enum: TalentApplicationStage })
  stage!: TalentApplicationStage;

  @ApiProperty()
  createdAt!: Date;

  static fromPrisma(application: TalentApplication): TalentApplicationEntity {
    const {
      id,
      fullName,
      preferredName,
      pronoun,
      city,
      email,
      phone,
      linkedin,
      resumeFileName,
      vaga,
      seniority,
      salaryExpectation,
      stacks,
      skills,
      education,
      experience,
      values,
      motivation,
      futureVision,
      aiLevel,
      aiPurpose,
      aiAutomation,
      howFound,
      referredBy,
      affirmativeGroups,
      stage,
      createdAt,
    } = application;

    return Object.assign(new TalentApplicationEntity(), {
      id,
      fullName,
      preferredName,
      pronoun,
      city,
      email,
      phone,
      linkedin,
      resumeFileName,
      resumeUrl: `/talent-bank/applications/${id}/resume`,
      vaga,
      seniority,
      salaryExpectation,
      stacks,
      skills,
      education,
      experience,
      values: parseJsonArray(values),
      motivation,
      futureVision,
      aiLevel,
      aiPurpose,
      aiAutomation,
      howFound,
      referredBy,
      affirmativeGroups: parseJsonArray(affirmativeGroups),
      stage,
      createdAt,
    });
  }
}
