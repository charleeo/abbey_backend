import {
  Body,
  Controller,
  Post,
  Request as NestRequest,
  UseGuards,
  Res,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { LoanApplicationDto } from '../dto/apply.for.loan.dto';

import { AuthGuard } from '@nestjs/passport';
import { ApproveLoanDto } from '../dto/verify.loan.dto';
import { ApplicationService } from '../services/application/application.service';

@Controller('loans')
@UseGuards(AuthGuard('jwt'))
export class LoansController {
  constructor(private loanService: ApplicationService) {}

  @Post('apply')
  async create(
    @Body() loan: LoanApplicationDto,
    @Res() res: Response,
    @NestRequest() req: any,
  ): Promise<any> {
    return await this.loanService.applayForLoan(loan, res, req);
  }
  @Post('approve')
  async approve(
    @Body() loan: ApproveLoanDto,
    @Res() res: Response,
  ): Promise<any> {
    return await this.loanService.approveLoan(loan, res);
  }

  @Post(':id/delete')
  async deleteLoan(
    @Param('id') id,
    @Res() res: Response,
    @NestRequest() req : any
  ): Promise<any> {
    return await this.loanService.deleteLoan(id, res,req);
  }
}
