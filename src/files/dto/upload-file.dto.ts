import { customCreateZodDto } from 'core/Zod/customCreateZodDto';
import { z } from 'zod';

export const uploadFileSchema = z.object({
  description: z.string().max(1024).optional(),
  name: z.string().max(255).optional(),
});

export class UploadFileDto extends customCreateZodDto(uploadFileSchema) {}
