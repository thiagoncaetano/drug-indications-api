import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../domain/auth/services/auth.service';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { SessionModel } from '../infrastructure/models/session.model';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: jest.Mocked<JwtService>;
  let authService: jest.Mocked<AuthService>;

  const mockToken = 'mock-token';
  const mockPayload = { sub: 'user-id', email: 'user@example.com' };
  
  const mockSession: SessionModel = {
    id: 'session-id',
    userId: 'user-id',
    expAt: new Date(Date.now() + 3600000),
    expired: function() {
      return this.expAt.getTime() < new Date().getTime();
    }
  } as SessionModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            getSession: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService) as jest.Mocked<JwtService>;
    authService = module.get<AuthService>(AuthService) as jest.Mocked<AuthService>;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true for valid token', async () => {
      const mockRequest = { headers: { authorization: `Bearer ${mockToken}` } } as Request;
      const mockContext = { switchToHttp: () => ({ getRequest: () => mockRequest }) } as ExecutionContext;

      jwtService.verifyAsync.mockResolvedValue(mockPayload);
      authService.getSession.mockResolvedValue(mockSession);

      await expect(guard.canActivate(mockContext)).resolves.toBe(true);
    });
  });
});