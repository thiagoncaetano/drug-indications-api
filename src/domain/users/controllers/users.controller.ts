import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDTO } from '../dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async register(
    @Body() data: CreateUserDTO
  ) {
    return this.usersService.create(data);
  }
}
