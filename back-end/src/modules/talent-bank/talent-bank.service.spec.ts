import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TalentApplication } from '@prisma/client';

import { PrismaService } from '@prisma-svc/prisma.service';
import { CreateTalentApplicationDto } from './dto/create-talent-application.dto';
import { TalentBankService } from './talent-bank.service';

jest.mock('fs', () => {
  const actualFs: Record<string, unknown> = jest.requireActual('fs');
  return { ...actualFs, existsSync: jest.fn().mockReturnValue(true) };
});
import * as fs from 'fs';

describe('TalentBankService', () => {
  let service: TalentBankService;
  let prisma: {
    talentApplication: {
      create: jest.Mock<
        Promise<TalentApplication>,
        [{ data: Record<string, unknown> }]
      >;
      findMany: jest.Mock<Promise<TalentApplication[]>, []>;
      findUnique: jest.Mock<
        Promise<TalentApplication | null>,
        [{ where: { id: string } }]
      >;
    };
  };

  const application = {
    id: 'app-1',
    fullName: 'Maria Silva',
    preferredName: 'Mari',
    pronoun: null,
    city: 'São Paulo',
    email: 'maria@email.com',
    phone: '11999999999',
    linkedin: 'https://linkedin.com/in/maria',
    resumeFileName: 'curriculo.pdf',
    resumeStoragePath: 'resume-1.pdf',
    seniority: null,
    salaryExpectation: null,
    stacks: null,
    skills: null,
    education: null,
    experience: null,
    values: '[]',
    motivation: null,
    futureVision: null,
    aiLevel: null,
    aiPurpose: null,
    aiAutomation: null,
    howFound: null,
    referredBy: null,
    affirmativeGroups: '[]',
    createdAt: new Date(),
  } satisfies TalentApplication;

  beforeEach(async () => {
    prisma = {
      talentApplication: {
        create: jest
          .fn<Promise<TalentApplication>, [{ data: Record<string, unknown> }]>()
          .mockResolvedValue(application),
        findMany: jest
          .fn<Promise<TalentApplication[]>, []>()
          .mockResolvedValue([application]),
        findUnique: jest
          .fn<Promise<TalentApplication | null>, [{ where: { id: string } }]>()
          .mockResolvedValue(application),
      },
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        TalentBankService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: ConfigService,
          useValue: { get: () => './uploads/resumes' },
        },
      ],
    }).compile();

    service = moduleRef.get(TalentBankService);
  });

  it('creates an application from the dto and uploaded file', async () => {
    const dto: CreateTalentApplicationDto = {
      fullName: 'Maria Silva',
      preferredName: 'Mari',
      city: 'São Paulo',
      email: 'maria@email.com',
      phone: '11999999999',
      linkedin: 'https://linkedin.com/in/maria',
      values: ['Autonomia'],
    };
    const file = {
      originalname: 'curriculo.pdf',
      filename: 'resume-1.pdf',
    } as Express.Multer.File;

    const result = await service.create(dto, file);

    expect(result).toBe(application);
    expect(prisma.talentApplication.create).toHaveBeenCalledTimes(1);
    const { data } = prisma.talentApplication.create.mock.calls[0][0];
    expect(data.fullName).toBe('Maria Silva');
    expect(data.resumeFileName).toBe('curriculo.pdf');
    expect(data.resumeStoragePath).toBe('resume-1.pdf');
    expect(data.values).toBe(JSON.stringify(['Autonomia']));
    expect(data.affirmativeGroups).toBe(JSON.stringify([]));
  });

  it('lists applications ordered by newest first', async () => {
    const result = await service.findAll();
    expect(result).toEqual([application]);
    expect(prisma.talentApplication.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });

  it('throws NotFoundException when the application does not exist', async () => {
    prisma.talentApplication.findUnique.mockResolvedValueOnce(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('throws NotFoundException when the resume file is missing on disk', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    await expect(service.getResumeFile('app-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
