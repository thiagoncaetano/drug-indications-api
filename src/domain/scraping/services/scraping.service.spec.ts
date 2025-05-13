import { Test, TestingModule } from '@nestjs/testing';
import { ScrapingService } from './scraping.service';
import { ScrapingAdapter } from '../../../infrastructure/adapters/scraping/scraping.adapter';
import { AIMappingService } from '../../AIMapping/services/ai-mapping.service';
import { DrugsRepository } from '../../../infrastructure/repositories/drugs.repository';
import { IndicationsRepository } from '../../../infrastructure/repositories/indications.repository';
import { ICD10CodeRepository } from '../../../infrastructure/repositories/icd10code.repository';
import { IndicationsICD10CodeRepository } from '../../../infrastructure/repositories/indications_icd10code.repository';

const mockScrapingAdapter = {
  extractIndicationsFromSetId: jest.fn(),
};

const mockAIMappingService = {
  mapIndicationsToICD10: jest.fn(),
};

const mockDrugsRepository = {
  findByNameOrCreate: jest.fn(),
};

const mockIndicationsRepository = {
  findByDrugName: jest.fn(),
  findOrCreateAllByNames: jest.fn(),
};

const mockICD10CodeRepository = {
  findOrCreateAllByCodes: jest.fn(),
};

const mockIndicationsICD10CodeRepository = {
  bulkSave: jest.fn(),
};

describe('ScrapingService', () => {
  let service: ScrapingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScrapingService,
        { provide: ScrapingAdapter, useValue: mockScrapingAdapter },
        { provide: AIMappingService, useValue: mockAIMappingService },
        { provide: DrugsRepository, useValue: mockDrugsRepository },
        { provide: IndicationsRepository, useValue: mockIndicationsRepository },
        { provide: ICD10CodeRepository, useValue: mockICD10CodeRepository },
        { provide: IndicationsICD10CodeRepository, useValue: mockIndicationsICD10CodeRepository },
      ],
    }).compile();

    service = module.get<ScrapingService>(ScrapingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extractAndMapIndications', () => {
    it('should return existing indications if already present in database', async () => {
      const drugName = 'Aspirin';
      const mockIndications = [{ id: '1', name: 'Pain relief', drugId: '123' }];

      mockIndicationsRepository.findByDrugName.mockResolvedValue(mockIndications);

      const result = await service.extractAndMapIndications(drugName);

      expect(result).toEqual(mockIndications);
      expect(mockIndicationsRepository.findByDrugName).toHaveBeenCalledWith(drugName);
      expect(mockScrapingAdapter.extractIndicationsFromSetId).not.toHaveBeenCalled();
    });

    it('should scrape and map new indications if not present in database', async () => {
      const drugName = 'Aspirin';
      mockIndicationsRepository.findByDrugName.mockResolvedValue([]);
      const scrapedIndications = ['Pain relief', 'Fever reduction'];
      mockScrapingAdapter.extractIndicationsFromSetId.mockResolvedValue(scrapedIndications);
      const mappedIndications = [
        { indication: 'Pain relief', icd10: ['M54.5'] },
        { indication: 'Fever reduction', icd10: ['R50.9'] },
      ];
      mockAIMappingService.mapIndicationsToICD10.mockResolvedValue(mappedIndications);
      const drug = { id: '123', name: drugName };
      mockDrugsRepository.findByNameOrCreate.mockResolvedValue(drug);
      const createdIndications = [
        { id: '1', name: 'Pain relief', drugId: '123' },
        { id: '2', name: 'Fever reduction', drugId: '123' },
      ];
      mockIndicationsRepository.findOrCreateAllByNames.mockResolvedValue(createdIndications);
      mockICD10CodeRepository.findOrCreateAllByCodes.mockResolvedValue([
        { id: '1', code: 'M54.5' },
        { id: '2', code: 'R50.9' },
      ]);
      mockIndicationsICD10CodeRepository.bulkSave.mockResolvedValue([]);

      const result = await service.extractAndMapIndications(drugName);

      expect(result).toEqual(createdIndications);
      expect(mockScrapingAdapter.extractIndicationsFromSetId).toHaveBeenCalledWith(drugName);
      expect(mockAIMappingService.mapIndicationsToICD10).toHaveBeenCalledWith(scrapedIndications);
      expect(mockDrugsRepository.findByNameOrCreate).toHaveBeenCalledWith(drugName);
      expect(mockIndicationsRepository.findOrCreateAllByNames).toHaveBeenCalledWith(scrapedIndications, '123');
    });

    it('should throw an error if scraping fails', async () => {
      const drugName = 'Aspirin';
      mockIndicationsRepository.findByDrugName.mockResolvedValue([]);
      const scrapingError = new Error('Scraping failed');
      mockScrapingAdapter.extractIndicationsFromSetId.mockRejectedValue(scrapingError);

      await expect(service.extractAndMapIndications(drugName)).rejects.toThrow('Scraping failed');

      expect(mockScrapingAdapter.extractIndicationsFromSetId).toHaveBeenCalledWith(drugName);
    });
  });

  describe('createAndRelateIndicationsAndICD10Code', () => {
    it('should persist ICD10 associations and return indications', async () => {
      const mappedIndications = [
        { indication: 'Pain relief', icd10: ['M54.5', 'R52'] },
        { indication: 'Fever reduction', icd10: ['R50.9'] },
      ];

      const drug = {
        id: '123',
        name: 'Aspirin',
        indications: [
          {
            id: "312",
            name: "Fever",
            drugId: "123",
            drug: { id: '123', name: 'Aspirin', indications: [] },
            indicationICD10Codes: [],
          },
        ],
      };

      const persistedIndications = [
        { id: 'ind-1', name: 'Pain relief', drugId: '123' },
        { id: 'ind-2', name: 'Fever reduction', drugId: '123' },
      ];
      mockIndicationsRepository.findOrCreateAllByNames.mockResolvedValue(persistedIndications);
      mockICD10CodeRepository.findOrCreateAllByCodes.mockResolvedValue([
        { id: 'icd-1', code: 'M54.5' },
        { id: 'icd-2', code: 'R52' },
        { id: 'icd-3', code: 'R50.9' },
      ]);
      mockIndicationsICD10CodeRepository.bulkSave.mockResolvedValue([]);

      const result = await service.createAndRelateIndicationsAndICD10Code(mappedIndications, drug);

      expect(mockIndicationsRepository.findOrCreateAllByNames).toHaveBeenCalledWith(['Pain relief', 'Fever reduction'], drug.id);
      expect(mockICD10CodeRepository.findOrCreateAllByCodes).toHaveBeenCalledWith(['M54.5', 'R52', 'R50.9']);
      expect(mockIndicationsICD10CodeRepository.bulkSave).toHaveBeenCalledWith([
        { indicationId: 'ind-1', icd10CodeId: 'icd-1' },
        { indicationId: 'ind-1', icd10CodeId: 'icd-2' },
        { indicationId: 'ind-2', icd10CodeId: 'icd-3' },
      ]);
      expect(result).toEqual(persistedIndications);
    });
  });
});
