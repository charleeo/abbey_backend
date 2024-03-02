import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { VerificationEnums } from 'src/modules/entities/common.type';

export class VerifyKYCDTO {
  @IsNotEmpty()
  @IsEnum(VerificationEnums)
  public status: VerificationEnums;

  @IsOptional()
  @IsString()
  @Length(3)
  public remark: string;
}
