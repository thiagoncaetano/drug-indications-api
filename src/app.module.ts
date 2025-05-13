import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultSourceConfig } from './config/data-source';
import { AuthModule } from './domain/auth/auth.module';
import { IndicationsModule } from './domain/indications/indications.module';
import { AIMappingModule } from './domain/AIMapping/AIMapping.module';
import { UsersModule } from './domain/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapingModule } from './domain/scraping/scraping.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(DefaultSourceConfig),
    AuthModule,
    IndicationsModule,
    AIMappingModule,
    UsersModule,
    ScrapingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
