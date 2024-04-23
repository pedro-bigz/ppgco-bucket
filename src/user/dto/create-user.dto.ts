import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string(),
});

export class CreateUserDto {
  @ApiProperty()
  email: string;
}
