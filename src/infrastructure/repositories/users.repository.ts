import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from '../models/user.model';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly usersRepo: Repository<UserModel>,
  ) {}

  async save(user: UserModel): Promise<UserModel> {
    user.id = randomUUID();
    return await this.usersRepo.save(user);
  }

  async findAll(): Promise<UserModel[]> {
    return await this.usersRepo.find();
  }

  async findById(id: string): Promise<UserModel | null> {
    return await this.usersRepo.findOneBy({ id });
  }

  async update(id: string, data: Partial<UserModel>): Promise<UserModel|null> {
    await this.usersRepo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.usersRepo.delete(id);
  }

  async findByEmailAndPassword(email: string, password: string): Promise<UserModel | null> {
    return await this.usersRepo.findOneBy({ email, encryptedPassword: password });
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    return await this.usersRepo.findOneBy({ email });
  }
}
