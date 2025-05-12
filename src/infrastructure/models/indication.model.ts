import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { DrugModel } from './drug.model';
import { ICD10Code } from './icd10code.model';

@Entity('indications')
export class IndicationModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => DrugModel, drug => drug.indications)
  drug: DrugModel;

  @ManyToMany(() => ICD10Code, { cascade: true, eager: true })
  @JoinTable()
  icd10Codes: ICD10Code[];
}
