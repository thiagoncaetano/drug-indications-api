import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ScrapingService } from '../services/scraping.service';
import { AuthGuard } from '../../../guards/auth.guard';

@UseGuards(AuthGuard)
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
