import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from '../dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from '../../../infrastructure/models/user.model';
import { SessionModel } from '../../../infrastructure/models/session.model';
import { AuthResponseDTO } from '../dto/auth-response.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(SessionModel)
    private readonly sessionRepository: Repository<SessionModel>,
  ) {}

  async login(data: LoginDTO): Promise<AuthResponseDTO> {
    const { email, password } = data;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found')

    const isPasswordValid = user.validatePassword(password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const session = new SessionModel();
    session.id = randomUUID();
    session.userId = user.id;
    session.expAt = new Date(Date.now() + 1000 * 60 * 60 * 24)

    await this.sessionRepository.save(session);

    const payload = { email: user.email, sub: session.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      expAt: session.expAt,
    };
  }

  async logout(sessionId: string): Promise<{ message: string }> {
    const session = await this.sessionRepository.findOneBy({ id: sessionId });
    if (!session) throw new UnauthorizedException('Session not found');
    
    session.expAt = new Date();
    
    await this.sessionRepository.save(session);

    return { message: "You have been logged out successfully. See you soon!" };
  }

  async getSession(jwt: string): Promise<SessionModel> {
    try {
      const decoded = this.jwtService.verify(jwt);
      const session = await this.sessionRepository.findOneBy({id: decoded.sub });

      if(!session || session.expired()) throw new UnauthorizedException("Unauthorized");

      return session;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
