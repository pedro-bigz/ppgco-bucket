import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dialect } from 'sequelize';
import { isProduction } from 'src/utils';
import { DB } from './database.constants';
import { entities } from './database.entities';

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get<Dialect>(DB.CONNECTION),
        host: configService.get<string>(DB.HOST),
        port: configService.get<number>(DB.PORT),
        username: configService.get<string>(DB.USERNAME),
        password: configService.get<string>(DB.PASSWORD),
        database: configService.get<string>(DB.DATABASE),
        autoLoadModels: true,
        synchronize: false,
        ssl: isProduction(),
        models: [...entities.tables, ...entities.views],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
