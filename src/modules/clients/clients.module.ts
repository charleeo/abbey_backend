import { IsAdminMiddleware } from 'src/middleware/is-admin/is-admin.middleware';
import { IsNotAdminMiddleware } from 'src/middleware/is-not-admin/is-not-admin.middleware';
import { KYCInputVaidtion } from 'src/middleware/kyc/kyc.input.validation.middleware';
import { KycMustExistsMiddleware } from 'src/middleware/loan/kyc-must-exists/kyc-must-exists.middleware';
import { MustVerifyKycMiddleware } from 'src/middleware/loan/must-verify-kyc/must-verify-kyc.middleware';
import { PreventDupplicatesMiddleware } from 'src/middleware/loan/prevent-dupplicates/prevent-dupplicates.middleware';

import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { LoanRepaymentDurationCategoryRepository } from '../config/repository/loan.repayment.duration.category.repository';
import { LoanTypeRepository } from '../config/repository/loan.type.repository';
import { ConfigHelperService } from '../config/services/helpers.config';
import { ConfigMiddlewareHelperService } from '../config/services/helpers.middleware.config';
import { Users } from '../user/entities/user.entity';
import { KycController } from './kyc/kyc.controller';
import { KycService } from './kyc/kyc.service';
import { KYCRepository } from './kyc/repositories/kyc.repository';
import { ValidateField } from './kyc/Validations/ValidateField';
import { ValidateKYCId } from './kyc/Validations/ValidateKYCId';
import { LoanDataController } from './loans/controllers/loan-data/loan-data.controller';
import { LoanSettingController } from './loans/controllers/loan-setting.controller';
import { LoansController } from './loans/controllers/loans.controller';
import { RepaymentController } from './loans/controllers/repayment/repayment.controller';
import { LoanRepaymentRepository } from './loans/repositories/loan.repayment.repository';
import { LoanRepository } from './loans/repositories/loan.repository';
import { LoanSettingRepository } from './loans/repositories/loan.setting.repository';
import { ApplicationService } from './loans/services/application/application.service';
import { LoanDataService } from './loans/services/loan-data/loan-data.service';
import { LoanSettingService } from './loans/services/loan.settings.service';
import { RepaymentService } from './loans/services/repayment/repayment.service';

@Module({
  controllers: [
    KycController,
    LoansController,
    LoanSettingController,
    RepaymentController,
    LoanDataController
  ],
  providers: [
    LoanSettingService,
    KycService,
    KYCRepository,
    Users,
    ValidateField,
    ValidateKYCId,
    LoanRepository,
    LoanSettingRepository,
    LoanRepaymentDurationCategoryRepository,
    ConfigHelperService,
    ConfigMiddlewareHelperService,
    RepaymentService,
    ApplicationService,
    LoanRepaymentRepository,
    LoanTypeRepository,
    LoanDataService
  ],
  imports: [],
  exports: [LoanSettingRepository, LoanTypeRepository]
})
export class ClientsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsNotAdminMiddleware, KYCInputVaidtion)
      .forRoutes({ path: '/kyc/create', method: RequestMethod.POST });

    consumer
      .apply(
        IsNotAdminMiddleware,
        KycMustExistsMiddleware,
        MustVerifyKycMiddleware
      )
      .forRoutes(
        { path: 'loan-setting', method: RequestMethod.POST },
        { path: 'loans/apply', method: RequestMethod.POST }
      );

    consumer
      .apply(PreventDupplicatesMiddleware)
      .forRoutes({ path: 'loans/apply', method: RequestMethod.POST });

    consumer
      .apply(IsAdminMiddleware)
      .forRoutes(
        { path: '/kyc/update/status', method: RequestMethod.POST },
        { path: '/loans/approve', method: RequestMethod.POST }
      );
  }
}
