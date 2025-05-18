import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ApiKeyService } from 'src/api-key';
import { UsersService } from 'src/users';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly apiKeyService: ApiKeyService,
  ) {}

  public async getCurrentUser() {
    const apiKey = this.apiKeyService.keyId;
    const user = await this.usersService.findOne(apiKey);

    if (!user) {
      throw new UnauthorizedException('Invalid API key');
    }

    return user;
  }

  public hasValidHeaders() {
    return this.apiKeyService.hasValidHeaders();
  }

  public isTimestampValid() {
    return this.apiKeyService.isTimestampValid();
  }

  public validateSignature(storedSecretKey: string) {
    return this.apiKeyService.validateSignature(storedSecretKey);
  }
}
