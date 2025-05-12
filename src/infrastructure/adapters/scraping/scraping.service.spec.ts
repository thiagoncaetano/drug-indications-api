import { Test, TestingModule } from '@nestjs/testing';
import { ScrapingAdapter } from './scraping.service';

describe('ScrapingAdapter', () => {
  let service: ScrapingAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrapingAdapter],
    }).compile();

    service = module.get<ScrapingAdapter>(ScrapingAdapter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
