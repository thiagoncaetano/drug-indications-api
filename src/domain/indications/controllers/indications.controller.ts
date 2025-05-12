import { Controller, Get, Post, Query } from '@nestjs/common';
import { IndicationsService } from '../services/indications.service';

@Controller('indications')
export class IndicationsController {
   constructor(
    private readonly indicationsService: IndicationsService
  ) {}

  @Get()
  async getIndications(
    @Query('drug') drug: string
  ) {
    const result = await this.indicationsService.extractAndMapIndications(drug);
    return result;
  }
}
