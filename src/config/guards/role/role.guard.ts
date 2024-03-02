import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { verifyToken } from 'src/common/helpers/jwt';
import { ActionEnums } from 'src/storage/data/action.enums';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const actions = this.reflector.get<ActionEnums>(
      'actions',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.header('authorization');

    return this.checkRole(actions, bearerToken);
  }

  async checkRole(actions: ActionEnums, token: string): Promise<boolean> {
    let status = true;
    if (actions && actions.length > 0) {
      const actionsArray = actions.split('.');
      const roles: string[] = verifyToken(token.replace('Bearer', '').trim())
        .payload.actions;
      const isFounded = roles.some((role) => actionsArray.includes(role));
      if (!isFounded) {
        status = false;
      }
    } else {
      //if this guard is in actoin there should be some metadata attached else, there will be an error
      status = false;
    }

    if (!status) {
      throw new UnauthorizedException({
        message: `Unauthorised`,
        status: false,
        error: 'Unauthorised request',
        response: null,
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
    return status;
  }

  decodedRoleAndActions(bearerToken: string): string[] {
    const base64Payload = bearerToken.split('.')[1];
    const payloadBuffer = Buffer.from(base64Payload, 'base64');
    const updatedJwtPayload = JSON.parse(payloadBuffer.toString());
    return updatedJwtPayload.actions;
  }
}
