import { Request } from 'express';

export class ApiTimestamp {
  constructor(private readonly value: string) {}

  static fromRequest(request: Request): ApiTimestamp | undefined {
    const timestamp = request.headers['x-api-timestamp'] as string | undefined;

    if (!timestamp) {
      return undefined;
    }

    return new ApiTimestamp(timestamp);
  }

  public toNumber(): number {
    return parseInt(this.value, 10);
  }

  public toString(): string {
    return String(this.toNumber());
  }

  public isValid(currentTime: number): boolean {
    const requestTime = this.toNumber();
    return !isNaN(requestTime) && Math.abs(currentTime - requestTime) <= 300;
  }
}
