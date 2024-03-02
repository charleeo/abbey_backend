import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Loan } from '../entities/loan.entity';

export class LoanRepaymentDto {
  @IsNotEmpty()
  // @IsString()
  @IsNumber()
  public reference_number: string;

  @IsNotEmpty()
  public repayment_amount: number;

  @IsNotEmpty()
  // @IsNumber()
  public loan: Loan;
}
