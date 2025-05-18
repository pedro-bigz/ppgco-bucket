import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { createHmacHexString, HexString } from 'src/utils';
import { ApiKeyFormatter } from './api-key.formatter';
import { ApiHeadersService } from './api-headers.service';

@Injectable({ scope: Scope.REQUEST })
export class ApiKeyService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly formatter: ApiKeyFormatter,
    private readonly headers: ApiHeadersService,
  ) {}

  public get keyId(): string | undefined {
    return this.headers.getKeyId();
  }

  public get secretKey(): string | undefined {
    return this.headers.getSecretKey();
  }

  public get timestamp(): string | undefined {
    return this.headers.getTimestamp();
  }

  public hasValidHeaders() {
    return this.headers.hasValidHeaders();
  }

  public isTimestampValid() {
    return this.headers.isTimestampValid();
  }

  public createRequestSignatureBaseString(): string {
    const method = this.request.method.toUpperCase();
    const bodyString = this.formatter.formatBody();
    const slashedPath = this.formatter.formatPath();

    // console.log({
    //   timestamp: this.headers.getTimestamp(),
    //   method,
    //   slashedPath,
    //   bodyString,
    // });

    return this.headers.getTimestamp() + method + slashedPath + bodyString;
  }

  public encryptRequest(secretKey: string) {
    return new HexString(
      createHmacHexString(secretKey, this.createRequestSignatureBaseString()),
    );
  }

  public validateSignature(storedSecretKey: string) {
    console.log({ storedSecretKey, secretKey: this.secretKey });
    const encrypted = this.encryptRequest(storedSecretKey);
    return encrypted.compare(this.secretKey);
  }
}
