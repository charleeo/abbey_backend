import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { InterestPaymentStatus } from 'src/modules/entities/common.type';

export class LoanApplicationDto {
  @IsNotEmpty()
  public amount: number;

  @IsOptional()
  // @IsDate()
  public grantedDate: Date;

  @IsNotEmpty()
  public loan_durtion_category_id: number|string|any;

  @IsNotEmpty()
  public loan_type: number | string | any;

  @IsNotEmpty()
  @IsEnum(InterestPaymentStatus)
  public interest_payment_status: InterestPaymentStatus;
}
