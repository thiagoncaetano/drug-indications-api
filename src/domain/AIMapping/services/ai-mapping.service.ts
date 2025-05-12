import { HttpException, Injectable } from '@nestjs/common';
import { AIAdapter } from '../../../infrastructure/adapters/ai/ai.adapter';
import { AGENT_PROMPT, MAPPING_PROMPT } from '../../../utils/constants';

export interface MappedIndication {
  indication: string;
  icd10: string[]
}

@Injectable()
export class AIMappingService {
  constructor(
    private readonly aiAdapter: AIAdapter
  ) {}

  async mapIndicationsToICD10(indications: string[]) {
    const prompt = MAPPING_PROMPT + " " + `${indications.join(', ')}`;
    const response = await this.aiAdapter.execute(prompt, AGENT_PROMPT);
    return this.processResponse(response);
  }

  private processResponse(response: any) {
    try {
      const content = response.content.trim();
      const parsedData: MappedIndication[] = JSON.parse(content.replace(/\\n/g, '').trim());

      return parsedData;
    } catch (error) {
      throw new HttpException('Error processing AI response', 500);
    }
  }
}
