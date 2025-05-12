import { Test, TestingModule } from '@nestjs/testing';
import { IndicationsService } from './indications.service';

describe('IndicationsService', () => {
  let service: IndicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndicationsService],
    }).compile();

    service = module.get<IndicationsService>(IndicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
