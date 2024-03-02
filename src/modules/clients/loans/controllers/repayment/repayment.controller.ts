import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  Request as NestRequest,
  Param,

  Request,
} from '@nestjs/common';
import {  Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RepaymentService } from '../../services/repayment/repayment.service';
import { LoanRepaymentDto } from '../../dto/loan.repayment.dto';
import { LoanRepaymentConfirmationDto } from '../../dto/repayment.confirmation.dto';

@Controller('repayment')
@UseGuards(AuthGuard('jwt'))
export class RepaymentController {
  constructor(private repaymentService: RepaymentService) {}

  @Post('repay')
  async create(
    @Body() loan: LoanRepaymentDto,
    @Res() res: Response,
  ): Promise<any> {
    return await this.repaymentService.processRepayment(loan, res);
  }

  @Post('confirm')
  async confirmRepayment(
    @Body() loan: LoanRepaymentConfirmationDto,
    @Res() res: Response,
  ): Promise<any> {
    return await this.repaymentService.confirmRepayment(loan, res);
  }

  @Post(':id/delete')
  async deleteRepayment(
    @Param('id') id,
    @Res() res: Response,
    @Request() req : Request
  ): Promise<any> {
    return await this.repaymentService.deleteRepayment(id, res,req);
  }
}
