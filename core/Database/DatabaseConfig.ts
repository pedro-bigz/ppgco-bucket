import { EnvHelper, EnvType } from 'core';

export type DBEnvType = EnvType;

export const databaseEnvironments = [
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
];

export abstract class DatabaseConfig<T> extends EnvHelper {
  constructor(env: DBEnvType) {
    super(env);
  }

  public abstract getConfigData(customData?: Record<string, any>): T;
}
