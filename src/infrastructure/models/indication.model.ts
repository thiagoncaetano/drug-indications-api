import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { DrugModel } from './drug.model';
import { IndicationICD10CodeModel } from './indication_icd10code.model';

@Entity('indications')
export class IndicationModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: "drug_id" })
  drugId: string;

  @ManyToOne(() => DrugModel, (drug) => drug.indications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'drug_id' })
  drug: DrugModel;

  @OneToMany(() => IndicationICD10CodeModel, (indicationICD10Code) => indicationICD10Code.indication)
  indicationICD10Codes: IndicationICD10CodeModel[];
}
