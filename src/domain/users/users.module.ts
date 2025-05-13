import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../../infrastructure/repositories/users.repository';
import { UserModel } from '../../infrastructure/models/user.model';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
