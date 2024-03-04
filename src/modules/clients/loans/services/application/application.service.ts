import { HttpStatus, Injectable, Res, Body, Request, Req } from '@nestjs/common';

import { responseStructure } from 'src/common/helpers/response.structure';

import { Response } from 'express';

import {
  fullDateWithoutTime,
  generateReference,
  setPaymentCommencementDateMonthly,
  setPaymentDueDateForNonDaily,
} from 'src/common/helpers/generals';

import {
  ApprovalStatus,
  DaysAndWeekAndMonths,
  InterestPaymentStatus,
} from 'src/modules/entities/common.type';

import { LoanRepository } from '../../repositories/loan.repository';
import { LoanApplicationDto } from '../../dto/apply.for.loan.dto';
import { ApproveLoanDto } from '../../dto/verify.loan.dto';
import { LoanRepaymentDurationCategory } from 'src/modules/config/entities/loans.category.entity';
import { BaseDataSource } from 'src/common/helpers/base.data.ource';
import { Loan } from '../../entities/loan.entity';
import { LoanRepaymentDurationCategoryRepository } from 'src/modules/config/repository/loan.repayment.duration.category.repository';
import { MortgageRepository } from 'src/modules/config/repository/Mortgage.repository';
import { MortGage } from 'src/modules/config/entities/mortgage.entity';
import { LoanRepaymentPlanRepository } from 'src/modules/config/repository/LoanRepaymentPlan.repository';

@Injectable()
export class ApplicationService extends BaseDataSource {
  constructor(
    private readonly loanRepo: LoanRepository,
    private readonly mortgageRepo: MortgageRepository,
    private readonly loanCateogry: LoanRepaymentDurationCategoryRepository,
    private readonly loanRepaymentPlanRepo: LoanRepaymentPlanRepository,
  ) {
    super(loanRepo);
  }

  /**
   * Process the loan and save records to database
   * @param dto
   * @param response
   * @param req
   * @returns
   */
  async applayForLoan(
    @Body() dto: LoanApplicationDto,
    @Res() response: Response,
    @Request() req: Request,
  ): Promise<any> {
    let status = false;
    let statusCode: HttpStatus;
    let message = '';
    let responseData = null;
    const user = await this.getUser(req);

    const repaymenDurationtPlan =
      await this.getRepaymentDurationCategoriesById(
        dto.loan_durtion_category_id,
      );

    const mortgage = await this.mortgageRepo.findOneByOrFail({id:dto.mortgage})

    const repaymentPlan = await this.loanRepaymentPlanRepo.findOneByOrFail({id:dto.repayment_plan})

    const {
      repayment_amount,
      interest,
      amount,
      repayment_commencement_date,
      repayment_due_date,
      start_date,
    } = await this.processLoans(mortgage,  repaymenDurationtPlan, repaymentPlan.name as any);

    let repaymentAmount = Number(repayment_amount).toFixed(2);

    let repayment_counts = this.repaymentCount(repaymenDurationtPlan);

    if(repaymentPlan.name === DaysAndWeekAndMonths.MONTHLY){
      repayment_counts *= 12
    }

    let loanRepaymentTotal = parseFloat(amount) + parseFloat(interest)

    //Save the loan information to database and return the response
    responseData = await this.loanRepo.save({
      customer_id: user.id,
      mortgage:mortgage,
      amount: amount,
      interest: interest,
      repayment_rate: parseFloat(repaymentAmount),
      repayment_intervals: repayment_counts,
      loan_duration_category: dto.loan_durtion_category_id,
      expected_repayment_amount: loanRepaymentTotal,
      reference: generateReference(),
      loanRepaymentPlan: repaymentPlan,
      repayment_due_date: repayment_due_date,
      repayment_start_date: repayment_commencement_date,
      issue_date: start_date,
    });

    if (responseData) {
      message = 'Data creted';
      status = true;
      statusCode = HttpStatus.CREATED;
    }

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

  /**
   *Set how much to be repaid monthly
   * @param amount
   * @param repaymentDuration
   */
  protected calculateMonthlyRepaymentPlan(
    amount: number,
    totalMortgageYears:number,
    interest =0
  ) {
    const total = parseFloat (amount as any) + parseFloat( interest as any)
    const planDuration = 12 * totalMortgageYears
      return total / planDuration;
  }

  /**
   *Set how much to be repaid monthly
   * @param amount
   * @param repaymentDuration
   */
  protected calculateYearlyRepaymentPlan(
    amount: number,
    totalMortgageYears:number,
    interest =0
  ) {
      const total = parseFloat (amount as any) + parseFloat(interest as any)
      return total / totalMortgageYears;
  }

  protected calculateInterest(amount, rate): number {
    return (rate / 100) * amount;
  }

  protected getRepaymentDurationLoanPlan(
    category: LoanRepaymentDurationCategory,
  ): number {
    const paymentDurationPlan = category.category_tagline.split('_')[0];
    return parseInt(paymentDurationPlan);
  }

  /**
   * Format the montly loans application process
   */
  protected monthlyLoansFormating(mortgage: MortGage, repaymentCat): any {
    const amount = mortgage.price;

    const grantedDate =fullDateWithoutTime();

    const interest: number = this.calculateInterest(amount, mortgage.interest);

    const repaymentDuration = this.getRepaymentDurationLoanPlan(repaymentCat);

    const repaymentCommencementDate: Date =
      setPaymentCommencementDateMonthly(new Date(grantedDate));

    const repaymentAmount: number = this.calculateMonthlyRepaymentPlan(
      amount,
      repaymentDuration,
      interest
    );
    const repaymentDueDate: Date = setPaymentDueDateForNonDaily(
      grantedDate,
      repaymentDuration,
    );

    return {
      interest: interest,
      repayment_amount: repaymentAmount,
      repayment_due_date: repaymentDueDate,
      repayment_commencement_date: repaymentCommencementDate,
      amount: amount,
      start_date: grantedDate,
    };
  }

  /**
   * Format the montly loans application process
   */
  protected yearlyLoansFormating(mortgage: MortGage, repaymentCat): any {
    const amount = mortgage.price;

    const grantedDate =fullDateWithoutTime();

    const interest: number = this.calculateInterest(amount, mortgage.interest);

    const repaymentDuration = this.getRepaymentDurationLoanPlan(repaymentCat);

    const repaymentCommencementDate: Date =
      setPaymentCommencementDateMonthly(new Date(grantedDate));

    const repaymentAmount: number = this.calculateYearlyRepaymentPlan(
      amount,
      repaymentDuration,
      interest
    );

    const repaymentDueDate: Date = setPaymentDueDateForNonDaily(
      grantedDate,
      repaymentDuration,
      DaysAndWeekAndMonths.YEARLY
    );

    return {
      interest: interest,
      repayment_amount: repaymentAmount,
      repayment_due_date: repaymentDueDate,
      repayment_commencement_date: repaymentCommencementDate,
      amount: amount,
      start_date: grantedDate,
    };
  }


  /**
   * Start the loan application process and return any of the loan type
   * @params dto
   */
  protected async processLoans(
    mortgage,
    loanDurationPlan: LoanRepaymentDurationCategory,
    plan = DaysAndWeekAndMonths.MONTHLY
  ): Promise<any> {
    
    if(plan === DaysAndWeekAndMonths.YEARLY){
      return this.yearlyLoansFormating(mortgage, loanDurationPlan);
    }

    return this.monthlyLoansFormating(mortgage, loanDurationPlan);
  }

  /**
   * Calculate how many times the payment willbe made
   * @params category
   * @params dto
   */
  protected repaymentCount( repaymentPlan): number {
    return this.getRepaymentDurationLoanPlan(repaymentPlan);    
  }

  /**
   * approve a new loan request and returns the details
   * @param dto
   * @param response
   * @returns
   */
  public async approveLoan(
    @Body() dto: ApproveLoanDto,
    @Res() response: Response,
  ): Promise<any> {
    let status = false;
    let statusCode: HttpStatus;
    let message = '';
    let responseData = null;

    const loanData = await this.loanRepo.findOneOrFail({where:{id:dto.loan_id},
       relations:['loanRepaymentPlan','loan_duration_category'],
     })
     /**
      * Soft delete the record for feature records keeping
      */
     if(dto.status === ApprovalStatus.decline){
        await this.loanRepo.createQueryBuilder()
              .softDelete()
              .where('reference=:ref',{ref:loanData.reference})
              .execute()
     }    

    const repaymenDurationtPlan =loanData.loan_duration_category
    const repayment_plan = loanData.loanRepaymentPlan
    const {
      repayment_commencement_date,
      repayment_due_date,
      start_date,
    } = await this.processLoans(dto, repaymenDurationtPlan,repayment_plan.name as any);
   
    const loan = await this.updateEntity(dto.loan_id, 'id', {
      verification_status: dto.status,
      comment: dto.comment,
      repayment_due_date: repayment_due_date,
      repayment_start_date: repayment_commencement_date,
      issue_date: start_date,
    });

    if (!loan) {
      message = 'Loan does not exists';
      statusCode = HttpStatus.NOT_FOUND;
    } else {
      message = `Loan was/is ${dto.status.split('_').join(' ')}`;
      status = true;
      statusCode = HttpStatus.CREATED;
      responseData = loan;
    }

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }

 
/**
 * 
 * @param reference 
 * @param response 
 * @param req 
 * @returns any
 */
  public async deleteLoan(
    reference,
    @Res() response: Response,
     @Req() req: Request,
  ) {
    let status = false;
    let statusCode: HttpStatus;
    let message = 'no data found';
    let responseData = {};
     const user = await this.getUser(req);

    const loanData:Loan = await this.loanRepo.findOneByOrFail({reference, verification_status:ApprovalStatus.pending})

    if(user.is_admin){
    
      await this.loanRepo.createQueryBuilder()
      .softDelete()
      .where('reference=:ref',{ref:loanData.reference})
      .execute()
      
    }else {
      await this.loanRepo.delete(loanData.id)
    }

    if(loanData){
      statusCode = HttpStatus.CREATED;
      status = true;
      message = 'Loan repayment data updated';
      responseData = loanData
    }

    return response
      .status(statusCode)
      .send(responseStructure(status, message, responseData, statusCode));
  }


  async getRepaymentDurationCategoriesById(id) {
    return await this.loanCateogry.findOneOrFail({
      where: { id },
    });
  }
}
