import { In, Repository } from 'typeorm';
import { IndicationModel } from '../models/indication.model';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IndicationsRepository {
  constructor(
    @InjectRepository(IndicationModel)
    private readonly indicationsRepo: Repository<IndicationModel>,
  ) {}

  async bulkSave(indications: IndicationModel[]): Promise<IndicationModel[]> {
    for (const indication of indications) {
      indication.id = randomUUID();
    }
    return await this.indicationsRepo.save(indications);
  }

  async findOrCreateAllByNames(names: string[],drugId: string): Promise<IndicationModel[]> {
    const existing = await this.indicationsRepo.find({
      where: {
        name: In(names),
        drugId,
      },
    });

    const existingNames = new Set(existing.map((e) => e.name));

    const newIndications = names
      .filter((name) => !existingNames.has(name))
      .map((name) => {
        const model = new IndicationModel();
        model.id = randomUUID();
        model.name = name;
        model.drugId = drugId;
        return model;
      });

    if (newIndications.length > 0) {
      const created = await this.indicationsRepo.save(newIndications);
      return [...existing, ...created];
    }

    return existing;
  }

  async findByDrugName(drugName: string): Promise<IndicationModel[]> {
    const indications = await this.indicationsRepo
      .createQueryBuilder('indication')
      .innerJoinAndSelect('indication.drug', 'drug')
      .innerJoinAndSelect('indication.indicationICD10Codes', 'ic')
      .innerJoinAndSelect('ic.icd10Code', 'icd10Code')
      .where('drug.name = :name', { name: drugName })
      .getMany();

    return indications;
  }
}
