import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';

import { responseStructure } from 'src/common/helpers/response.structure';
import { KycService } from 'src/modules/clients/kyc/kyc.service';
import { ConfigMiddlewareHelperService } from 'src/modules/config/services/helpers.middleware.config';

@Injectable()
export class KycMustExistsMiddleware implements NestMiddleware {
  constructor(
    private readonly kycService: KycService,
    private readonly configService: ConfigMiddlewareHelperService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.configService.getUser(req);
    const userKyc = await this.kycService.findKYCByUserId(user);
    if (!userKyc) {
      const message = 'Please upload your KYC data before applying';
      throw new UnauthorizedException(
        responseStructure(false, message, {}, HttpStatus.UNAUTHORIZED),
      );
    }
    next();
  }
}
