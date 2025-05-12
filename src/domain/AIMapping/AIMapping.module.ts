import { Module } from '@nestjs/common';
import { AIMappingService } from './services/ai-mapping.service';
import { AIAdapter } from '../../infrastructure/adapters/ai/ai.adapter';

@Module({
  providers: [AIMappingService, AIAdapter],
})
export class AIMappingModule {}
