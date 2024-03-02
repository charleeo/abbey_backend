import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class LoanSettingVerifyPasswordDTO {
  @IsNotEmpty()
  @IsString()
  public password: string;
}
