import { Entity,JoinColumn,ManyToOne,PrimaryColumn } from 'typeorm';
import { IndicationModel } from './indication.model';
import { ICD10CodeModel } from './icd10code.model';

@Entity('indications_codes')
export class IndicationICD10CodeModel {
  @PrimaryColumn({ name: 'indication_id' })
  indicationId: string
  
  @PrimaryColumn({ name: 'icd10code_id'})
  icd10CodeId: string

  @ManyToOne(() => IndicationModel, indication => indication.indicationICD10Codes)
  @JoinColumn({ name: 'indication_id' })
  indication: IndicationModel;

  @ManyToOne(() => ICD10CodeModel, icd10Code => icd10Code.indicationICD10Codes)
  @JoinColumn({ name: 'icd10code_id' })
  icd10Code: ICD10CodeModel;
}
