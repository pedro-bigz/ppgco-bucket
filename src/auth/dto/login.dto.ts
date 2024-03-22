import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export class LoginDto {
  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false })
  password: string;
}
