import { DataSource } from "typeorm";
import { DefaultSourceConfig } from "./data-source";

const datasource = new DataSource({
  ...DefaultSourceConfig,
    migrations: [
    process.env.NODE_ENV === 'production' 
      ? 'dist/migrations/*.js'
      : 'src/migrations/*.ts',
  ],
});
datasource.initialize();
export default datasource;