import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule, AuthService } from 'src/auth';
import { UserModule } from 'src/users';
import { FilesModule } from 'src/files';
import { BucketsModule } from 'src/buckets';
import { FilesystemService } from 'src/filesystem/filesystem.service';
import { FilesystemModule } from 'src/filesystem/filesystem.module';
import { ApiKeyModule } from 'src/api-key/api-key.module';
import { DatabaseModule } from 'src/database';
import { JwtModule } from 'src/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule,
    DatabaseModule,
    ApiKeyModule,
    AuthModule,
    UserModule,
    FilesModule,
    BucketsModule,
    FilesystemModule,
  ],
  providers: [AuthService, FilesystemService, Logger],
})
export class AppModule {}
