import { customCreateZodDto } from 'src/core';
import { z } from 'zod';

export const uploadFileSchema = z.object({
  filename: z.string().max(255).optional(),
  description: z.string().max(1024).optional(),
  password: z.string().max(255).optional(),
});

export class UploadFileDto extends customCreateZodDto(uploadFileSchema) {}
