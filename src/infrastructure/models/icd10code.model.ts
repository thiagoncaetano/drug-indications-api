import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('icd10_codes')
export class ICD10Code {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;
}
