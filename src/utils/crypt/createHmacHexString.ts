import crypto from 'node:crypto';

export function createHmacHexString(secret: string, data: string) {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}
