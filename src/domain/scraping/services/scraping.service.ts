import { HttpException, Injectable } from '@nestjs/common';
import { ScrapingAdapter } from '../../../infrastructure/adapters/scraping/scraping.service';
import { AIMappingService, MappedIndication } from '../../AIMapping/services/ai-mapping.service';
import { DrugsRepository } from '../../../infrastructure/repositories/drugs.repository';
import { IndicationsRepository } from '../../../infrastructure/repositories/indications.repository';
import { ICD10CodeRepository } from '../../../infrastructure/repositories/icd10code.repository';
import { IndicationsICD10CodeRepository } from '../../../infrastructure/repositories/indications_icd10code.repository';
import { DrugModel } from '../../../infrastructure/models/drug.model';

@Injectable()
export class ScrapingService {
  constructor(
    private readonly scrapingAdapter: ScrapingAdapter,
    private readonly aiMappingService: AIMappingService,
    private readonly drugsRepository: DrugsRepository,
    private readonly indicationsRepository: IndicationsRepository,
    private readonly icd10codeRepository: ICD10CodeRepository,
    private readonly indicationsICD10codeRepository: IndicationsICD10CodeRepository,
  ) {}

  async extractAndMapIndications(drugName: string) {
    try {
      const existingIndications = await this.indicationsRepository.findByDrugName(drugName);
      if(existingIndications.length) return existingIndications;

      const indications = await this.scrapingAdapter.extractIndicationsFromSetId(drugName);
      const mappedIndications: MappedIndication[] = await this.aiMappingService.mapIndicationsToICD10(indications);
      
      const drug = await this.drugsRepository.findByNameOrCreate(drugName);

      const newIndications = await this.createAndRelateIndicationsAndICD10Code(mappedIndications, drug);

      return newIndications;
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  async createAndRelateIndicationsAndICD10Code(mappedIndications: MappedIndication[], drug: DrugModel) {
    const indicationsNames = mappedIndications.map((i) => i.indication);
    const persistedIndications = await this.indicationsRepository.findOrCreateAllByNames(indicationsNames, drug.id);

    const codes = [...new Set(mappedIndications.flatMap((item) => item.icd10.map((icd10) => icd10)))];
    const persistedICD10 = await this.icd10codeRepository.findOrCreateAllByCodes(codes);

    const icd10Map = new Map(persistedICD10.map((icd) => [icd.code, icd.id]));

    const indicationICD10Associations: { indicationId: string, icd10CodeId: string }[] = [];
    const uniqueAssociations = new Set<string>();

    for (const indication of persistedIndications) {
      const relatedICD10Codes = mappedIndications.find((m) => m.indication === indication.name)?.icd10;

      if (relatedICD10Codes) {
        for (const icd10 of relatedICD10Codes) {
          const icd10RecordId = icd10Map.get(icd10);
          if (icd10RecordId) {
            const combinationKey = `${indication.id}-${icd10RecordId}`;
            if (!uniqueAssociations.has(combinationKey)) {
              uniqueAssociations.add(combinationKey);
              indicationICD10Associations.push({
                indicationId: indication.id,
                icd10CodeId: icd10RecordId,
              });
            }
          }
        }
      }
    }

    await this.indicationsICD10codeRepository.bulkSave(indicationICD10Associations);
    return persistedIndications;
  }
}
