import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  UnauthorizedException,
  HttpStatus
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import { LoginDto } from '../../modules/auth/dto/login.dto';
import { responseStructure } from 'src/common/helpers/response.structure';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const login = new LoginDto();
    const errors = [];
    Object.keys(body).forEach((key) => {
      
      login[key] = body[key];
    });
    
    try {
      await validateOrReject(login);
    } catch (errs) {
      errs.forEach((err) => {
        Object.values(err.constraints).forEach((constraint) =>
          errors.push(constraint),
        );
      });
    }

    if (errors.length) {
      throw new BadRequestException( responseStructure(false,errors[0],{},HttpStatus.BAD_REQUEST))
    }

    next();
  }
}
