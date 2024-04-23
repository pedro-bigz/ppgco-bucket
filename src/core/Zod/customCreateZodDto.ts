import { ZodSchema } from 'zod';
import { createZodDto, ZodDto } from 'nestjs-zod';

export function customCreateZodDto(schema: ZodSchema) {
  class CustomAugmentedZodDto extends createZodDto(schema) {
    constructor(obj: any) {
      super();
      Object.assign(this, obj);
    }
  }

  return CustomAugmentedZodDto as unknown as ZodDto;
}
