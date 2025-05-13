import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDTO } from '../dto/auth.dto';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '../../../guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

const mockAuthGuard = {
  canActivate: jest.fn(() => true),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    login: jest.Mock;
    logout: jest.Mock;
    getSession?: jest.Mock;
  };

  const mockAuthResponse = {
    access_token: 'mock-access-token',
    expAt: new Date(Date.now() + 3600000),
  };

  const mockLoginDTO: LoginDTO = {
    email: 'user@example.com',
    password: 'validPassword123',
  };

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      logout: jest.fn(),
      getSession: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: AuthGuard,
          useValue: mockAuthGuard,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login()', () => {
    it('should return authentication tokens on successful login', async () => {
      authService.login.mockResolvedValue(mockAuthResponse);
      const result = await controller.login(mockLoginDTO);
      expect(result).toEqual(mockAuthResponse);
      expect(authService.login).toHaveBeenCalledWith(mockLoginDTO);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      authService.login.mockRejectedValue(new NotFoundException('User not found'));
      await expect(controller.login(mockLoginDTO)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      authService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));
      await expect(controller.login(mockLoginDTO)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout()', () => {
    const mockRequest = {
      session: {
        id: 'mock-session-id',
      },
    };

    it('should return success message on logout', async () => {
      authService.logout.mockResolvedValue({ 
        message: 'You have been logged out successfully. See you soon!' 
      });
      const result = await controller.logout(mockRequest);
      expect(result).toEqual({
        message: 'You have been logged out successfully. See you soon!'
      });
      expect(authService.logout).toHaveBeenCalledWith('mock-session-id');
    });

    it('should throw UnauthorizedException when session is invalid', async () => {
      authService.logout.mockRejectedValue(new UnauthorizedException('Session not found'));
      await expect(controller.logout(mockRequest)).rejects.toThrow(UnauthorizedException);
    });
  });
});