import { ZodValidationPipe } from './ZodValidation.pipe';
import { ZodSchema } from 'zod';

export function ZodValidationFactory(zodSchema: ZodSchema<any>) {
  return new ZodValidationPipe(zodSchema);
}
