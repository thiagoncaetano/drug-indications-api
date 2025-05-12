import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultSourceConfig } from './config/data-source';
import { IndicationsController } from './domain/indications/controllers/indications.controller';
import { IndicationsService } from './domain/indications/services/indications.service';
import { ScrapingService } from './infrastructure/scraping/scraping.service';
import { AIAdapter } from './infrastructure/adapters/ai.adapter';
import { AIMappingService } from './domain/AIMapping/services/ai-mapping.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot(DefaultSourceConfig),
  ],
  controllers: [AppController, IndicationsController],
  providers: [AppService, IndicationsService, ScrapingService, AIAdapter, AIMappingService],
})
export class AppModule {}
