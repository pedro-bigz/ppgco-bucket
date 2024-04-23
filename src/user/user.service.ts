import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import _uniqueId from 'lodash/uniqueId';

import { generateToken } from 'src/utils';
import { USER_REPOSITORY } from './user.constants';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  public constructor(
    @Inject(USER_REPOSITORY)
    private readonly userModel: typeof User,
    private readonly configService: ConfigService,
  ) {}

  public async create({ email }: CreateUserDto) {
    const secretKey = this.configService.get<string>('SECRET_PASSPHRASE_KEY');

    const accessKeyId = generateToken(secretKey, email);
    const password = generateToken(secretKey, email, _uniqueId(), Date.now());

    if (await this.findByAccessKeyID(accessKeyId)) {
      throw new UnauthorizedException('This email has already been registered');
    }

    await this.userModel.create({
      activated: 1,
      forbidden: 0,
      accessKeyId,
      secretAccessKey: bcrypt.hashSync(password, 10),
    });

    return { accessKeyId, secretAccessKey: password };
  }

  public findAll(): Promise<User[]> {
    return this.userModel.findAll<User>();
  }

  public findOne(id: number): Promise<User | null> {
    return this.userModel.findOne({ where: { id } });
  }

  public findByAccessKeyID(accessKeyId: string): Promise<User | null> {
    return this.userModel.findOne({ where: { accessKeyId } });
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.update(updateUserDto, { where: { id } });
  }

  public remove(id: number) {
    return this.userModel.destroy({ where: { id } });
  }
}
