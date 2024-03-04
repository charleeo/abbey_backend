import { IsAdminMiddleware } from 'src/middleware/is-admin/is-admin.middleware';
import { IsNotAdminMiddleware } from 'src/middleware/is-not-admin/is-not-admin.middleware';
import { PreventDupplicatesMiddleware } from 'src/middleware/loan/prevent-dupplicates/prevent-dupplicates.middleware';

import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { LoanRepaymentDurationCategoryRepository } from '../config/repository/loan.repayment.duration.category.repository';
import { ConfigHelperService } from '../config/services/helpers.config';
import { ConfigMiddlewareHelperService } from '../config/services/helpers.middleware.config';
import { Users } from '../user/entities/user.entity';
import { LoanDataController } from './loans/controllers/loan-data/loan-data.controller';
import { LoansController } from './loans/controllers/loans.controller';
import { RepaymentController } from './loans/controllers/repayment/repayment.controller';
import { LoanRepaymentRepository } from './loans/repositories/loan.repayment.repository';
import { LoanRepository } from './loans/repositories/loan.repository';
import { ApplicationService } from './loans/services/application/application.service';
import { LoanDataService } from './loans/services/loan-data/loan-data.service';
import { RepaymentService } from './loans/services/repayment/repayment.service';
import { MortgageRepository } from '../config/repository/Mortgage.repository';
import { LoanRepaymentPlanRepository } from '../config/repository/LoanRepaymentPlan.repository';

@Module({
  controllers: [
    LoansController,
    RepaymentController,
    LoanDataController
  ],
  providers: [
    Users,
    LoanRepository,
    LoanRepaymentDurationCategoryRepository,
    ConfigHelperService,
    MortgageRepository,
    ConfigMiddlewareHelperService,
    RepaymentService,
    ApplicationService,
    LoanRepaymentRepository,
    LoanDataService,
    LoanRepaymentPlanRepository,
  ],
  imports: [],
  exports: []
})
export class ClientsModule {
  configure(consumer: MiddlewareConsumer) {
    
    consumer
      .apply(IsNotAdminMiddleware)
      .forRoutes(
        { path: 'loan-setting', method: RequestMethod.POST },
        { path: 'loans/apply', method: RequestMethod.POST }
      );

    consumer
      .apply(PreventDupplicatesMiddleware)
      .forRoutes({ path: 'loans/apply', method: RequestMethod.POST });

    // consumer
    //   .apply(IsAdminMiddleware)
    //   .forRoutes(
    //     { path: '/loans/approve', method: RequestMethod.POST }
    //   );
  }
}
