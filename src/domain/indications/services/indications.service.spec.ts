import { Test, TestingModule } from '@nestjs/testing';
import { IndicationsService } from './indications.service';
import { DrugsRepository } from '../../../infrastructure/repositories/drugs.repository';
import { IndicationsRepository } from '../../../infrastructure/repositories/indications.repository';
import { ICD10CodeRepository } from '../../../infrastructure/repositories/icd10code.repository';
import { IndicationsICD10CodeRepository } from '../../../infrastructure/repositories/indications_icd10code.repository';
import { CreateIndicationDTO } from '../dto/indications.dto';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

const drugsRepositoryMock = {
  findByNameOrCreate: jest.fn(),
};
const indicationsRepositoryMock = {
  findByName: jest.fn(),
  save: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  delete: jest.fn(),
};
const icd10CodeRepositoryMock = {
  findOrCreateAllByCodes: jest.fn(),
};
const indicationsICD10CodeRepositoryMock = {
  bulkSave: jest.fn(),
  deleteByIndicationId: jest.fn(),
};

describe('IndicationsService', () => {
  let service: IndicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndicationsService,
        { provide: DrugsRepository, useValue: drugsRepositoryMock },
        { provide: IndicationsRepository, useValue: indicationsRepositoryMock },
        { provide: ICD10CodeRepository, useValue: icd10CodeRepositoryMock },
        { provide: IndicationsICD10CodeRepository, useValue: indicationsICD10CodeRepositoryMock },
      ],
    }).compile();

    service = module.get<IndicationsService>(IndicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw UnprocessableEntityException if indication already exists', async () => {
      const dto: CreateIndicationDTO = {
        indication: 'Test Indication',
        drugName: 'Test Drug',
        icd10Codes: ['A00', 'B01'],
      };
      indicationsRepositoryMock.findByName.mockResolvedValueOnce({ id: '1' });

      await expect(service.create(dto)).rejects.toThrow(UnprocessableEntityException);
    });

    it('should successfully create a new indication', async () => {
      const dto: CreateIndicationDTO = {
        indication: 'Test Indication',
        drugName: 'Test Drug',
        icd10Codes: ['A00', 'B01'],
      };
      
      indicationsRepositoryMock.findByName.mockResolvedValueOnce(null);
      drugsRepositoryMock.findByNameOrCreate.mockResolvedValueOnce({ id: 'drug-id', name: 'Test Drug' });
      indicationsRepositoryMock.save.mockResolvedValueOnce({ id: 'indication-id', name: dto.indication });
      icd10CodeRepositoryMock.findOrCreateAllByCodes.mockResolvedValueOnce([
        { id: 'icd10-id-1', code: 'A00' },
        { id: 'icd10-id-2', code: 'B01' },
      ]);
      indicationsICD10CodeRepositoryMock.bulkSave.mockResolvedValueOnce([]);

      const result = await service.create(dto);
      expect(result).toHaveProperty('id');
      expect(result.name).toBe(dto.indication);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if indication not found', async () => {
      indicationsRepositoryMock.findById.mockResolvedValueOnce(null);

      await expect(service.update('invalid-id', { name: 'Updated Indication' }))
        .rejects.toThrow(NotFoundException);
    });

    it('should successfully update an indication', async () => {
      const indicationData = { id: '1', name: 'Test Indication' };
      const updateData = { name: 'Updated Indication' };

      indicationsRepositoryMock.findById.mockResolvedValueOnce(indicationData);
      indicationsRepositoryMock.save.mockResolvedValueOnce({ ...indicationData, name: updateData.name });

      const result = await service.update('1', updateData);
      expect(result.name).toBe(updateData.name);
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException if indication not found', async () => {
      indicationsRepositoryMock.findById.mockResolvedValueOnce(null);

      await expect(service.delete('invalid-id'))
        .rejects.toThrow(NotFoundException);
    });

    it('should successfully delete an indication', async () => {
      indicationsRepositoryMock.findById.mockResolvedValueOnce({ id: '1' });
      indicationsICD10CodeRepositoryMock.deleteByIndicationId.mockResolvedValueOnce(undefined);
      indicationsRepositoryMock.delete.mockResolvedValueOnce(undefined);

      const result = await service.delete('1');
      expect(result.message).toBe('Indication successfully deleted.');
    });
  });
});
