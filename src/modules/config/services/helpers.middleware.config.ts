import { Users } from 'src/modules/user/entities/user.entity';
import { Request as ExpressRequest } from 'express';
import { verifyToken } from 'src/common/helpers/jwt';

export class ConfigMiddlewareHelperService {
  constructor() {}
  async getUser(req: ExpressRequest): Promise<Users> {
    const authorization = req.get('authorization');
    const jwtPayload = authorization.replace('Bearer', '').trim();
    return verifyToken(jwtPayload).payload;
  }
}
