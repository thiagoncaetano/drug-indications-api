import { Injectable } from "@nestjs/common";
import { ScrapingService } from "../../../infrastructure/scraping/scraping.service";
import { AIMappingService } from "../../AIMapping/services/ai-mapping.service";

@Injectable()
export class IndicationsService {
  constructor(
    private readonly scrapingService: ScrapingService,
    private readonly aiMappingService: AIMappingService,
  ) {}

  async extractAndMapIndications(drugName: string) {
    const indications = await this.scrapingService.extractIndicationsFromSetId(drugName);
    const mappedIndications = await this.aiMappingService.mapIndicationsToICD10(indications);

    return {
      drugName,
      mappedIndications
    };
  }
}
