import { UniqueEmailValidator } from 'src/config/pipes/unique.user.validator';
import { UserIdExistValidator } from 'src/config/pipes/use.id.exists.validator';

import { Module } from '@nestjs/common';

import { UpdateUserService } from './services/update.service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UniqueEmailValidator,
    UserIdExistValidator,
    UpdateUserService,
  ],
  exports: [UserService],
})
export class UserModule {}
