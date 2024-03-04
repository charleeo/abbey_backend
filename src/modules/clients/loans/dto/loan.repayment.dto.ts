import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Loan } from '../entities/loan.entity';

export class LoanRepaymentDto {
  @IsNotEmpty()
  // @IsString()
  @IsNumber()
  public reference_number: number;

  @IsNotEmpty()
  public repayment_amount: number;
}
