import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserDTO } from '../dto/users.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn().mockResolvedValue({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword123',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call usersService.create and return user data including password', async () => {
      const createUserDTO: CreateUserDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const result = await controller.register(createUserDTO);

      expect(service.create).toHaveBeenCalledWith(createUserDTO);
      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword123',
      });
    });

    it('should throw error if service fails', async () => {
      const createUserDTO: CreateUserDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      service.create = jest.fn().mockRejectedValue(new Error('Service error'));

      await expect(controller.register(createUserDTO)).rejects.toThrow('Service error');
    });

    it('should fail validation if password is less than 6 characters', async () => {
      const createUserDTO = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'short',
      };

      const instance = plainToInstance(CreateUserDTO, createUserDTO);
      const errors = await validate(instance);

      expect(errors.length).toBeGreaterThan(0);
      const passwordError = errors.find(e => e.property === 'password');
      expect(passwordError?.constraints?.minLength).toBe('password must be longer than or equal to 6 characters');
    });
  });
});
