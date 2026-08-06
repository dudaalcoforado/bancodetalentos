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

import { CreateVagaDto } from './dto/create-vaga.dto';
import { UpdateVagaDto } from './dto/update-vaga.dto';
import { VagaEntity } from './dto/vaga.entity';
import { VagasService } from './vagas.service';

@ApiTags('vagas')
@Controller('vagas')
export class VagasController {
  constructor(private readonly vagasService: VagasService) {}

  @Post()
  @ApiOperation({ summary: 'Create a vaga' })
  @ApiCreatedResponse({ type: VagaEntity })
  async create(@Body() dto: CreateVagaDto): Promise<VagaEntity> {
    const vaga = await this.vagasService.create(dto);
    return VagaEntity.fromPrisma(vaga);
  }

  @Get()
  @ApiOperation({ summary: 'List all vagas' })
  @ApiOkResponse({ type: VagaEntity, isArray: true })
  async findAll(): Promise<VagaEntity[]> {
    const vagas = await this.vagasService.findAll();
    return vagas.map((vaga) => VagaEntity.fromPrisma(vaga));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single vaga by id' })
  @ApiOkResponse({ type: VagaEntity })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<VagaEntity> {
    const vaga = await this.vagasService.findOne(id);
    return VagaEntity.fromPrisma(vaga);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vaga' })
  @ApiOkResponse({ type: VagaEntity })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateVagaDto,
  ): Promise<VagaEntity> {
    const vaga = await this.vagasService.update(id, dto);
    return VagaEntity.fromPrisma(vaga);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a vaga' })
  @ApiNoContentResponse()
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.vagasService.remove(id);
  }
}
