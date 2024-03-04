import {
  Module,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';

import { ConfigController } from './config.controller';
import { RoleRepository } from './repository/roles.repository';
import { AuthMiddleware } from 'src/middleware/auth/auth.middleware';

import { UserRepository } from '../user/user.repository';
import { LoanRepaymentDurationCategoryRepository } from './repository/loan.repayment.duration.category.repository';
import { ConfigService } from './services/config.service';
import { MortgageRepository } from './repository/Mortgage.repository';
import { LoanRepaymentPlanRepository } from './repository/LoanRepaymentPlan.repository';

@Module({
  providers: [
    RoleRepository,
    UserRepository,
    LoanRepaymentDurationCategoryRepository,
    MortgageRepository,
    ConfigService,
    LoanRepaymentPlanRepository,
  ],
  controllers: [ConfigController],
  exports: [
    RoleRepository,
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
