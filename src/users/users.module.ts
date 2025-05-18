import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { User } from './entities/user.entity';
import { userProviders } from './users.providers';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [UsersService, ...userProviders],
  exports: [UsersService],
})
export class UserModule {}
