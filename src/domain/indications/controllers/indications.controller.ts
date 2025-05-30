import { Controller, Get, Query, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { IndicationsService } from '../services/indications.service';
import { CreateIndicationDTO, QueryIndicationsDTO, UpdateIndicationDTO } from '../dto/indications.dto';
import { AuthGuard } from '../../../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('indications')
export class IndicationsController {
  constructor(
    private readonly indicationsService: IndicationsService
  ) {}

  @Post()
  async create(
    @Body() data: CreateIndicationDTO
  ) {
    return await this.indicationsService.create(data);
  }

  @Get()
  async getAll(
    @Query() query: QueryIndicationsDTO
  ) {
    return await this.indicationsService.findAll(query);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateIndicationDTO
  ) {
    return await this.indicationsService.update(id, data);
  }

  @Delete(':id')
  async destroy(
    @Param('id') id: string
  ) {
    return await this.indicationsService.delete(id);
  }
}
