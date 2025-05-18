import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createBucketsSchema = z.object({
  name: z.string().max(255),
  description: z.string().max(1024).optional(),
  isPrivate: z.boolean().optional().transform(Boolean),
  active: z.boolean().optional().default(true).transform(Boolean),
});

export class CreateBucketsDto extends createZodDto(createBucketsSchema) {}
