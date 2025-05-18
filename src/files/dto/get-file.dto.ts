import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const getFileSchema = z.object({
  password: z
    .string()
    .max(255)
    .optional()
    .transform((val) => val ?? ''),
});

export class GetFileDto extends createZodDto(getFileSchema) {}
