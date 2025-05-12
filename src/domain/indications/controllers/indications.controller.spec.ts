import { Test, TestingModule } from '@nestjs/testing';
import { IndicationsController } from './indications.controller';

describe('IndicationsController', () => {
  let controller: IndicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndicationsController],
    }).compile();

    controller = module.get<IndicationsController>(IndicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
