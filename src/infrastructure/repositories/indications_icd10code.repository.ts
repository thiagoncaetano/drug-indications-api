import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IndicationICD10CodeModel } from '../models/indication_icd10code.model';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IndicationsICD10CodeRepository {
  constructor(
    @InjectRepository(IndicationICD10CodeModel)
    private readonly indicationICD10CodeRepo: Repository<IndicationICD10CodeModel>,
  ) {}

  async bulkSave(associations: { indicationId: string, icd10CodeId: string }[]): Promise<IndicationICD10CodeModel[]> {
    return await this.indicationICD10CodeRepo.save(associations);
  }

  async deleteByIndicationId(indicationId: string): Promise<void> {
    await this.indicationICD10CodeRepo.delete({ indicationId });
  }
}
