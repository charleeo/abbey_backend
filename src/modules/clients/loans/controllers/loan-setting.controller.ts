import { Response } from 'express';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request as NestRequest,
  Res,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoanSettingDTO } from '../dto/loan.setting.dto';
import { LoanSettingVerifyPasswordDTO } from '../dto/loan.setting.verify-password.dto';
import { LoanSettingService } from '../services/loan.settings.service';
import { LoanSettingUpdateDTO } from '../dto/loan.setting.update.dto';
import { LoanSettingUpdatePasswordDTO } from '../dto/loan.setting.update-password.dto';

@Controller('loan-setting')
@UseGuards(AuthGuard('jwt'))
export class LoanSettingController {
  constructor(private loanSettingService: LoanSettingService) {}

  @Post('/')
  async create(
    @Body() loan: LoanSettingDTO,
    @Res() res,
    @NestRequest() req,
  ): Promise<any> {
    return await this.loanSettingService.configure(loan, res, req);
  }

  @Put('/')
  async update(
    @Body() loan: LoanSettingUpdateDTO,
    @Res() res,
    @NestRequest() req,
  ): Promise<any> {
    return await this.loanSettingService.configure(loan, res, req);
  }

  @Get(':id')
  async show(@Res() res: Response, @Param() param: any): Promise<any> {
    return await this.loanSettingService.show(res, param);
  }

  @Post(':id/verify-password')
  async verifyPassword(
    @Res() res: Response,
    @Param() param: any,
    @Body() dto: LoanSettingVerifyPasswordDTO,
  ): Promise<any> {
    return await this.loanSettingService.verifyPassword(res, param, dto);
  }

  
  @Put(':id/change/password')
  async changePassword(
    @Res() res: Response,
    @Param() param: any,
    @Body() dto: LoanSettingUpdatePasswordDTO,
  ): Promise<any> {
    return await this.loanSettingService.changePassword(res, param, dto);
  }

}
