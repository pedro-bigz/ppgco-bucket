import { SequelizeModuleOptions } from '@nestjs/sequelize';
import {
  DatabaseConfig,
  DBEnvType,
  databaseEnvironments,
} from './DatabaseConfig';

type Dialect =
  | 'mysql'
  | 'postgres'
  | 'sqlite'
  | 'mariadb'
  | 'mssql'
  | 'db2'
  | 'snowflake'
  | 'oracle';

export const defaultSequelizeOptions = {
  dialect: process.env.DB_CONNECTION as Dialect,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

export class SequelizeConfig extends DatabaseConfig<SequelizeModuleOptions> {
  constructor(env: DBEnvType) {
    super(env);
  }

  static configure(customData?: Record<string, any>): SequelizeModuleOptions {
    return new SequelizeConfig(process.env)
      .ensureValues(databaseEnvironments)
      .getConfigData(customData);
  }

  public getConfigData(
    customData?: Record<string, any>,
  ): SequelizeModuleOptions {
    return {
      dialect: this.getValue('DB_CONNECTION') as Dialect,

      host: this.getValue('DB_HOST'),
      port: parseInt(this.getValue('DB_PORT') || '5432'),
      username: this.getValue('DB_USERNAME'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_DATABASE'),

      ssl: this.isProduction(),
      ...customData,
    };
  }
}
