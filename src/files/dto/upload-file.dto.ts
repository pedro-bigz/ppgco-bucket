import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const uploadFileSchema = z.object({
  filename: z.string().max(255).optional(),
  originalname: z.string().max(1024).optional(),
  description: z.string().max(1024).optional(),
  password: z.string().max(255).optional(),
});

export class UploadFileDto extends createZodDto(uploadFileSchema) {}
