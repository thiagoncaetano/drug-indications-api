import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from '../../../infrastructure/repositories/users.repository';
import { UserModel } from '../../../infrastructure/models/user.model';
import { CreateUserDTO } from '../dto/users.dto';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findByEmail: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockUserData: CreateUserDTO = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should create a new user successfully', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.save.mockImplementation(async (user) => {
        user.id = 'generated-id';
        return user;
      });

      const result = await service.create(mockUserData);

      expect(result).toEqual({
        message: 'User created successfully. Welcome Test User!',
      });
      expect(usersRepository.findByEmail).toHaveBeenCalledWith(mockUserData.email);
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if email already exists', async () => {
      const existingUser = new UserModel();
      usersRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(service.create(mockUserData)).rejects.toThrow(
        new BadRequestException('User with this email already exists')
      );
    });

    it('should set password correctly when creating user', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      let savedUser: UserModel;
      
      usersRepository.save.mockImplementation(async (user) => {
        savedUser = user;
        user.id = 'generated-id';
        return user;
      });

      await service.create(mockUserData);

      expect(savedUser!.saltPassword).toBeDefined();
      expect(savedUser!.encryptedPassword).toBeDefined();
      expect(savedUser!.saltPassword.length).toBe(32);
      expect(savedUser!.encryptedPassword.length).toBe(64);
    });

    it('should generate UUID for new user', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      let savedUser: UserModel;
      
      usersRepository.save.mockImplementation(async (user) => {
        savedUser = user;
        return user;
      });

      await service.create(mockUserData);

      expect(savedUser!.id).toBeDefined();
      expect(savedUser!.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });
});