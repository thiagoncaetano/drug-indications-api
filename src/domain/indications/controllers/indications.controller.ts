import { Controller, Get, Query } from '@nestjs/common';
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
    return await this.indicationsService.extractAndMapIndications(drug);
  }
}
