import { Request, Response } from 'express';

import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoanDataService } from '../../services/loan-data/loan-data.service';

@Controller('loan-data')
@UseGuards(AuthGuard('jwt'))
export class LoanDataController {
  constructor(private loanDataService: LoanDataService) {}

  @Get('user/loans')
  async getAUserLoans(@Req() user: any, @Res() res: Response, @Query() query:any, @Req() req: Request): Promise<any> {
    return await this.loanDataService.userLoans(user.user, res,query,req);
  }


  @Get('counts')
  async loansCount(@Req() user: any, @Res() res: Response, @Query() query:any, @Req() req: Request): Promise<any> {
    return await this.loanDataService.dashboardData(user.user, res,query);
  }

  @Get('charts/data')
  async chartsData(@Req() user: any, @Res() res: Response, @Query() query:any): Promise<any> {
    return await this.loanDataService.chartsData(user.user, res,query);
  }
}
