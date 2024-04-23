import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';
import { SequelizeConfig } from 'src/core';
import { AuthController, AuthModule, AuthService } from './auth';
import { User, UserModule } from './user';
import { CrudGeneratorModule } from './crud-generator';
import { FilesModule, File } from './files';
import { BucketsModule, Bucket } from './buckets';
import { FilesystemService } from './filesystem/filesystem.service';
import { FilesystemModule } from './filesystem/filesystem.module';
// {IMPORTS} Don't delete me, I'm used for automatic code generation

const orm = {
  tables: [
    User,
    File,
    Bucket,
    // {MODELS} Don't delete me, I'm used for automatic code generation
  ],
  views: [],
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot(
      SequelizeConfig.configure({
        models: [...orm.tables, ...orm.views],
        // models: [__dirname + '/**/entities/*.entity.ts'],
      }),
    ),
    JwtModule.register({
      global: true,
      secret: env.JWT_SECRET_KEY,
    }),
    AuthModule,
    UserModule,
    CrudGeneratorModule,
    FilesModule,
    BucketsModule,
    FilesystemModule,
    // {MODULE} Don't delete me, I'm used for automatic code generation
  ],
  controllers: [AuthController],
  providers: [AuthService, FilesystemService],
})
export class AppModule {}
