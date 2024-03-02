import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoanRepaymentDeletionDto {
  @IsNotEmpty()
  @IsString()
  public reference_number: string;
}
