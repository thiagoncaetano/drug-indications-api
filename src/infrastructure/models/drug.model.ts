import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IndicationModel } from './indication.model';

@Entity('drugs')
export class DrugModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => IndicationModel, indication => indication.drug, { cascade: true })
  indications: IndicationModel[];
}
