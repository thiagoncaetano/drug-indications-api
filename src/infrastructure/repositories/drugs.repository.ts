import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DrugModel } from '../models/drug.model';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';

@Injectable()
export class DrugsRepository {
  constructor(
    @InjectRepository(DrugModel)
    private readonly drugsRepo: Repository<DrugModel>,
  ) {}

  async save(drug: DrugModel): Promise<DrugModel> {
    if (!drug.id) drug.id = randomUUID();
    return await this.drugsRepo.save(drug);
  }

  async findById(id: string): Promise<DrugModel|null> {
    return await this.drugsRepo.findOneBy({ id });
  }

  async findByNameOrCreate(name: string): Promise<DrugModel> {
    if (!name) throw new Error("Name is required")

    let drug = await this.drugsRepo.findOne({
      where: { name },
      relations: { indications: true },
    });
    
    if (!drug) {
      drug = new DrugModel();
      drug.id = randomUUID();
      drug.name = name;
      return await this.drugsRepo.save(drug);
    }

    return drug;
  }
}
