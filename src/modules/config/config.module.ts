import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';

import { ConfigController } from './config.controller';
import { ActionRepository } from './repository/actions.repository';
import { RoleRepository } from './repository/roles.repository';
import { DutyRepository } from './repository/duties.repository';
import { UserRoleRepository } from './repository/user_roles.repository';
import { AuthMiddleware } from 'src/middleware/auth/auth.middleware';
import { LocationRepository } from './repository/locations.repository';

import { UserRepository } from '../user/user.repository';
import { LoanRepaymentDurationCategoryRepository } from './repository/loan.repayment.duration.category.repository';
import { ConfigService } from './services/config.service';
import { LoanTypeRepository } from './repository/loan.type.repository';

@Module({
  providers: [
    ActionRepository,
    RoleRepository,
    DutyRepository,
    UserRoleRepository,
    LocationRepository,
    UserRepository,
    LoanRepaymentDurationCategoryRepository,
    ConfigService,
    LoanTypeRepository,
  ],
  controllers: [ConfigController],
  exports: [
    RoleRepository,
    ActionRepository,
    DutyRepository,
    UserRoleRepository,
    LocationRepository,
    LoanRepaymentDurationCategoryRepository,
    ConfigService,
  ],
})
export class ConfigModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)

      .forRoutes
      // ConfigController
      ();
  }
}
