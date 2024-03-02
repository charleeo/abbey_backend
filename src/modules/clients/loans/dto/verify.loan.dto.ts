import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApprovalStatus } from 'src/modules/entities/common.type';

export class ApproveLoanDto {
  @IsNotEmpty()
  @IsEnum(ApprovalStatus)
  public status: ApprovalStatus;

  @IsNotEmpty()
  @IsNumber()
  public loan_id: number;

  @IsNotEmpty()
  @IsString()
  comment:string
}
