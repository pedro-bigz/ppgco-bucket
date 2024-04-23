import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  DatabaseConfig,
  DBEnvType,
  databaseEnvironments,
} from './DatabaseConfig';

export class TypeOrmConfig extends DatabaseConfig<TypeOrmModuleOptions> {
  constructor(env: DBEnvType) {
    super(env);
  }

  static configure(customData?: Record<string, any>) {
    return new TypeOrmConfig(process.env)
      .ensureValues(databaseEnvironments)
      .getConfigData(customData);
  }

  public getConfigData(customData?: Record<string, any>): TypeOrmModuleOptions {
    return {
      type: this.getValue('DB_CONNECTION') as any,

      host: this.getValue('DB_HOST'),
      port: parseInt(this.getValue('DB_PORT') || '5432'),
      username: this.getValue('DB_USERNAME'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_DATABASE'),

      entities: ['**/*.entity{.ts,.js}'],

      ssl: this.isProduction(),
      ...customData,
    };
  }
}
