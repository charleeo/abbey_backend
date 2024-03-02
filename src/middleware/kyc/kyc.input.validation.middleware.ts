import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { responseStructure } from 'src/common/helpers/response.structure';

@Injectable()
export class KYCInputVaidtion implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let error = false;
    let message = '';
    const kyc = req.body;
    if ('nin' in kyc === false && 'bvn' in kyc === false) {
      error = true;
      message = 'nin or bvn is required';
    } else if (kyc.bvn === '' && kyc.nin === '') {
      error = true;
      message = 'nin or bvn is required';
    }

    if (error) {
      throw new BadRequestException(
        responseStructure(false, message, {}, HttpStatus.BAD_REQUEST),
      );
    }
    next();
  }
}
