import { IsEnum, IsOptional, Length, Validate } from 'class-validator';
import { IsImageFile } from 'src/config/pipes/validate.image.pipe';
import { Gender } from 'src/modules/entities/common.type';

import { KYC } from '../entities/kyc.entity';
import { ValidateField } from '../Validations/ValidateField';

export class UpdateKYCDTO {
  @IsOptional()
  @Length(2, 225)
  public firstname: string;

  @IsOptional()
  @Length(2, 225)
  public lastname: string;

  @IsOptional()
  @Length(10, 225)
  public address: string;

  @IsOptional()
  @IsEnum(Gender)
  public gender: Gender;

  @Validate(ValidateField, [KYC, 'nin'])
  @IsOptional()
  nin: string;

  @Validate(ValidateField, [KYC, 'bvn'])
  @IsOptional()
  bvn: string;

  @IsOptional()
  @Validate(ValidateField, [KYC, 'phone'])
  @Length(10)
  phone: string;

  @IsOptional()
  @Length(10)
  id_card_type: string;

  @IsOptional()
  @IsImageFile({ message: 'invalid mime type received!' })
  file: any;
}
