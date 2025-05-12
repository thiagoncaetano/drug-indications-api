import { Test, TestingModule } from '@nestjs/testing';
import { AiMappingService } from './ai-mapping.service';


describe('AiMappingService', () => {
  let service: AiMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiMappingService],
    }).compile();

    service = module.get<AiMappingService>(AiMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
