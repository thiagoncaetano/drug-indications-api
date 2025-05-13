import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ScrapingAdapter {
  private readonly drugIndicationsURL = process.env.DRUG_INDICATIONS_URL || '';

  async extractIndicationsFromSetId(name: string): Promise<string[]> {
    try {
      const url = `${this.drugIndicationsURL}?query=${name}`;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const indications: string[] = [];

      const indicationsSection = $('div.Section[data-sectioncode="34067-9"]');

      indicationsSection.find('div.Section[data-sectioncode="42229-5"]').each((_, section) => {
        const title = $(section).find('h2').first().text().trim();
        if (title) indications.push(title.replace(/^\d+\.\d+\s*/, ''))
      });

      return indications;

    } catch (error) {
       throw new HttpException(error.message, error.status);
    }
  }  
}
