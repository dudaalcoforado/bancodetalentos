import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { AppConfig } from '@config/configuration';
import { TalentBankController } from './talent-bank.controller';
import { TalentBankService } from './talent-bank.service';

const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024;

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>) => {
        const uploadsDir = path.resolve(
          process.cwd(),
          config.get('uploadsDir', { infer: true }),
        );
        fs.mkdirSync(uploadsDir, { recursive: true });

        return {
          storage: diskStorage({
            destination: uploadsDir,
            filename: (_req, _file, cb) => cb(null, `${randomUUID()}.pdf`),
          }),
          fileFilter: (_req, file, cb) => {
            cb(null, file.mimetype === 'application/pdf');
          },
          limits: { fileSize: MAX_RESUME_SIZE_BYTES },
        };
      },
    }),
  ],
  controllers: [TalentBankController],
  providers: [TalentBankService],
})
export class TalentBankModule {}
