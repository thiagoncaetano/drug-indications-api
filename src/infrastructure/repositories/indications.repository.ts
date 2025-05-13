import { In, Repository } from 'typeorm';
import { IndicationModel } from '../models/indication.model';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryIndicationsDTO } from '../../domain/indications/dto/indications.dto';

@Injectable()
export class IndicationsRepository {
  constructor(
    @InjectRepository(IndicationModel)
    private readonly indicationsRepo: Repository<IndicationModel>,
  ) {}

  async save(indication: IndicationModel): Promise<IndicationModel> {
    if (!indication.id)indication.id = randomUUID()
    return await this.indicationsRepo.save(indication);
  }

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

  async findByName(indication: string): Promise<IndicationModel|null> {
    return await this.indicationsRepo.findOneBy({ name: indication })
  }

  async findById(id: string): Promise<IndicationModel|null> {
    return await this.indicationsRepo.findOneBy({ id })
  }

  async findAll(query: QueryIndicationsDTO): Promise<IndicationModel[]> {
      const qr = this.indicationsRepo.createQueryBuilder('indications');
      qr.innerJoinAndSelect('indications.drug', 'drug');
      qr.innerJoinAndSelect('indications.indicationICD10Codes', 'ic');
      qr.innerJoinAndSelect('ic.icd10Code', 'icd10Code');

      if (query.indicationId) {
        qr.andWhere('indications.id = :id', { id: query.indicationId });
      }

      if (query.drugId) {
        qr.andWhere('drug.id = :drugId', { drugId: query.drugId });
      }

      if (query.icd10code) {
        qr.andWhere('icd10Code.code = :icd10Code', { icd10Code: query.icd10code });
      }

      return qr.getMany();
  }

  async delete(id: string): Promise<void> {
    await this.indicationsRepo.delete(id)
  }
}
