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
console.log("Entidades registradas: ", datasource.entityMetadatas);
datasource.initialize();
export default datasource;