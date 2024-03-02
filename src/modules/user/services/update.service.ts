import { Response } from 'express';
import { BaseDataSource } from 'src/common/helpers/base.data.ource';
import { responseStructure } from 'src/common/helpers/response.structure';

import {
  HttpStatus,
  Injectable,
  Param,
  Req,
  Res,
} from '@nestjs/common';

import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../user.repository';

@Injectable()
export class UpdateUserService extends BaseDataSource {
  constructor(private usersRepository: UserRepository) {
    super(usersRepository);
  }

  /**
   * Upload  profile picture
   * @param req
   * @param response
   * @param params
   * @returns
   */
  async uploadProfile(
    @Req() req,
    @Res() response: Response,
    @Param() params,
  ): Promise<any> {
    let status = false;
    let message = '';
    let responseData = null;
    let statusCode: HttpStatus;
    const uuid = params.id;
    const existingFile = await this.usersRepository.findOneBy({ uuid });
    const updatedProfile = await this.updateEntity(uuid, 'uuid', {
      profile_picture: await this.uploadFile(req, {
        fieldName: 'profile_picture',
      }),
    });

    if (updatedProfile) {
      await this.deleteFileFromFolder(`public/${existingFile.profile_picture}`);
      message = 'Profile Image updated';
      responseData = updatedProfile;
      status = true;
      statusCode = HttpStatus.OK;
    } else {
      message = 'Profile not found';
      statusCode = HttpStatus.NOT_FOUND;
    }
    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  /**
   * Upload  profile data
   * @param req
   * @param response
   * @param params
   * @returns
   */
  async updateProfile(
    req: UpdateUserDto,
    @Res() response: Response,
    @Param() params,
  ): Promise<any> {
    let status = false;
    let message = '';
    let responseData = null;
    let statusCode: HttpStatus;
    const updatedProfile = await this.updateEntity(params.id, 'uuid', req);

    if (updatedProfile) {
      message = 'Profile  updated';
      responseData = updatedProfile;
      status = true;
      statusCode = HttpStatus.OK;
    } else {
      message = 'Profile not found';
      statusCode = HttpStatus.NOT_FOUND;
    }
    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }
}
