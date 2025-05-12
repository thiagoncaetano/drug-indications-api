import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';  // Exemplo de uso de JWT
import { LoginDTO } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    // private readonly jwtService: JwtService
  ) {}

  async login(LoginDTO: LoginDTO) {
    const { username, password } = LoginDTO;

    // Lógica de validação de credenciais (exemplo simples)
    if (username === 'user' && password === 'password') {
      const payload = { username };  // Dados que serão incluídos no JWT

      // Gera o token JWT
      // const accessToken = this.jwtService.sign(payload);
      return {
        access_token: "123",
      };
    }

    throw new Error('Invalid credentials');
  }
}
