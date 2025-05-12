import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDTO } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() LoginDTO: LoginDTO) {
    return this.authService.login(LoginDTO);  // Chama o método de login no AuthService
  }
}
