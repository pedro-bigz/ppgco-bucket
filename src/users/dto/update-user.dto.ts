import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const updateUserSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  password: z.string(),
});

// export type UpdateUserDto = Partial<z.infer<typeof updateUserSchema>>;

export class UpdateUserDto {
  @ApiProperty()
  first_name?: string;

  @ApiProperty()
  last_name?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  password?: string;
}
