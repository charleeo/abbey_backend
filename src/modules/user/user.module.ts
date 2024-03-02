import { UniqueEmailValidator } from 'src/config/pipes/unique.user.validator';
import { UserIdExistValidator } from 'src/config/pipes/use.id.exists.validator';

import { Module } from '@nestjs/common';

import { ActionRepository } from '../config/repository/actions.repository';
import { UserRoleRepository } from '../config/repository/user_roles.repository';
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
    UserRoleRepository,
    ActionRepository,
    UniqueEmailValidator,
    UserIdExistValidator,
    UpdateUserService,
  ],
  exports: [UserService],
})
export class UserModule {}
