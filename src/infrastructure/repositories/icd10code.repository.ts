import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ICD10CodeModel } from '../models/icd10code.model';
import { randomUUID } from 'crypto';

@Injectable()
export class ICD10CodeRepository {
  constructor(
    @InjectRepository(ICD10CodeModel)
    private readonly icd10CodeRepo: Repository<ICD10CodeModel>,
  ) {}

  async save(icd10Code: ICD10CodeModel): Promise<ICD10CodeModel> {
    return await this.icd10CodeRepo.save(icd10Code);
  }

  async bulkSave(icd10Codes: ICD10CodeModel[]): Promise<ICD10CodeModel[]> {
    icd10Codes.forEach((icd10Code) => {
      icd10Code.id = randomUUID();
    });
    return await this.icd10CodeRepo.save(icd10Codes);
  }

  async findByCode(code: string): Promise<ICD10CodeModel|null> {
    return await this.icd10CodeRepo.findOne({ where: { code } });
  }

  async findById(id: string): Promise<ICD10CodeModel|null> {
    return await this.icd10CodeRepo.findOneBy({ id });
  }

  async findAllByCodes(codes: string[]): Promise<ICD10CodeModel[]> {
    return await this.icd10CodeRepo.find({
      where: { code: In(codes) },
    });
  }

  async findOrCreateAllByCodes(codes: string[]): Promise<ICD10CodeModel[]> {
    const existing = await this.findAllByCodes(codes);
    const existingCodes = new Set(existing.map((e) => e.code));

    const newCodes = codes
      .filter((code) => !existingCodes.has(code))
      .map((code) => {
        const model = new ICD10CodeModel();
        model.id = randomUUID();
        model.code = code;
        return model;
      });

    if (newCodes.length > 0) {
      const created = await this.bulkSave(newCodes);
      return [...existing, ...created];
    }

    return existing;
  }
}
