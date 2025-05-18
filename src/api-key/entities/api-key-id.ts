import { Request } from 'express';

export class ApiKeyId {
  constructor(private readonly value: string) {}

  static fromRequest(request: Request): ApiKeyId | undefined {
    const keyId = request.headers['x-api-key-id'] as string | undefined;

    if (!keyId) {
      return undefined;
    }

    return new ApiKeyId(keyId);
  }

  toString(): string {
    return this.value;
  }

  isValid(): boolean {
    return Boolean(this.value);
  }
}
