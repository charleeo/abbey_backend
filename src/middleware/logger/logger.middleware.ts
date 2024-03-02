import {  Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction,Request,Response } from 'express';
import { logData } from 'src/common/helpers/logs';


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
 async use( req: Request, res: Response, next: NextFunction) {
      await logData(req,res)
      next()
    }
}
