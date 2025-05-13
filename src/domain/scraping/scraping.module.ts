import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicationModel } from '../../infrastructure/models/indication.model';
import { DrugModel } from '../../infrastructure/models/drug.model';
import { ICD10CodeModel } from '../../infrastructure/models/icd10code.model';
import { IndicationICD10CodeModel } from '../../infrastructure/models/indication_icd10code.model';
import { IndicationsController } from '../indications/controllers/indications.controller';
import { ScrapingController } from './controllers/scraping.controller';
import { ScrapingService } from './services/scraping.service';
import { ScrapingAdapter } from '../../infrastructure/adapters/scraping/scraping.service';
import { AIAdapter } from '../../infrastructure/adapters/ai/ai.adapter';
import { AIMappingService } from '../AIMapping/services/ai-mapping.service';
import { IndicationsRepository } from '../../infrastructure/repositories/indications.repository';
import { DrugsRepository } from '../../infrastructure/repositories/drugs.repository';
import { ICD10CodeRepository } from '../../infrastructure/repositories/icd10code.repository';
import { IndicationsICD10CodeRepository } from '../../infrastructure/repositories/indications_icd10code.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IndicationModel,
      DrugModel,
      ICD10CodeModel,
      IndicationICD10CodeModel,
    ]),
  ],
  controllers: [ScrapingController],
  providers: [
    ScrapingService,
    ScrapingAdapter,
    AIAdapter,
    AIMappingService,
    IndicationsRepository,
    DrugsRepository,
    ICD10CodeRepository,
    IndicationsICD10CodeRepository,
  ],
})
export class ScrapingModule {}
