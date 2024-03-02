import { Strategy } from 'passport-local';
import { responseStructure } from 'src/common/helpers/response.structure';

import {
  BadRequestException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      const message = 'Invalid credentials supplied';
      throw new BadRequestException(
        responseStructure(false, message, {}, HttpStatus.BAD_REQUEST),
      );
    }
    return user;
  }
}
