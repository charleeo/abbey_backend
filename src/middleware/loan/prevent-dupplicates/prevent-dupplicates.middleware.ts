import { NextFunction, Request, Response } from 'express';
import { responseStructure } from 'src/common/helpers/response.structure';
import { LoanDataService } from 'src/modules/clients/loans/services/loan-data/loan-data.service';
import { ConfigMiddlewareHelperService } from 'src/modules/config/services/helpers.middleware.config';
import { ApprovalStatus } from 'src/modules/entities/common.type';

import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException
} from '@nestjs/common';

@Injectable()
export class PreventDupplicatesMiddleware implements NestMiddleware {
  constructor(
    private readonly loanService: LoanDataService,
    private readonly configService: ConfigMiddlewareHelperService
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.configService.getUser(req);
    const pendingLoan = await this.loanService.getAloanForAUSer(
      user,
      ApprovalStatus.pending
    );

    if (pendingLoan) {
      const message =
        'You have un approved loan. Please contact your loan officer before applying for a new loan';
      throw new UnauthorizedException(
        responseStructure(false, message, {}, HttpStatus.UNAUTHORIZED)
      );
    }
    next();
  }
}
