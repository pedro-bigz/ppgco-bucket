import { Request } from 'express';
import { ApiKeyId, ApiSecretKey, ApiTimestamp } from './entities';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class ApiHeadersService {
  private readonly keyId?: ApiKeyId;
  private readonly secretKey?: ApiSecretKey;
  private readonly timestamp?: ApiTimestamp;

  constructor(@Inject(REQUEST) private readonly request: Request) {
    this.keyId = ApiKeyId.fromRequest(request);
    this.secretKey = ApiSecretKey.fromRequest(request);
    this.timestamp = ApiTimestamp.fromRequest(request);
  }

  public static fromRequest(request: Request) {
    if (!request) return undefined;
    return new ApiHeadersService(request);
  }

  public hasValidHeaders(): boolean {
    return !!this.keyId && !!this.secretKey && !!this.timestamp;
  }

  public isTimestampValid(): boolean {
    if (!this.timestamp) return false;

    return this.timestamp.isValid(Math.floor(Date.now() / 1000));
  }

  public getKeyId(): string | undefined {
    return this.keyId?.toString();
  }

  public getSecretKey(): string | undefined {
    return this.secretKey?.toString();
  }

  public getTimestamp(): string | undefined {
    return this.timestamp?.toString();
  }
}
