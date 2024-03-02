import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { responseStructure } from 'src/common/helpers/response.structure';
import { ConfigMiddlewareHelperService } from 'src/modules/config/services/helpers.middleware.config';

@Injectable()
export class VerifyKycMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigMiddlewareHelperService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const isAdmin = (await this.configService.getUser(req)).is_admin;

    if (!isAdmin) {
      const message = 'You must be an admin to verify KYC';
      throw new UnauthorizedException(
        responseStructure(false, message, {}, HttpStatus.UNAUTHORIZED),
      );
    }
    next();
  }
}
