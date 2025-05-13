import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDTO } from '../dto/auth.dto';
import { AuthGuard } from '../../../guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() data: LoginDTO
  ) {
    return this.authService.login(data);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(
    @Request() req
  ) {
    return await this.authService.logout(req.session.id);
  }

  @UseGuards(AuthGuard)
  @Post('teste')
  async teste(
    @Body() data: any
  ) {
    return {ok: "ok"};
  }
}
