import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IndicationICD10CodeModel } from './indication_icd10code.model';

@Entity('icd10codes')
export class ICD10CodeModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @OneToMany(() => IndicationICD10CodeModel, (indicationICD10Code) => indicationICD10Code.icd10Code)
  indicationICD10Codes: IndicationICD10CodeModel[];
}
