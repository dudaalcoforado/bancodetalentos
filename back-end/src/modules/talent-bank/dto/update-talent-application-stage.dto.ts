import { ApiProperty } from '@nestjs/swagger';
import { TalentApplicationStage } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateTalentApplicationStageDto {
  @ApiProperty({
    enum: TalentApplicationStage,
    example: TalentApplicationStage.SELECAO,
  })
  @IsEnum(TalentApplicationStage)
  stage!: TalentApplicationStage;
}
