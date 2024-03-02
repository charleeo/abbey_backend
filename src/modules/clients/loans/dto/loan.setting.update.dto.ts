import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class LoanSettingUpdateDTO {
  @IsOptional()
  @IsString()
  public password: string;

  @IsOptional()
  @IsString()
  receiving_account: string;

  @IsOptional()
  @IsString()
  receiving_bank: string;

  @IsOptional()
  default_loan_type: number;
}
