import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { USER_REPOSITORY } from './user.constants';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  public constructor(
    @Inject(USER_REPOSITORY)
    private readonly userModel: typeof User,
  ) {}

  public async create({ email, password, ...createUserDto }: CreateUserDto) {
    if (await this.findByEmail(email)) {
      throw new UnauthorizedException('This email has already been registered');
    }

    return this.userModel.create({
      ...createUserDto,
      activated: 0,
      forbidden: 0,
      email,
      password: bcrypt.hashSync(password, 10),
    });
  }

  public findAll(): Promise<User[]> {
    return this.userModel.findAll<User>();
  }

  public findOne(id: number): Promise<User | null> {
    return this.userModel.findOne({ where: { id } });
  }

  public findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.update(updateUserDto, { where: { id } });
  }

  public remove(id: number) {
    return this.userModel.destroy({ where: { id } });
  }
}
