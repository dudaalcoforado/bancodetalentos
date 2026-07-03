import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  CreateWeeklyReportDto,
  UpdateWeeklyReportDto,
} from './dto/weekly-report.dto';
import { WeeklyReportEntity } from './dto/weekly-report.entity';
import { WeeklyReportsService } from './weekly-reports.service';

@ApiTags('weekly-reports')
@Controller('weekly-reports')
export class WeeklyReportsController {
  constructor(private readonly weeklyReportsService: WeeklyReportsService) {}

  @Get()
  @ApiOperation({ summary: 'List all weekly reports' })
  @ApiOkResponse({ type: WeeklyReportEntity, isArray: true })
  async findAll(): Promise<WeeklyReportEntity[]> {
    const reports = await this.weeklyReportsService.findAll();
    return reports.map((report) => WeeklyReportEntity.fromPrisma(report));
  }

  @Post()
  @ApiOperation({ summary: 'Create a weekly report' })
  @ApiCreatedResponse({ type: WeeklyReportEntity })
  async create(
    @Body() dto: CreateWeeklyReportDto,
  ): Promise<WeeklyReportEntity> {
    const report = await this.weeklyReportsService.create(dto);
    return WeeklyReportEntity.fromPrisma(report);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Replace a weekly report (title + vagas + fases)' })
  @ApiOkResponse({ type: WeeklyReportEntity })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateWeeklyReportDto,
  ): Promise<WeeklyReportEntity> {
    const report = await this.weeklyReportsService.update(id, dto);
    return WeeklyReportEntity.fromPrisma(report);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a weekly report' })
  @ApiNoContentResponse()
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.weeklyReportsService.remove(id);
  }
}
