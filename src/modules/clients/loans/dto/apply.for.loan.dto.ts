import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { MortGage } from 'src/modules/config/entities/mortgage.entity';

export class LoanApplicationDto {

  @IsNotEmpty()
  public loan_durtion_category_id: number|string|any;
  
  @IsNotEmpty()
  public mortgage : number

  @IsNotEmpty()
  public repayment_plan : number
}
