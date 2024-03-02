import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoanRepaymentConfirmationDto {
  @IsNotEmpty()
  @IsString()
  public reference_number: string;

  @IsNotEmpty()
  // @IsBoolean()
  public confirmation_status: string;
}
