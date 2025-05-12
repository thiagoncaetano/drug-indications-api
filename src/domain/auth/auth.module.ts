import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // JwtModule.register({
    //   secret: process.env.JTW_SECRET,
    //   signOptions: { expiresIn: '60s' }, // Expiração do token
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
