import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const loginSchema = z.object({
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
});

export class LoginDto {
  @ApiProperty({ required: false })
  accessKeyId: string;

  @ApiProperty({ required: false })
  secretAccessKey: string;
}
