import {
  Injectable,
  NestMiddleware,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { responseStructure } from 'src/common/helpers/response.structure';
import { ConfigMiddlewareHelperService } from 'src/modules/config/services/helpers.middleware.config';

@Injectable()
export class ApplyMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigMiddlewareHelperService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    let message = '';
    const isAdmin = (await this.configService.getUser(req)).is_admin;

    if (isAdmin) {
      message = "Admins can't apply for loaanss";
      throw new UnauthorizedException(
        responseStructure(false, message, {}, HttpStatus.UNAUTHORIZED),
      );
    }
    next();
  }
}
