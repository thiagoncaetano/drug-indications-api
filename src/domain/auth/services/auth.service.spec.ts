import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserModel } from '../../../infrastructure/models/user.model';
import { SessionModel } from '../../../infrastructure/models/session.model';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<UserModel>;
  let sessionRepository: Repository<SessionModel>;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    name: 'Test User',
    encryptedPassword: 'hashed-password',
    saltPassword: 'salt',
    validatePassword: jest.fn().mockReturnValue(true),
  };

  const mockSession = {
    id: 'session-id',
    userId: 'user-id',
    expAt: new Date(Date.now() - 1000),
    expired: jest.fn().mockReturnValue(true),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-access-token'),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: getRepositoryToken(UserModel),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: getRepositoryToken(SessionModel),
          useValue: {
            save: jest.fn().mockResolvedValue(mockSession),
            findOneBy: jest.fn().mockResolvedValue(mockSession),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<UserModel>>(getRepositoryToken(UserModel));
    sessionRepository = module.get<Repository<SessionModel>>(getRepositoryToken(SessionModel));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should login successfully and return access token', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('expAt');
      expect(sessionRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      const loginDto = { email: 'wrong@example.com', password: 'password' };

      await expect(service.login(loginDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      jest.spyOn(mockUser, 'validatePassword').mockReturnValue(false);
      const loginDto = { email: 'test@example.com', password: 'wrong-password' };

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const sessionId = 'session-id';

      const result = await service.logout(sessionId);

      expect(result).toEqual({ message: "You have been logged out successfully. See you soon!" });
      expect(sessionRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException if session is not found', async () => {
      jest.spyOn(sessionRepository, 'findOneBy').mockResolvedValueOnce(null);
      const sessionId = 'wrong-session-id';

      await expect(service.logout(sessionId)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getSession', () => {
    it('should throw UnauthorizedException if valid JWT is provided but session is expired', async () => {
      const jwt = 'valid-jwt';
      const decoded = { sub: 'session-id' };

      jest.spyOn(jwtService, 'verify').mockReturnValue(decoded);

      jest.spyOn(sessionRepository, 'findOneBy').mockResolvedValueOnce(mockSession);

      await expect(service.getSession(jwt)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if JWT is invalid', async () => {
      const jwt = 'invalid-jwt';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('invalid token');
      });

      await expect(service.getSession(jwt)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if session does not exist', async () => {
      const jwt = 'valid-jwt';
      const decoded = { sub: 'session-id' };

      jest.spyOn(jwtService, 'verify').mockReturnValue(decoded);
      jest.spyOn(sessionRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(service.getSession(jwt)).rejects.toThrow(UnauthorizedException);
    });
  });
});
