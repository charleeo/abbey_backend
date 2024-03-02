import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { PassportStrategy } from '@nestjs/passport';

export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      ignoreExpiration: true,
      secretOrKey: process.env.JWTKEY,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
