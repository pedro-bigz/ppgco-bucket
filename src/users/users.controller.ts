import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UserController {
  public constructor(private readonly usersService: UsersService) {}

  @Get()
  public findAll() {
    return this.usersService.findAll();
  }
}
