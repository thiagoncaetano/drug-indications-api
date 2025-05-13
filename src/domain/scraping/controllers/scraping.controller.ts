import { Controller, Get, Query } from '@nestjs/common';
import { ScrapingService } from '../services/scraping.service';

@Controller('scraping')
export class ScrapingController {
   constructor(
    private readonly scrapingService: ScrapingService
  ) {}

  @Get()
  async scrapeIndications(
    @Query('drug') drug: string
  ) {
    return await this.scrapingService.extractAndMapIndications(drug);
  }
}
