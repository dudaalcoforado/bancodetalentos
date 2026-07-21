import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { CreateTalentApplicationDto } from './dto/create-talent-application.dto';
import { TalentApplicationEntity } from './dto/talent-application.entity';
import { UpdateTalentApplicationRecruiterDto } from './dto/update-talent-application-recruiter.dto';
import { UpdateTalentApplicationStageDto } from './dto/update-talent-application-stage.dto';
import { TalentBankService } from './talent-bank.service';

@ApiTags('talent-bank')
@Controller('talent-bank/applications')
export class TalentBankController {
  constructor(private readonly talentBankService: TalentBankService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a Banco de Talentos application (public)' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: TalentApplicationEntity })
  @UseInterceptors(FileInterceptor('resume'))
  async create(
    @Body() dto: CreateTalentApplicationDto,
    @UploadedFile() resume?: Express.Multer.File,
  ): Promise<TalentApplicationEntity> {
    if (!resume) {
      throw new BadRequestException('Currículo em PDF é obrigatório');
    }
    const application = await this.talentBankService.create(dto, resume);
    return TalentApplicationEntity.fromPrisma(application);
  }

  @Get()
  @ApiOperation({ summary: 'List all submitted applications' })
  @ApiOkResponse({ type: TalentApplicationEntity, isArray: true })
  async findAll(): Promise<TalentApplicationEntity[]> {
    const applications = await this.talentBankService.findAll();
    return applications.map((application) =>
      TalentApplicationEntity.fromPrisma(application),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single application by id' })
  @ApiOkResponse({ type: TalentApplicationEntity })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<TalentApplicationEntity> {
    const application = await this.talentBankService.findOne(id);
    return TalentApplicationEntity.fromPrisma(application);
  }

  @Patch(':id/stage')
  @ApiOperation({
    summary: 'Move an application to a different pipeline stage',
  })
  @ApiOkResponse({ type: TalentApplicationEntity })
  async updateStage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTalentApplicationStageDto,
  ): Promise<TalentApplicationEntity> {
    const application = await this.talentBankService.updateStage(id, dto.stage);
    return TalentApplicationEntity.fromPrisma(application);
  }

  @Patch(':id/recruiter')
  @ApiOperation({
    summary:
      'Assign (or unassign) the recruiter responsible for an application',
  })
  @ApiOkResponse({ type: TalentApplicationEntity })
  async updateRecruiter(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTalentApplicationRecruiterDto,
  ): Promise<TalentApplicationEntity> {
    const application = await this.talentBankService.updateRecruiter(
      id,
      dto.recruiter,
    );
    return TalentApplicationEntity.fromPrisma(application);
  }

  @Get(':id/resume')
  @ApiOperation({ summary: 'Download the candidate resume PDF' })
  async downloadResume(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: Response,
  ): Promise<void> {
    const { filePath, fileName } =
      await this.talentBankService.getResumeFile(id);
    res.download(filePath, fileName);
  }
}
