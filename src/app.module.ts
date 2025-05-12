import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultSourceConfig } from './config/data-source';
import { AuthModule } from './domain/auth/auth.module';
import { IndicationsModule } from './domain/indications/indications.module';
import { IndicationModel } from './infrastructure/models/indication.model';
import { DrugModel } from './infrastructure/models/drug.model';
import { ICD10CodeModel } from './infrastructure/models/icd10code.model';
import { IndicationICD10CodeModel } from './infrastructure/models/indication_icd10code.model';
import { IndicationsRepository } from './infrastructure/repositories/indications.repository';
import { DrugsRepository } from './infrastructure/repositories/drugs.repository';
import { ICD10CodeRepository } from './infrastructure/repositories/icd10code.repository';
import { IndicationsICD10CodeRepository } from './infrastructure/repositories/indications_icd10code.repository';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AIMappingModule } from './domain/AIMapping/AIMapping.module';
import { UsersModule } from './domain/users/users.module';
import { UsersController } from './domain/users/controllers/users.controller';
import { UsersService } from './domain/users/services/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(DefaultSourceConfig),
    TypeOrmModule.forFeature([
      IndicationModel,
      DrugModel,
      ICD10CodeModel,
      IndicationICD10CodeModel,
    ]),
    // Importando os módulos separados
    AuthModule,
    IndicationsModule,
    AIMappingModule,
    UsersModule,
  ],
  controllers: [AppController, UsersController],
  providers: [
    AppService,
    IndicationsRepository,
    DrugsRepository,
    ICD10CodeRepository,
    IndicationsICD10CodeRepository,
    UsersService,
  ],
})
export class AppModule {}
