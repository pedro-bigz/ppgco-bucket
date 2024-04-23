import { customCreateZodDto } from 'src/core';
import { z } from 'zod';

export const getFileSchema = z.object({
  password: z
    .string()
    .max(255)
    .optional()
    .transform((val) => val ?? ''),
});

export class GetFileDto extends customCreateZodDto(getFileSchema) {}
