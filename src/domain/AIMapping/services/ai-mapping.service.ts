import { HttpException, Injectable } from '@nestjs/common';
import { AIAdapter } from '../../../infrastructure/adapters/ai.adapter';
import { MAPPING_PROMPT } from '../../../utils/constants';

@Injectable()
export class AIMappingService {
  constructor(
    private readonly aiAdapter: AIAdapter
  ) {}

  async mapIndicationsToICD10(indications: string[]) {
    const prompt = MAPPING_PROMPT + " " + `${indications.join(', ')}`;
    const response = await this.aiAdapter.execute(prompt);
    return this.processResponse(response);
  }

  private processResponse(response: any) {
    try {
      const content = response.content.trim();
      const parsedData = JSON.parse(content.replace(/\\n/g, '').trim());

      return parsedData;
    } catch (error) {
      throw new HttpException('Error processing AI response', 500);
    }
  }
}
