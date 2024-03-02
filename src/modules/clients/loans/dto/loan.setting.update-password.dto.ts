import {
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class LoanSettingUpdatePasswordDTO {
  @IsNotEmpty()
  @IsString()
  @Length(6,6)
  public password: string;
}
