import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { verifyToken } from 'src/common/helpers/jwt';
import { responseStructure } from 'src/common/helpers/response.structure';
import { KycService } from 'src/modules/clients/kyc/kyc.service';
import { ConfigMiddlewareHelperService } from 'src/modules/config/services/helpers.middleware.config';

@Injectable()
export class MustVerifyKycMiddleware implements NestMiddleware {
  constructor(
    private readonly kycService: KycService,
    private readonly configService: ConfigMiddlewareHelperService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.configService.getUser(req);

    const pendingKYC = await this.kycService.findPendingKYC(user);

    if (pendingKYC) {
      const message = 'Please contact your loan officer to verify your KYC';
      throw new UnauthorizedException(
        responseStructure(false, message, {}, HttpStatus.UNAUTHORIZED),
      );
    }
    next();
  }
}
