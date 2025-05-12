import { DataSource } from "typeorm";
import { DefaultSourceConfig } from "./data-source";

const datasource = new DataSource({
  ...DefaultSourceConfig,
  migrations: ['migrations/*.ts']
});
datasource.initialize();
export default datasource;