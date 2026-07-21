import * as fs from 'fs';
import * as path from 'path';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TalentApplication, TalentApplicationStage } from '@prisma/client';

import { AppConfig } from '@config/configuration';
import { PrismaService } from '@prisma-svc/prisma.service';
import { CreateTalentApplicationDto } from './dto/create-talent-application.dto';

export interface ResumeFile {
  filePath: string;
  fileName: string;
}

@Injectable()
export class TalentBankService {
  private readonly uploadsDir: string;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService<AppConfig, true>,
  ) {
    this.uploadsDir = path.resolve(
      process.cwd(),
      config.get('uploadsDir', { infer: true }),
    );
  }

  create(
    dto: CreateTalentApplicationDto,
    file: Express.Multer.File,
  ): Promise<TalentApplication> {
    return this.prisma.talentApplication.create({
      data: {
        fullName: dto.fullName,
        preferredName: dto.preferredName,
        pronoun: dto.pronoun,
        city: dto.city,
        email: dto.email,
        phone: dto.phone,
        linkedin: dto.linkedin,
        resumeFileName: file.originalname,
        resumeStoragePath: file.filename,
        vaga: dto.vaga,
        seniority: dto.seniority,
        salaryExpectation: dto.salaryExpectation,
        stacks: dto.stacks,
        skills: dto.skills,
        education: dto.education,
        experience: dto.experience,
        values: JSON.stringify(dto.values ?? []),
        motivation: dto.motivation,
        futureVision: dto.futureVision,
        aiLevel: dto.aiLevel,
        aiPurpose: dto.aiPurpose,
        aiAutomation: dto.aiAutomation,
        howFound: dto.howFound,
        referredBy: dto.referredBy,
        affirmativeGroups: JSON.stringify(dto.affirmativeGroups ?? []),
      },
    });
  }

  findAll(): Promise<TalentApplication[]> {
    return this.prisma.talentApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<TalentApplication> {
    const application = await this.prisma.talentApplication.findUnique({
      where: { id },
    });
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }

  async updateStage(
    id: string,
    stage: TalentApplicationStage,
  ): Promise<TalentApplication> {
    await this.findOne(id);
    return this.prisma.talentApplication.update({
      where: { id },
      data: { stage },
    });
  }

  async updateRecruiter(
    id: string,
    recruiter: string | null,
  ): Promise<TalentApplication> {
    await this.findOne(id);
    return this.prisma.talentApplication.update({
      where: { id },
      data: { recruiter },
    });
  }

  async getResumeFile(id: string): Promise<ResumeFile> {
    const application = await this.findOne(id);
    const filePath = path.resolve(
      this.uploadsDir,
      application.resumeStoragePath,
    );

    if (
      filePath !== this.uploadsDir &&
      !filePath.startsWith(this.uploadsDir + path.sep)
    ) {
      throw new BadRequestException('Invalid resume path');
    }
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Resume file not found');
    }

    return { filePath, fileName: application.resumeFileName };
  }
}
