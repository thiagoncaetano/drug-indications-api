import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from '../dto/users.dto';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDTO) {
    // Aqui você pode adicionar a lógica para salvar no banco de dados
    // Exemplo de retorno simulado:
    return {
      message: 'User created successfully',
      user: {
        name: createUserDto.name,
        email: createUserDto.email,
      },
    };
  }
}
