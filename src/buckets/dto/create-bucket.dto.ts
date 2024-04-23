import { z } from 'zod';
import { customCreateZodDto } from 'src/core';

export const createBucketsSchema = z.object({
  name: z.string().max(255),
  description: z.string().max(1024).optional(),
  isPrivate: z.boolean().optional().transform(Boolean),
  active: z.boolean().optional().transform(Boolean),
});

export class CreateBucketsDto extends customCreateZodDto(createBucketsSchema) {}
