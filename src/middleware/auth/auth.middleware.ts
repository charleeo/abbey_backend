import { Injectable, NestMiddleware,BadRequestException, UnauthorizedException, HttpStatus } from '@nestjs/common';

import {Request,Response,NextFunction} from "express"
import { responseStructure } from 'src/common/helpers/response.structure'
import { verifyToken } from 'src/common/helpers/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: NextFunction) {
   const authorization=req.get("authorization");
   if(!authorization){
     throw new BadRequestException( responseStructure(false,"token is required",{},400))
    }

    const jwtPayload = authorization.replace("Bearer",'').trim()
    const verifiedToken = verifyToken(jwtPayload)
    const{payload,message,error}=verifiedToken
    if(error===true){
        throw new UnauthorizedException( responseStructure(false,message,{},HttpStatus.UNAUTHORIZED))
    }

    const currentTimestamp = Math.round(Number(new Date()) / 1000)
    if(verifiedToken.payload.exp < currentTimestamp){
      throw new UnauthorizedException( responseStructure(false,"Token has expired",{},HttpStatus.UNAUTHORIZED))
    }

    next();
  }
}
