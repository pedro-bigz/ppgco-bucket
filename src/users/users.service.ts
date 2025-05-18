import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import _uniqueId from 'lodash/uniqueId';

import { generateToken } from 'src/utils';
import { USER_REPOSITORY } from './users.constants';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  public constructor(
    @Inject(USER_REPOSITORY)
    private readonly userModel: typeof User,
  ) {}

  public findAll(): Promise<User[]> {
    return this.userModel.findAll<User>();
  }

  public findOne(accessKeyId: string): Promise<User | null> {
    return this.userModel.findOne({ where: { accessKeyId } });
  }
}
