import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ScrapingService {
  private readonly drugIdURL = process.env.DRUG_ID_URL || '';
  private readonly drugIndicationsURL = process.env.DRUG_INDICATIONS_URL || '';
  constructor() {}

  async extractIndicationsFromSetId(name: string): Promise<string[]> {
    try {
      const drugId = await this.getDrugId(name);
      const url = `${this.drugIndicationsURL}?setid=${drugId}`;
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

  async getDrugId(drugName: string): Promise<string> {
    try {
      const { data } = await axios.get(this.drugIdURL, {
        params: { drug_name: drugName },
      });

      const drugId = data.data[0].setid;
      if (!drugId) throw new NotFoundException(`ID not found for ${drugName}`);

      return drugId;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  
}
