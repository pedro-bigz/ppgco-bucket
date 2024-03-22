import { UsePipes, applyDecorators } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { ZodValidationPipe } from './ZodValidation.pipe';

export function UseZodValidation(schema: ZodSchema<any>) {
  return applyDecorators(UsePipes(new ZodValidationPipe(schema)));
}
