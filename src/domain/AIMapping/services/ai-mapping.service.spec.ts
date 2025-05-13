import { Test, TestingModule } from '@nestjs/testing';
import { AIMappingService } from './ai-mapping.service';
import { AIAdapter } from '../../../infrastructure/adapters/ai/ai.adapter';
import { HttpException } from '@nestjs/common';

describe('AIMappingService', () => {
  let service: AIMappingService;
  let aiAdapter: AIAdapter;

  const mockAIAdapter = {
    execute: jest.fn().mockResolvedValue({
      content: '[{"indication": "Indication 1", "icd10": ["A01", "A02"]}, {"indication": "Indication 2", "icd10": ["B01"]}]',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIMappingService,
        { provide: AIAdapter, useValue: mockAIAdapter },
      ],
    }).compile();

    service = module.get<AIMappingService>(AIMappingService);
    aiAdapter = module.get<AIAdapter>(AIAdapter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('mapIndicationsToICD10', () => {
    it('should map indications to ICD-10 codes successfully', async () => {
      const indications = ['Indication 1', 'Indication 2'];

      const result = await service.mapIndicationsToICD10(indications);

      expect(result).toEqual([
        { indication: 'Indication 1', icd10: ['A01', 'A02'] },
        { indication: 'Indication 2', icd10: ['B01'] },
      ]);
      expect(aiAdapter.execute).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );
    });

    it('should throw an error if AI response is invalid', async () => {
      mockAIAdapter.execute.mockResolvedValueOnce({ content: 'invalid json' });

      const indications = ['Indication 1'];

      await expect(service.mapIndicationsToICD10(indications)).rejects.toThrow(HttpException);
    });

    it('should throw an error if AIAdapter throws an exception', async () => {
      mockAIAdapter.execute.mockRejectedValueOnce(new HttpException('AI service error', 500));

      const indications = ['Indication 1'];

      await expect(service.mapIndicationsToICD10(indications)).rejects.toThrow(HttpException);
    });
  });
});
