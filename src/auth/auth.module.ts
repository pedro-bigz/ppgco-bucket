import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserModule } from 'src/users/users.module';
import { authProviders } from './auth.providers';
import { ApiKeyModule } from 'src/api-key/api-key.module';

@Module({
  imports: [UserModule, ApiKeyModule],
  providers: [AuthService, ...authProviders],
})
export class AuthModule {}
