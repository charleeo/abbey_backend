import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';

import { responseStructure } from 'src/common/helpers/response.structure';
import { KycService } from 'src/modules/clients/kyc/kyc.service';
import { LoanSettingService } from 'src/modules/clients/loans/services/loan.settings.service';
import { ConfigMiddlewareHelperService } from 'src/modules/config/services/helpers.middleware.config';

@Injectable()
export class LoanConfigMustBeSetMiddleware implements NestMiddleware {
  constructor(
    private readonly loanSettingService: LoanSettingService,
    private readonly configService: ConfigMiddlewareHelperService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.configService.getUser(req);
    const userKyc = await this.loanSettingService.findOne(user.id);
    if (!userKyc) {
      const message =
        'Please configure your application information before applying';
      throw new UnauthorizedException(
        responseStructure(false, message, {}, HttpStatus.UNAUTHORIZED),
      );
    }
    next();
  }
}
