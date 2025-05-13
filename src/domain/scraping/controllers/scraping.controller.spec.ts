import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../../../guards/auth.guard';
import { AuthService } from '../../auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import { ScrapingController } from '../../scraping/controllers/scraping.controller';
import { ScrapingService } from '../../scraping/services/scraping.service';

describe('ScrapingController', () => {
  let controller: ScrapingController;
  let scrapingService: ScrapingService;
  let authService: AuthService;

  const mockAuthService = {
    validateToken: jest.fn(),
  };

  const mockJwtService = {
    verify: jest.fn(),
    sign: jest.fn(),
  };

  const mockScrapingService = {
    extractAndMapIndications: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrapingController],
      providers: [
        {
          provide: ScrapingService,
          useValue: mockScrapingService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: AuthGuard,
          useValue: mockAuthGuard,
        },
      ],
    }).compile();

    controller = module.get<ScrapingController>(ScrapingController);
    scrapingService = module.get<ScrapingService>(ScrapingService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('scrapeIndications', () => {
    it('should call scrapingService.extractAndMapIndications and return expected value', async () => {
      const drugName = 'Dupixent';
      const expectedResult = [{ indication: 'Fever', icd10: ['A01'] }];

      mockScrapingService.extractAndMapIndications.mockResolvedValue(expectedResult);

      const result = await controller.scrapeIndications(drugName);

      expect(mockScrapingService.extractAndMapIndications).toHaveBeenCalledWith(drugName);
      expect(result).toEqual(expectedResult);
    });

    it('should throw HttpException if scrapingService throws an error', async () => {
      const drugName = 'Dupixent';

      mockScrapingService.extractAndMapIndications.mockRejectedValue(new HttpException('Error', 500));

      await expect(controller.scrapeIndications(drugName))
        .rejects
        .toThrow(HttpException);
    });

    it('should handle empty response from scrapingService gracefully', async () => {
      const drugName = 'Dupixent';

      mockScrapingService.extractAndMapIndications.mockResolvedValue([]);

      const result = await controller.scrapeIndications(drugName);

      expect(mockScrapingService.extractAndMapIndications).toHaveBeenCalledWith(drugName);
      expect(result).toEqual([]);
    });
  });
});
