import { Response } from 'express';

import {
  Body,
  Controller,
  Get,
  Post,
  Res,
} from '@nestjs/common';

import { UserRoleDto } from './dto/config.dto';
import { UserRoles } from './entities/user.role.entity';
import { ConfigService } from './services/config.service';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async create(): Promise<any> {
    return this.configService.create();
  }

  @Post('create/user/roles')
  async assignRoleToUser(@Body() user: UserRoleDto): Promise<UserRoles> {
    return await this.configService.assignRoleToUser(user);
  }

  @Get('get/loan/dependencies')
  async getLoandependencies(@Res() res: Response): Promise<any> {
    return await this.configService.getLoanDependencies(res);
  }

  @Get('set/loan/approval/types')
  async setLoanApprovalTypes(@Res() res: Response): Promise<any> {
    return await this.configService.setLoanApprovalTypes(res);
  }
}
