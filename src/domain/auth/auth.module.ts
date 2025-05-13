import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from '../../infrastructure/models/user.model';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../../utils/constants';
import { SessionModel } from '../../infrastructure/models/session.model';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([UserModel, SessionModel]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
