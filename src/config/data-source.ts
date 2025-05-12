import "reflect-metadata";
import { DataSourceOptions } from "typeorm";

export const DataSourceProductionConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    __dirname + '/../infra/models/**/*.model{.ts,.js}'
  ],
  synchronize: false,
  dropSchema: false,
  migrationsRun: false,
  logging: true
};

export const DataSourceDevelopmentConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'mapmed',
  entities: [
    __dirname + '/../infra/models/**/*.model{.ts,.js}'
  ],
  synchronize: false,
  dropSchema: false,
  migrationsRun: false,
  logging: true,
};

export const DefaultSourceConfig = process.env.NODE_ENV === "production" ? DataSourceProductionConfig : DataSourceDevelopmentConfig;
