import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("sessions")
export class SessionModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "exp_at" })
  expAt: Date;

  expired(): boolean {
    return this.expAt.getTime() < new Date().getTime();
  }
}
