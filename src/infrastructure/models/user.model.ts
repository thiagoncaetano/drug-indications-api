import { randomBytes, scryptSync } from 'crypto';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ name: 'encrypted_password' })
  encryptedPassword: string

  @Column({ name: 'salt_password' })
  saltPassword: string

  setPassword(password: string): void {
    this.saltPassword = randomBytes(16).toString('hex');
    this.encryptedPassword = scryptSync(password, this.saltPassword, 32).toString('hex');
  }

  validatePassword(password: string): boolean {
    const hash = scryptSync(password, this.saltPassword, 32).toString('hex');
    return hash === this.encryptedPassword;
  }
}
