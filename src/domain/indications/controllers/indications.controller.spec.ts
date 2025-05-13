import { Test, TestingModule } from '@nestjs/testing';
import { IndicationsController } from './indications.controller';
import { IndicationsService } from '../services/indications.service';
import {
  CreateIndicationDTO,
  QueryIndicationsDTO,
  UpdateIndicationDTO,
} from '../dto/indications.dto';
import {
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { IndicationModel } from '../../../infrastructure/models/indication.model';
import { AuthGuard } from '../../../guards/auth.guard';
import { AuthService } from '../../auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';

describe('IndicationsController', () => {
  let controller: IndicationsController;
  let service: jest.Mocked<IndicationsService>;

  const mockIndication: IndicationModel = {
    id: '1',
    name: 'Test Indication',
    drugId: '1',
    drug: {
      id: '1',
      name: 'Test Drug',
    } as any,
    indicationICD10Codes: [
      {
        icd10Code: {
          id: '1',
          code: 'A00',
        },
      },
    ],
  } as IndicationModel;

  const mockJwtService = {
    verify: jest.fn(),
    sign: jest.fn(),
  };

  const mockAuthService = {
    validateToken: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndicationsController],
      providers: [
        {
          provide: IndicationsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: AuthGuard,
          useValue: mockAuthGuard,
        },
      ],
    }).compile();

    controller = module.get<IndicationsController>(IndicationsController);
    service = module.get(IndicationsService) as jest.Mocked<IndicationsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new indication', async () => {
      const createDto: CreateIndicationDTO = {
        indication: 'Test Indication',
        drugName: 'Test Drug',
        icd10Codes: ['A00'],
      };

      service.create.mockResolvedValue(mockIndication);

      const result = await controller.create(createDto);
      expect(result).toEqual(mockIndication);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw error when indication exists', async () => {
      const createDto: CreateIndicationDTO = {
        indication: 'Existing Indication',
        drugName: 'Test Drug',
        icd10Codes: ['A00'],
      };

      service.create.mockRejectedValue(
        new UnprocessableEntityException('Indication already registered')
      );

      await expect(controller.create(createDto)).rejects.toThrow(
        UnprocessableEntityException
      );
    });
  });

  describe('getAll()', () => {
    it('should return indications list', async () => {
      const query: QueryIndicationsDTO = {};
      service.findAll.mockResolvedValue([mockIndication]);

      const result = await controller.getAll(query);
      expect(result).toEqual([mockIndication]);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });

    it('should filter by drugId', async () => {
      const query: QueryIndicationsDTO = { drugId: '1' };
      service.findAll.mockResolvedValue([mockIndication]);

      await controller.getAll(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('update()', () => {
    it('should update an indication', async () => {
      const updateDto: UpdateIndicationDTO = {
        name: 'Updated Name',
        drug: {
          id: '1',
          drugName: 'Updated Drug',
        },
        icd10Codes: [
          {
            id: '1',
            icd10: 'A01',
          },
        ],
      };

      const updatedIndication = { ...mockIndication, name: 'Updated Name' };
      service.update.mockResolvedValue(updatedIndication);

      const result = await controller.update('1', updateDto);
      expect(result.name).toBe('Updated Name');
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });

    it('should throw error when indication not found', async () => {
      const updateDto: UpdateIndicationDTO = { name: 'Updated Name' };
      service.update.mockRejectedValue(
        new NotFoundException('Indication not found')
      );

      await expect(controller.update('999', updateDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('destroy()', () => {
    it('should delete an indication', async () => {
      service.delete.mockResolvedValue({
        message: 'Indication successfully deleted.',
      });

      const result = await controller.destroy('1');
      expect(result).toEqual({
        message: 'Indication successfully deleted.',
      });
      expect(service.delete).toHaveBeenCalledWith('1');
    });

    it('should throw error when indication not found', async () => {
      service.delete.mockRejectedValue(
        new NotFoundException('Indication not found')
      );

      await expect(controller.destroy('999')).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
