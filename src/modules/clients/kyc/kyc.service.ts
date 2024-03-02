import { IsNumber } from 'class-validator';
import { Response } from 'express';
import { paginate } from 'nestjs-typeorm-paginate';
import { BaseDataSource } from 'src/common/helpers/base.data.ource';
import { logErrors } from 'src/common/helpers/logging';
import { responseStructure } from 'src/common/helpers/response.structure';
import { VerificationEnums } from 'src/modules/entities/common.type';
import { Users } from 'src/modules/user/entities/user.entity';

import {
  HttpStatus,
  Injectable,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';

import { CreateKYCDTO } from './dto/create.dto';
import { UpdateKYCDTO } from './dto/update.dto';
import { VerifyKYCDTO } from './dto/verify.dto';
import { KYC } from './entities/kyc.entity';
import { KYCRepository } from './repositories/kyc.repository';

@Injectable()
export class KycService extends BaseDataSource {
  constructor(private kycRepo: KYCRepository) {
    super(kycRepo);
  }

  async create(
    kyc: CreateKYCDTO,
    user: Users,
    @Res() response: Response,
  ): Promise<any> {
    let status = false;
    let statusCode: HttpStatus;
    let message = '';
    let responseData = null;

    try {
      if (await this.findOne(user.id, 'user_id')) {
        message = 'KYC record exists';
        return response
          .status(HttpStatus.BAD_REQUEST)
          .send(responseStructure(status, message, {}, HttpStatus.BAD_REQUEST));
      }

      kyc['user'] = user.id; //always use the key that is in your entity defination, in this case, it is user and not userId
      kyc['user_id'] = user.id;
      responseData = await this.kycRepo.save(kyc);
      if (responseData !== null) {
        status = true;
        message = 'KYC record created';
        statusCode = HttpStatus.CREATED;
      }
    } catch (e) {
      logErrors(e);
      message = 'there was an error. please try again';
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  async findOne(value: any, fieldName: any): Promise<KYC> {
    const data = await this.kycRepo.findOne({
      where: { [`${fieldName}`]: value },
    });
    return data;
  }

  async findPendingKYC(user: Users): Promise<KYC> {
    const data = await this.kycRepo
      .createQueryBuilder('kyc')
      .where('kyc.kyc_verification_status = :status', {
        status: VerificationEnums.pending,
      })
      .andWhere('kyc.user_id = :userId', { userId: user.id })
      .getOne();

    return data;
  }
  async findKYCByUserId(user: Users): Promise<KYC> {
    const data = await this.kycRepo
      .createQueryBuilder('kyc')
      .where('kyc.user_id = :userId', { userId: user.id })
      .getOne();

    return data;
  }

  async index(@Res() response: Response, @Query() query: any): Promise<any> {
    let status = false;
    let error = null;
    let message = '';
    let responseData = null;
    let statusCode: HttpStatus;
    try {
      const qb =  this.kycRepo
        .createQueryBuilder('kyc')
        .leftJoinAndSelect('kyc.user', 'user');
      qb.orderBy('kyc.id', 'DESC');

      responseData = await this.paginate<KYC>(
        qb,
        query,
        process.env.APP_URL + 'kyc/all'
      );

      if (responseData['items'].length > 0) {
        message = 'Data found';
        status = true;
      }
      statusCode = HttpStatus.OK;
    } catch (e) {
      logErrors(e);
      error = e.message;
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'There was an error';
    }

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  async show(@Res() response: Response, @Param() params): Promise<any> {
    let status = false;
    let message = '';
    let responseData: object = null;
    let statusCode: HttpStatus;

    const kycId = params.id;
    responseData = await this.kycRepo.findOne({
      where: { id: kycId },
      relations: { user: true },
    });

    if (responseData) {
      message = 'KYC data found';
      status = true;
    } else message = 'No kyc found';
    statusCode = HttpStatus.OK;

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  async getKycByClientId(@Res() response: Response, @Param() params): Promise<any> {
    let status = false;
    let message = '';
    let responseData: object = null;
    let statusCode: HttpStatus;
    const kycId = params.id;
    responseData = await this.kycRepo.findOne({
      where: {user_id: kycId },
      relations: { user: true },
    });

    if (responseData) {
      message = 'KYC data found';
      status = true;
    } else message = 'No kyc found';
    statusCode = HttpStatus.OK;

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  async destroy(@Res() response: Response, @Param() params): Promise<any> {
    let status = false;
    let message = '';
    const responseData = null;
    let statusCode: HttpStatus;
    try {
      const kycId = params.id;
      const kyc = await this.kycRepo.findOneBy({ id: kycId });

      if (kyc) {
        await this.kycRepo.delete({ id: kyc.id });
        message = 'KYC data deleted';
        status = true;
      } else message = 'KYC not found';
      statusCode = HttpStatus.OK;
    } catch (e) {
      message = 'There was an error';
      logErrors(e.message);
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  async updateKYCStatus(
    kycDto: VerifyKYCDTO,
    @Res() response: Response,
    @Param() params: number,
  ): Promise<any> {
    let status = false;
    let message = '';
    let responseData = null;
    let statusCode: HttpStatus;

    // const kyc = await this.kycRepo.findOneBy({ id: kycDto.kyc_id });
    const kycId = params['id'];
    const kyc = await this.updateEntity(kycId, 'id', {
      kyc_verification_status: kycDto.status,
      remark: kycDto.remark,
    });

    if (kyc) {
      message = 'KYC status updated to ' + kycDto.status;
      responseData = kyc;
      status = true;
      statusCode = HttpStatus.OK;
    } else {
      message = 'KYC not found';
      statusCode = HttpStatus.NOT_FOUND;
    }

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  /**
   * Update kyc data
   * @param kycDto
   * @param response
   * @param params
   * @returns
   */
  async updateKYC(
    kycDto: UpdateKYCDTO,
    @Res() response: Response,
    @Param() params,
  ): Promise<any> {
    let status = false;
    let message = '';
    let responseData = null;
    let statusCode: HttpStatus;

    const updatedKYC = await this.updateEntity(params.id, 'id', {
      ...kycDto,
    });

    if (updatedKYC) {
      message = 'KYC  updated ';
      responseData = updatedKYC;
      status = true;
      statusCode = HttpStatus.OK;
    } else {
      message = 'KYC not found';
      statusCode = HttpStatus.NOT_FOUND;
    }
    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  /**
   * Upload kyc profile picture
   * @param req
   * @param response
   * @param params
   * @returns
   */
  async uploadKYCIDCard(
    @Req() req,
    @Res() response: Response,
    @Param() params,
  ): Promise<any> {
    let status = false;
    let message = '';
    let responseData = null;
    let statusCode: HttpStatus;

    const updatedKYC = await this.updateEntity(params.id, 'id', {
      id_card: await this.uploadFile(req, {
        fieldName: 'id_card',
      }),
    });

    if (updatedKYC) {
      message = 'KYC  updated ';
      responseData = updatedKYC;
      status = true;
      statusCode = HttpStatus.OK;
    } else {
      message = 'KYC not found';
      statusCode = HttpStatus.NOT_FOUND;
    }
    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }
}
