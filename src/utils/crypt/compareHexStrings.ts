import crypto from 'node:crypto';

export function compareHexStrings(a: string, b: string): boolean {
  return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
}
