import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const updateBucketsSchema = z.object({
  name: z.string().max(255),
  description: z.string().max(1024).optional(),
  isPrivate: z.boolean().optional().transform(Boolean),
  active: z.boolean().optional().transform(Boolean),
});

export class UpdateBucketsDto extends createZodDto(updateBucketsSchema) {}
