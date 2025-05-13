import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDTO } from '../dto/users.dto';
import { UsersRepository } from '../../../infrastructure/repositories/users.repository';
import { UserModel } from '../../../infrastructure/models/user.model';
import { randomUUID, randomBytes, scryptSync } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository
  ) {}

  async create(data: CreateUserDTO) {
    const { name, email, password } = data;

    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) throw new BadRequestException('User with this email already exists');

    const user = new UserModel();
    user.id = randomUUID();
    user.name = name;
    user.email = email;
    user.setPassword(password);

    await this.usersRepository.save(user);

    return { message: `User created successfully. Welcome ${user.name}!` };
  }
}
