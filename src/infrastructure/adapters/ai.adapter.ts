import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { AI_MAX_TOKENS, AI_TEMPERATURE } from '../../utils/constants';

@Injectable()
export class AIAdapter {
  private readonly AI_API_URL: string;
  private readonly AI_API_KEY: string;
  private readonly AI_API_MODEL: string;

  constructor() {
    this.AI_API_URL = process.env.AI_API_URL || '';
    this.AI_API_KEY = process.env.AI_API_KEY || '';
    this.AI_API_MODEL = process.env.AI_API_MODEL || '';
  }

  async execute(prompt: string) {
    try {
      const response = await axios.post(
        this.AI_API_URL,
        {
          model: this.AI_API_MODEL,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: AI_MAX_TOKENS,
          temperature: AI_TEMPERATURE,
        },
        {
          headers: {
            "Authorization": `Bearer ${this.AI_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      return response.data.choices[0].message;
    } catch (error) {
      throw new HttpException(error.message ? error.message : "Request error", error.status);
    }
  }
}
