import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { SessionModel } from '../../../infrastructure/models/session.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { JWT_SECRET } from '../../../utils/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(SessionModel)
    private readonly sessionRepository: Repository<SessionModel>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const session = await this.sessionRepository.findOne({ where: { id: payload.id } });
    if (!session) throw new UnauthorizedException('Unauthorized');
    return { userId: payload.userId, sessionId: payload.id };
  }
}
