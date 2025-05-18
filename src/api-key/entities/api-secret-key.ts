import { Request } from 'express';

export class ApiSecretKey {
  constructor(private readonly value: string) {}

  static fromRequest(request: Request): ApiSecretKey | undefined {
    const secretKey = request.headers['x-api-secret-key'] as string | undefined;

    if (!secretKey) {
      return undefined;
    }

    return new ApiSecretKey(secretKey);
  }

  toString(): string {
    return this.value;
  }

  isValid(): boolean {
    return Boolean(this.value);
  }
}
