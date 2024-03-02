import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { responseStructure } from 'src/common/helpers/response.structure';
import {
  ConfigMiddlewareHelperService,
} from 'src/modules/config/services/helpers.middleware.config';

import {
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class IsAdminMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigMiddlewareHelperService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const isAdmin = (await this.configService.getUser(req)).is_admin;

    if (!isAdmin) {
      const message = 'You are not authorized to perform this action';
      const statusCode = HttpStatus.UNAUTHORIZED;
      throw new UnauthorizedException(
        responseStructure(false, message, {}, statusCode),
      );
    }
    next();
  }
}
