import { z } from 'zod';
import { customCreateZodDto } from 'core';

export const createBucketsSchema = z.object({
  name: z.string().max(255),
  description: z.string().max(1024).optional(),
  is_private: z.boolean().optional().transform(Boolean),
  active: z.boolean().optional().transform(Boolean),
});

export class CreateBucketsDto extends customCreateZodDto(createBucketsSchema) {}
