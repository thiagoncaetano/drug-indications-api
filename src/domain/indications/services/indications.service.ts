import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { CreateIndicationDTO, QueryIndicationsDTO, UpdateIndicationDTO } from "../dto/indications.dto";
import { DrugsRepository } from "../../../infrastructure/repositories/drugs.repository";
import { IndicationsRepository } from "../../../infrastructure/repositories/indications.repository";
import { ICD10CodeRepository } from "../../../infrastructure/repositories/icd10code.repository";
import { IndicationsICD10CodeRepository } from "../../../infrastructure/repositories/indications_icd10code.repository";
import { IndicationModel } from "../../../infrastructure/models/indication.model";
import { IndicationICD10CodeModel } from "../../../infrastructure/models/indication_icd10code.model";

@Injectable()
export class IndicationsService {
  constructor(
    private readonly drugsRepository: DrugsRepository,
    private readonly indicationsRepository: IndicationsRepository,
    private readonly icd10codeRepository: ICD10CodeRepository,
    private readonly indicationsICD10codeRepository: IndicationsICD10CodeRepository,
  ) {}

  async create(data: CreateIndicationDTO): Promise<IndicationModel> {
    const existingIndication = await this.indicationsRepository.findByName(data.indication);
    if(existingIndication) throw new UnprocessableEntityException("Indication already registered");
    
    const drug = await this.drugsRepository.findByNameOrCreate(data.drugName);

    const indication = new IndicationModel();
    indication.drug = drug;
    indication.name = data.indication;

    const persistedIndication = await this.indicationsRepository.save(indication);

    const persistedCodes = await this.icd10codeRepository.findOrCreateAllByCodes(data.icd10Codes);

    let associations: IndicationICD10CodeModel[] = [];

    for(const code of persistedCodes){
      const association = new IndicationICD10CodeModel();
      association.indicationId = persistedIndication.id;
      association.icd10CodeId = code.id;
      associations.push(association);
    }

    await this.indicationsICD10codeRepository.bulkSave(associations);

    return persistedIndication;
  }

  async findAll(query: QueryIndicationsDTO): Promise<IndicationModel[]> {
    return await this.indicationsRepository.findAll(query);
  }

  async update(id: string, data: UpdateIndicationDTO): Promise<IndicationModel> {
    const indication = await this.indicationsRepository.findById(id);
    if(!indication) throw new NotFoundException("Indication not found");
    
    if(data.name) indication.name = data.name;
    
    if(data.drug){
      const drug = await this.drugsRepository.findById(data.drug.id);
      if(!drug) throw new NotFoundException("Drug not found");
      drug.name = data.drug.drugName;
      await this.drugsRepository.save(drug);
    }

    if (data.icd10Codes && data.icd10Codes.length > 0) {
      for (const code of data.icd10Codes) {
        const icd10Code = await this.icd10codeRepository.findById(code.id);
        if (!icd10Code) throw new NotFoundException(`ICD-10 Code ${code.icd10} not found`);
        icd10Code.code = code.icd10;

        await this.icd10codeRepository.save(icd10Code);
      }
    }

    await this.indicationsRepository.save(indication);

    return indication;
  }

  async delete(id: string): Promise<{ message: string }> {
    const indication = await this.indicationsRepository.findById(id);
    if(!indication) throw new NotFoundException("Indication not found");

    await this.indicationsICD10codeRepository.deleteByIndicationId(id);

    await this.indicationsRepository.delete(id)

    return { message: "Indication successfully deleted." };
  }
}
