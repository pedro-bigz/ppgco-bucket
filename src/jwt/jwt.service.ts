import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtVerifyOptions, JwtService as NestJwtService } from '@nestjs/jwt';
import { JWT } from './jwt.constants';
import { TokenType } from './jwt.types';

@Injectable()
export class JwtService {
  public constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  get expiration() {
    return {
      access: this.configService.get<string>(JWT.EXPIRATION),
      refresh: this.configService.get<string>(JWT.REFRESH_EXPIRATION),
    };
  }

  get secretKeys() {
    return {
      access: this.configService.get<string>(JWT.SECRET_KEY),
      refresh: this.configService.get<string>(JWT.REFRESH_SECRET_KEY),
    };
  }

  get jwtRefreshSecretKey() {
    return this.configService.get<string>(JWT.REFRESH_SECRET_KEY);
  }

  public async generateToken(payload: TokenType) {
    return this.nestJwtService.signAsync(payload, {
      expiresIn: this.expiration.access,
      secret: this.secretKeys.access,
    });
  }

  public async generateRefreshToken(payload: TokenType) {
    return this.nestJwtService.signAsync(payload, {
      expiresIn: this.expiration.refresh,
      secret: this.secretKeys.refresh,
    });
  }

  public async decodeToken<T extends object = TokenType>(token: string) {
    return this.nestJwtService.verifyAsync<T>(token, {
      secret: this.secretKeys.access,
    });
  }

  public async decodeRefreshToken<T extends object = TokenType>(token: string) {
    return this.nestJwtService.verifyAsync<T>(token, {
      secret: this.secretKeys.refresh,
    });
  }

  public async verify(token: string, options?: JwtVerifyOptions) {
    return this.nestJwtService.verify(token, options);
  }
}
