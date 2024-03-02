import { Injectable, Request } from '@nestjs/common';

import { Users } from 'src/modules/user/entities/user.entity';

@Injectable()
export class ConfigHelperService {
  constructor() {}
  async getUser(@Request() req): Promise<Users> {
    return req.user;
  }
}
