import {
  Body,
  Controller,
  Post,
  Request as NestRequest,
  UseGuards,
  Res,
  Get,
  Query,
  Param,
  Delete,
  Put,
  UploadedFile,
  Req,
} from '@nestjs/common';

import { Response } from 'express';
import { CreateKYCDTO } from './dto/create.dto';
import { KycService } from './kyc.service';
import { KYC } from './entities/kyc.entity';
import { AuthGuard } from '@nestjs/passport';
import { VerifyKYCDTO } from './dto/verify.dto';
import { UpdateKYCDTO } from './dto/update.dto';

@Controller('kyc')
@UseGuards(AuthGuard('jwt'))
export class KycController {
  constructor(private kcyService: KycService) {}

  @Post('create')
  async create(
    @Body() kyc: CreateKYCDTO,
    @NestRequest() req,
    @Res() res: Response,
  ): Promise<any> {
    const user = req.user;
    return await this.kcyService.create(kyc, user, res);
  }

  @Put(':id/update/status')
  async updateKYCStatus(
    @Body() kyc: VerifyKYCDTO,
    @Res() res: Response,
    @Param() param: any,
  ): Promise<any> {
    return await this.kcyService.updateKYCStatus(kyc, res, param);
  }

  @Get('all')
  async index(@Res() res: Response, @Query() query: any): Promise<any> {
    return await this.kcyService.index(res, query);
  }

  @Get(':id')
  async show(@Res() res: Response, @Param() param: any): Promise<any> {
    return await this.kcyService.show(res, param);
  }

  @Get(':id/user')
  async getKycByClientId(@Res() res: Response, @Param() param: any): Promise<any> {
    return await this.kcyService.getKycByClientId(res, param);
  }

  @Delete(':id')
  async delete(@Res() res: Response, @Param() param: any): Promise<KYC> {
    return await this.kcyService.destroy(res, param);
  }

  @Put(':id')
  async update(
    @Body() kyc: UpdateKYCDTO,
    @Res() res: Response,
    @Param() params,
  ): Promise<KYC> {
    return await this.kcyService.updateKYC(kyc, res, params);
  }

  @Put(':id/id_card')
  async uploadKYCProfile(
    @Req() req,
    @Res() res: Response,
    @Param() params,
  ): Promise<KYC> {
    return await this.kcyService.uploadKYCIDCard(req, res, params);
  }
}
